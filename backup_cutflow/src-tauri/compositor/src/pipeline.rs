use crate::context::GpuContext;
use wgpu::util::DeviceExt;

/// Parameters for a color-grade effect pass.
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
#[repr(C)]
pub struct EffectParams {
    pub brightness: f32,
    pub contrast: f32,
    pub saturation: f32,
    pub _pad: f32,
}

impl Default for EffectParams {
    fn default() -> Self {
        Self {
            brightness: 1.0,
            contrast: 1.0,
            saturation: 1.0,
            _pad: 0.0,
        }
    }
}

/// Simple WGSL compute shader that applies colour adjustments to an RGBA texture.
const COLOUR_GRADE_SHADER: &str = r#"
@group(0) @binding(0) var src_tex: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(1) var dst_tex: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: EffectParams;

struct EffectParams {
    brightness: f32,
    contrast: f32,
    saturation: f32,
    _pad: f32,
};

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    let pixel = textureLoad(src_tex, id.xy);
    var r = f32(pixel.r) / 255.0;
    var g = f32(pixel.g) / 255.0;
    var b = f32(pixel.b) / 255.0;

    // Contrast
    r = (r - 0.5) * params.contrast + 0.5;
    g = (g - 0.5) * params.contrast + 0.5;
    b = (b - 0.5) * params.contrast + 0.5;

    // Brightness
    r = r * params.brightness;
    g = g * params.brightness;
    b = b * params.brightness;

    // Saturation (luminance-preserving)
    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = mix(luma, r, params.saturation);
    g = mix(luma, g, params.saturation);
    b = mix(luma, b, params.saturation);

    // Clamp
    r = clamp(r, 0.0, 1.0);
    g = clamp(g, 0.0, 1.0);
    b = clamp(b, 0.0, 1.0);

    textureStore(dst_tex, id.xy, vec4(
        u32(r * 255.0),
        u32(g * 255.0),
        u32(b * 255.0),
        pixel.a
    ));
}
"#;

/// A compute pipeline that can apply colour-grade effects to frame textures.
pub struct ColourGradePipeline {
    compute_pipeline: wgpu::ComputePipeline,
    bind_group_layout: wgpu::BindGroupLayout,
    params_buffer: wgpu::Buffer,
    current_params: EffectParams,
}

impl ColourGradePipeline {
    pub fn new(ctx: &GpuContext) -> Self {
        let bind_group_layout =
            ctx.device
                .create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                    label: Some("colour-grade-bind-group-layout"),
                    entries: &[
                        // src texture (read)
                        wgpu::BindGroupLayoutEntry {
                            binding: 0,
                            visibility: wgpu::ShaderStages::COMPUTE,
                            ty: wgpu::BindingType::StorageTexture {
                                access: wgpu::StorageTextureAccess::WriteOnly,
                                format: wgpu::TextureFormat::Rgba8Unorm,
                                view_dimension: wgpu::TextureViewDimension::D2,
                            },
                            count: None,
                        },
                        // dst texture (write)
                        wgpu::BindGroupLayoutEntry {
                            binding: 1,
                            visibility: wgpu::ShaderStages::COMPUTE,
                            ty: wgpu::BindingType::StorageTexture {
                                access: wgpu::StorageTextureAccess::WriteOnly,
                                format: wgpu::TextureFormat::Rgba8Unorm,
                                view_dimension: wgpu::TextureViewDimension::D2,
                            },
                            count: None,
                        },
                        // uniform params
                        wgpu::BindGroupLayoutEntry {
                            binding: 2,
                            visibility: wgpu::ShaderStages::COMPUTE,
                            ty: wgpu::BindingType::Buffer {
                                ty: wgpu::BufferBindingType::Uniform,
                                has_dynamic_offset: false,
                                min_binding_size: None,
                            },
                            count: None,
                        },
                    ],
                });

        let shader_module = ctx
            .device
            .create_shader_module(wgpu::ShaderModuleDescriptor {
                label: Some("colour-grade-shader"),
                source: wgpu::ShaderSource::Wgsl(COLOUR_GRADE_SHADER.into()),
            });

        let compute_pipeline =
            ctx.device
                .create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
                    label: Some("colour-grade-pipeline"),
                    layout: Some(
                        &ctx.device
                            .create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                                label: Some("colour-grade-pipeline-layout"),
                                bind_group_layouts: &[&bind_group_layout],
                                push_constant_ranges: &[],
                            }),
                    ),
                    module: &shader_module,
                    entry_point: "main",
                    cache: None,
                    compilation_options: wgpu::PipelineCompilationOptions::default(),
                });

        let params_buffer = ctx
            .device
            .create_buffer_init(&wgpu::util::BufferInitDescriptor {
                label: Some("colour-grade-params"),
                contents: bytemuck::bytes_of(&EffectParams::default()),
                usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            });

        Self {
            compute_pipeline,
            bind_group_layout,
            params_buffer,
            current_params: EffectParams::default(),
        }
    }

    pub fn set_params(&mut self, ctx: &GpuContext, params: EffectParams) {
        self.current_params = params;
        ctx.queue.write_buffer(
            &self.params_buffer,
            0,
            bytemuck::bytes_of(&params),
        );
    }

    pub fn apply(
        &self,
        ctx: &GpuContext,
        src_texture: &wgpu::Texture,
        dst_texture: &wgpu::Texture,
        width: u32,
        height: u32,
    ) {
        let src_view = src_texture.create_view(&wgpu::TextureViewDescriptor {
            label: Some("colour-grade-src-view"),
            ..Default::default()
        });
        let dst_view = dst_texture.create_view(&wgpu::TextureViewDescriptor {
            label: Some("colour-grade-dst-view"),
            ..Default::default()
        });

        let bind_group = ctx
            .device
            .create_bind_group(&wgpu::BindGroupDescriptor {
                label: Some("colour-grade-bind-group"),
                layout: &self.bind_group_layout,
                entries: &[
                    wgpu::BindGroupEntry {
                        binding: 0,
                        resource: wgpu::BindingResource::TextureView(&src_view),
                    },
                    wgpu::BindGroupEntry {
                        binding: 1,
                        resource: wgpu::BindingResource::TextureView(&dst_view),
                    },
                    wgpu::BindGroupEntry {
                        binding: 2,
                        resource: wgpu::BindingResource::Buffer(
                            self.params_buffer.as_entire_buffer_binding(),
                        ),
                    },
                ],
            });

        let mut encoder = ctx
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("colour-grade-encoder"),
            });

        {
            let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                label: Some("colour-grade-pass"),
                timestamp_writes: None,
            });
            pass.set_pipeline(&self.compute_pipeline);
            pass.set_bind_group(0, &bind_group, &[]);
            // Dispatch enough workgroups to cover the texture
            let workgroup_x = (width + 15) / 16;
            let workgroup_y = (height + 15) / 16;
            pass.dispatch_workgroups(workgroup_x, workgroup_y, 1);
        }

        ctx.queue.submit(Some(encoder.finish()));
    }
}

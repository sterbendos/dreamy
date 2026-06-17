pub mod context;
pub mod pipeline;

use context::{CompositorError, GpuContext};
use pipeline::{ColourGradePipeline, EffectParams};
use std::path::Path;

/// The main compositor handle, wrapping GPU state and pipelines.
pub struct Compositor {
    pub ctx: GpuContext,
    pub colour_grade: ColourGradePipeline,
    width: u32,
    height: u32,
    src_texture: wgpu::Texture,
    dst_texture: wgpu::Texture,
}

impl Compositor {
    /// Create a new GPU compositor for the given frame dimensions.
    pub async fn new(width: u32, height: u32) -> Result<Self, CompositorError> {
        let ctx = GpuContext::new().await?;
        let src_texture = ctx.create_texture(width, height, Some("compositor-src"));
        let dst_texture = ctx.create_texture(width, height, Some("compositor-dst"));
        let colour_grade = ColourGradePipeline::new(&ctx);

        Ok(Self {
            ctx,
            colour_grade,
            width,
            height,
            src_texture,
            dst_texture,
        })
    }

    /// Resize the internal textures if the output dimensions change.
    pub fn resize(&mut self, width: u32, height: u32) {
        if width != self.width || height != self.height {
            self.src_texture = self.ctx.create_texture(width, height, Some("compositor-src"));
            self.dst_texture = self.ctx.create_texture(width, height, Some("compositor-dst"));
            self.width = width;
            self.height = height;
        }
    }

    /// Upload a raw RGBA frame to the source texture.
    pub fn upload_frame(&self, data: &[u8], width: u32, height: u32) {
        self.ctx
            .upload_to_texture(&self.src_texture, data, width, height);
    }

    /// Apply colour-grade effects using the GPU compute pipeline.
    pub fn apply_effects(&mut self, params: &EffectParams) {
        self.colour_grade.set_params(&self.ctx, *params);
        self.colour_grade.apply(
            &self.ctx,
            &self.src_texture,
            &self.dst_texture,
            self.width,
            self.height,
        );
    }

    /// Read the processed frame back from the destination texture into a CPU buffer.
    pub fn read_frame(&self) -> Result<Vec<u8>, CompositorError> {
        let readback_buffer = self
            .ctx
            .read_texture_to_buffer(&self.dst_texture, self.width, self.height);

        let buffer_slice = readback_buffer.slice(..);
        let (sender, receiver) = std::sync::mpsc::channel();
        buffer_slice.map_async(wgpu::MapMode::Read, move |result| {
            let _ = sender.send(result);
        });
        self.ctx.device.poll(wgpu::Maintain::Wait);
        receiver
            .recv()
            .map_err(|_| CompositorError::ReadbackFailed)?
            .map_err(|_| CompositorError::ReadbackFailed)?;

        let data = buffer_slice.get_mapped_range().to_vec();
        readback_buffer.unmap();

        Ok(data)
    }

    /// Process a raw RGBA frame: upload, apply effects, and read back.
    /// Returns the processed RGBA pixel data.
    pub fn process_frame(
        &mut self,
        rgba_data: &[u8],
        width: u32,
        height: u32,
        params: Option<&EffectParams>,
    ) -> Result<Vec<u8>, CompositorError> {
        self.resize(width, height);
        self.upload_frame(rgba_data, width, height);
        self.apply_effects(params.unwrap_or(&EffectParams::default()));
        self.read_frame()
    }

    /// Save a processed frame as a PNG file.
    pub fn save_frame_as_png(
        &mut self,
        rgba_data: &[u8],
        width: u32,
        height: u32,
        params: Option<&EffectParams>,
        path: &Path,
    ) -> Result<(), CompositorError> {
        let processed = self.process_frame(rgba_data, width, height, params)?;
        image::save_buffer(path, &processed, width, height, image::ColorType::Rgba8)
            .map_err(|e| CompositorError::Internal(e.to_string()))?;
        Ok(())
    }
}

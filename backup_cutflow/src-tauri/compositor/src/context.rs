pub struct GpuContext {
    pub device: wgpu::Device,
    pub queue: wgpu::Queue,
    pub adapter_info: wgpu::AdapterInfo,
}

impl GpuContext {
    pub async fn new() -> Result<Self, CompositorError> {
        let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
            backends: wgpu::Backends::PRIMARY,
            ..Default::default()
        });

        // Enumerate adapters and explicitly prefer the discrete GPU (NVIDIA RTX).
        let all_adapters = instance.enumerate_adapters(wgpu::Backends::PRIMARY);
        let adapter = all_adapters
            .into_iter()
            .find(|a| a.get_info().device_type == wgpu::DeviceType::DiscreteGpu)
            .or_else(|| {
                instance
                    .enumerate_adapters(wgpu::Backends::PRIMARY)
                    .into_iter()
                    .find(|a| a.get_info().device_type == wgpu::DeviceType::IntegratedGpu)
            })
            .ok_or(CompositorError::NoAdapter)?;

        let adapter_info = adapter.get_info();
        eprintln!(
            "GPU compositor adapter: {} ({:?}) device_type={:?}",
            adapter_info.name,
            adapter_info.backend,
            adapter_info.device_type,
        );

        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    label: Some("cutflow-compositor-device"),
                    required_features: wgpu::Features::empty(),
                    required_limits: wgpu::Limits::default(),
                    memory_hints: wgpu::MemoryHints::Performance,
                },
                None,
            )
            .await
            .map_err(CompositorError::DeviceLost)?;

        Ok(Self {
            device,
            queue,
            adapter_info,
        })
    }

    pub fn create_texture(
        &self,
        width: u32,
        height: u32,
        label: Option<&str>,
    ) -> wgpu::Texture {
        self.device.create_texture(&wgpu::TextureDescriptor {
            label,
            size: wgpu::Extent3d {
                width,
                height,
                depth_or_array_layers: 1,
            },
            mip_level_count: 1,
            sample_count: 1,
            dimension: wgpu::TextureDimension::D2,
            format: wgpu::TextureFormat::Rgba8Unorm,
            view_formats: &[],
            usage: wgpu::TextureUsages::TEXTURE_BINDING
                | wgpu::TextureUsages::STORAGE_BINDING
                | wgpu::TextureUsages::COPY_DST
                | wgpu::TextureUsages::COPY_SRC,
        })
    }

    pub fn upload_to_texture(
        &self,
        texture: &wgpu::Texture,
        data: &[u8],
        width: u32,
        height: u32,
    ) {
        let size = wgpu::Extent3d {
            width,
            height,
            depth_or_array_layers: 1,
        };
        self.queue.write_texture(
            wgpu::ImageCopyTexture {
                texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
                aspect: wgpu::TextureAspect::All,
            },
            data,
            wgpu::ImageDataLayout {
                offset: 0,
                bytes_per_row: Some(4 * width),
                rows_per_image: Some(height),
            },
            size,
        );
    }

    pub fn read_texture_to_buffer(
        &self,
        texture: &wgpu::Texture,
        width: u32,
        height: u32,
    ) -> wgpu::Buffer {
        let buffer_size = (4 * width * height) as u64;
        let buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("readback-buffer"),
            size: buffer_size,
            usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::MAP_READ,
            mapped_at_creation: false,
        });

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("readback-encoder"),
            });

        encoder.copy_texture_to_buffer(
            wgpu::ImageCopyTexture {
                texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
                aspect: wgpu::TextureAspect::All,
            },
            wgpu::ImageCopyBuffer {
                buffer: &buffer,
                layout: wgpu::ImageDataLayout {
                    offset: 0,
                    bytes_per_row: Some(4 * width),
                    rows_per_image: Some(height),
                },
            },
            wgpu::Extent3d {
                width,
                height,
                depth_or_array_layers: 1,
            },
        );

        self.queue.submit(Some(encoder.finish()));

        buffer
    }
}

#[derive(Debug, thiserror::Error)]
pub enum CompositorError {
    #[error("No suitable GPU adapter found")]
    NoAdapter,

    #[error("Device lost: {0}")]
    DeviceLost(#[from] wgpu::RequestDeviceError),

    #[error("Buffer readback failed")]
    ReadbackFailed,

    #[error("Internal error: {0}")]
    Internal(String),
}

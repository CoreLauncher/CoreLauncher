use std::sync::Arc;

use wgpu::{
    BackendOptions, Backends, BindGroup, Buffer, FragmentState, InstanceDescriptor, InstanceFlags,
    MemoryBudgetThresholds, PipelineCompilationOptions, PipelineLayoutDescriptor, PowerPreference,
    PrimitiveState, RenderPipeline, RenderPipelineDescriptor, RequestAdapterOptions, Surface,
    SurfaceConfiguration, VertexState,
};

use crate::rendering::{PaintOperation, Renderer};

pub fn new_wgpu_renderer() -> Box<WgpuRenderer> {
    Box::new(WgpuRenderer::new())
}

pub struct WgpuRenderer {
    instance: wgpu::Instance,
    adapter: wgpu::Adapter,
    device: wgpu::Device,
    queue: wgpu::Queue,
    shader: wgpu::ShaderModule,
    windows: Vec<RenderWindow>,
}

impl WgpuRenderer {
    fn new() -> Self {
        return pollster::block_on(Self::async_new());
    }

    async fn async_new() -> Self {
        let instance = wgpu::Instance::new(InstanceDescriptor {
            backends: Backends::default(),
            backend_options: BackendOptions::default(),
            display: None,
            flags: InstanceFlags::default(),
            memory_budget_thresholds: MemoryBudgetThresholds::default(),
        });

        let adapter = instance
            .request_adapter(&RequestAdapterOptions {
                power_preference: PowerPreference::default(),
                force_fallback_adapter: false,
                compatible_surface: None,
            })
            .await
            .unwrap();

        let (device, queue) = adapter
            .request_device(&wgpu::DeviceDescriptor {
                label: None,
                required_features: wgpu::Features::empty(),
                experimental_features: wgpu::ExperimentalFeatures::disabled(),
                required_limits: wgpu::Limits::default(),
                memory_hints: Default::default(),
                trace: wgpu::Trace::Off,
            })
            .await
            .unwrap();

        let shader = device.create_shader_module(wgpu::include_wgsl!("../../shaders/shader.wgsl"));

        Self {
            instance,
            adapter,
            device,
            queue,
            shader,
            windows: Vec::new(),
        }
    }
}

impl Renderer for WgpuRenderer {
    fn register_window(&mut self, window: Arc<winit::window::Window>) {
        let window = RenderWindow::new(
            &self.instance,
            &self.adapter,
            &self.device,
            &self.shader,
            window,
        );
        self.windows.push(window);
    }

    fn deregister_window(&mut self, window: Arc<winit::window::Window>) {
        self.windows.retain(|w| !Arc::ptr_eq(&w.handle, &window));
    }

    fn resize_window(&mut self, window: Arc<winit::window::Window>, width: u32, height: u32) {
        let mut window = self
            .windows
            .iter_mut()
            .find(|w| Arc::ptr_eq(&w.handle, &window));

        window.as_mut().unwrap().resize(&self.device, width, height);
    }

    fn render_window(
        &mut self,
        window: Arc<winit::window::Window>,
        operations: Vec<PaintOperation>,
    ) {
        let mut window = self
            .windows
            .iter_mut()
            .find(|w| Arc::ptr_eq(&w.handle, &window));

        window
            .as_mut()
            .unwrap()
            .render(&self.device, &self.queue, operations);
    }
}

struct RenderWindow {
    handle: Arc<winit::window::Window>,
    configured: bool,
    config: SurfaceConfiguration,
    surface: Surface<'static>,
    pipelines: RenderPipelines,
    window_size_buffer: Buffer,
    bind_group: BindGroup,
}

struct RenderPipelines {
    rectangle_pipeline: RenderPipeline,
}

impl RenderWindow {
    fn new(
        instance: &wgpu::Instance,
        adapter: &wgpu::Adapter,
        device: &wgpu::Device,
        shader: &wgpu::ShaderModule,
        window: Arc<winit::window::Window>,
    ) -> Self {
        let window_size = window.inner_size();
        let surface = instance.create_surface(window.clone()).unwrap();
        let surface_caps = surface.get_capabilities(&adapter);

        let config = SurfaceConfiguration {
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
            format: surface_caps.formats[0],
            width: window_size.width,
            height: window_size.height,
            present_mode: surface_caps.present_modes[0],
            alpha_mode: surface_caps.alpha_modes[0],
            desired_maximum_frame_latency: 2,
            view_formats: vec![],
        };

        let window_size_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("window_size_buffer"),
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
            size: 8,
        });

        let bind_group_layout = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            entries: &[wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::VERTEX,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Uniform,
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            }],
            label: Some("window_size_bind_group_layout"),
        });

        let pipeline_layout = device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Render pipeline layout"),
            bind_group_layouts: &[Some(&bind_group_layout)],
            immediate_size: 0,
        });

        let bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            layout: &bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: window_size_buffer.as_entire_binding(),
            }],
            label: Some("window_size_bind_group"),
        });

        let rectangle_pipeline = device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Render pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                buffers: &[],
                compilation_options: PipelineCompilationOptions::default(),
                entry_point: Some("vs_main"),
            },
            fragment: Some(FragmentState {
                module: &shader,
                compilation_options: PipelineCompilationOptions::default(),
                entry_point: Some("fs_main"),
                targets: &[Some(wgpu::ColorTargetState {
                    format: config.format,
                    blend: Some(wgpu::BlendState::REPLACE),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
            }),
            primitive: PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleStrip,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: Some(wgpu::Face::Back),
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview_mask: None,
            cache: None,
        });

        let pipelines = RenderPipelines { rectangle_pipeline };

        Self {
            handle: window,
            surface,
            configured: false,
            config,
            window_size_buffer,
            pipelines,
            bind_group,
        }
    }

    fn resize(&mut self, device: &wgpu::Device, width: u32, height: u32) {
        self.config.width = width;
        self.config.height = height;
        self.configure(device);
    }

    fn configure(&mut self, device: &wgpu::Device) {
        self.surface.configure(device, &self.config);
        self.configured = true;
    }

    fn render(
        &mut self,
        device: &wgpu::Device,
        queue: &wgpu::Queue,
        operations: Vec<PaintOperation>,
    ) {
        if self.configured == false {
            self.handle.request_redraw();
            return;
        }

        let surface_texture = match self.surface.get_current_texture() {
            wgpu::CurrentSurfaceTexture::Success(surface_texture) => surface_texture,
            wgpu::CurrentSurfaceTexture::Suboptimal(surface_texture) => {
                self.configure(device);
                surface_texture
            }
            wgpu::CurrentSurfaceTexture::Timeout
            | wgpu::CurrentSurfaceTexture::Occluded
            | wgpu::CurrentSurfaceTexture::Validation => {
                return;
            }
            wgpu::CurrentSurfaceTexture::Outdated => {
                self.configure(device);
                return;
            }
            wgpu::CurrentSurfaceTexture::Lost => {
                panic!("We lost the surface");
            }
        };

        queue.write_buffer(
            &self.window_size_buffer,
            0,
            &&bytemuck::cast_slice(&[WindowSizeUniform {
                width: self.config.width as f32,
                height: self.config.height as f32,
            }]),
        );

        let view = surface_texture
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        let mut encoder = device.create_command_encoder(&wgpu::CommandEncoderDescriptor {
            label: Some("Render Encoder"),
        });

        let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
            label: Some("Render Pass"),
            color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                view: &view,
                resolve_target: None,
                depth_slice: None,
                ops: wgpu::Operations {
                    load: wgpu::LoadOp::Clear(wgpu::Color {
                        r: 0.,
                        g: 0.,
                        b: 0.,
                        a: 0.,
                    }),
                    store: wgpu::StoreOp::Store,
                },
            })],
            depth_stencil_attachment: None,
            occlusion_query_set: None,
            timestamp_writes: None,
            multiview_mask: None,
        });

        for (index, operation) in operations.iter().enumerate() {
            println!("{:?}", operation);
            match operation {
                PaintOperation::Rectangle {
                    x,
                    y,
                    width,
                    height,
                    color,
                } => {
                    render_pass.set_pipeline(&self.pipelines.rectangle_pipeline);
                    render_pass.set_bind_group(0, Some(&self.bind_group), &[]);
                    render_pass.draw(0..5, index as u32..index as u32 + 1);
                }
            }
        }

        // render_pass.set_pipeline(&self.pipeline);
        // render_pass.set_bind_group(0, Some(&self.bind_group), &[]);
        // render_pass.draw(0..3, 0..1);

        drop(render_pass);

        queue.submit(std::iter::once(encoder.finish()));
        surface_texture.present();
    }
}

#[repr(C)]
#[derive(Debug, Copy, Clone, bytemuck::Pod, bytemuck::Zeroable)]
struct WindowSizeUniform {
    width: f32,
    height: f32,
}

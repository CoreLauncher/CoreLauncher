use std::sync::{Arc, Mutex};

use wgpu::{
    BackendOptions, Backends, BindGroup, Buffer, FragmentState, InstanceDescriptor, InstanceFlags,
    MemoryBudgetThresholds, PipelineCompilationOptions, PipelineLayoutDescriptor, PowerPreference,
    PrimitiveState, RenderPipeline, RenderPipelineDescriptor, RequestAdapterOptions, Surface,
    SurfaceConfiguration, VertexState, util::DeviceExt,
};
use winit::{
    application::ApplicationHandler,
    event::WindowEvent,
    event_loop::{self, EventLoop, EventLoopProxy},
    window::WindowAttributes,
};

use crate::{WindowOptions, context::ApplicationContext};

#[repr(C)]
#[derive(Debug, Copy, Clone, bytemuck::Pod, bytemuck::Zeroable)]
struct WindowSizeUniform {
    width: f32,
    height: f32,
}

#[derive(Debug)]
pub enum UserEvent {
    OpenWindow { options: WindowOptions },
}

#[derive(Debug)]
pub struct Window {
    configured: bool,
    render_state: Arc<Mutex<RenderState>>,
    handle: Arc<winit::window::Window>,
    surface: Surface<'static>,
    config: SurfaceConfiguration,
    pipeline: RenderPipeline,
    window_size_buffer: Buffer,
    bind_group: BindGroup,
}

impl Window {
    fn new(render_state: Arc<Mutex<RenderState>>, window: winit::window::Window) -> Self {
        let render_state_lock = render_state.lock().unwrap();
        let instance = &render_state_lock.instance;
        let adapter = &render_state_lock.adapter;
        let device = &render_state_lock.device;

        let shader = &render_state_lock.shader;

        let window = Arc::new(window);
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

        let window_size_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("window_size_buffer"),
            contents: &bytemuck::cast_slice(&[WindowSizeUniform {
                width: 0.,
                height: 0.0,
            }]),
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
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
            label: Some("camera_bind_group_layout"),
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

        let pipeline = device.create_render_pipeline(&RenderPipelineDescriptor {
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
                topology: wgpu::PrimitiveTopology::TriangleList,
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

        drop(render_state_lock);

        Self {
            configured: false,
            render_state,
            handle: window,
            surface,
            config,
            pipeline,
            window_size_buffer,
            bind_group,
        }
    }

    fn when_resized(&mut self, width: u32, height: u32) {
        self.config.width = width;
        self.config.height = height;

        self.configure();
    }

    fn configure(&mut self) {
        let render_state = self.render_state.lock().unwrap();
        let device = &render_state.device;

        self.surface.configure(&device, &self.config);
        self.configured = true;
    }

    fn render(&mut self) {
        if !self.configured {
            self.handle.request_redraw();
            return;
        }

        let surface_texture = match self.surface.get_current_texture() {
            wgpu::CurrentSurfaceTexture::Success(surface_texture) => surface_texture,
            wgpu::CurrentSurfaceTexture::Suboptimal(surface_texture) => {
                self.configure();
                surface_texture
            }
            wgpu::CurrentSurfaceTexture::Timeout
            | wgpu::CurrentSurfaceTexture::Occluded
            | wgpu::CurrentSurfaceTexture::Validation => {
                return;
            }
            wgpu::CurrentSurfaceTexture::Outdated => {
                self.configure();
                return;
            }
            wgpu::CurrentSurfaceTexture::Lost => {
                return;
            }
        };

        let render_state = self.render_state.lock().unwrap();
        let device = &render_state.device;
        let queue = &render_state.queue;

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
                        b: 0.3,
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

        render_pass.set_pipeline(&self.pipeline);
        render_pass.set_bind_group(0, &self.bind_group, &[]);
        render_pass.draw(0..3, 0..1);

        drop(render_pass);

        queue.submit(std::iter::once(encoder.finish()));
        surface_texture.present();
    }
}

pub struct ApplicationState {
    windows: Vec<Window>,
}

impl ApplicationState {
    fn new() -> Self {
        Self {
            windows: Vec::new(),
        }
    }
}

#[derive(Debug)]
pub struct RenderState {
    instance: wgpu::Instance,
    adapter: wgpu::Adapter,
    device: wgpu::Device,
    queue: wgpu::Queue,
    shader: wgpu::ShaderModule,
}

impl RenderState {
    fn new() -> Self {
        return pollster::block_on(RenderState::async_new());
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

        let shader = device.create_shader_module(wgpu::include_wgsl!("../shaders/shader.wgsl"));

        Self {
            instance,
            adapter,
            device,
            queue,
            shader,
        }
    }
}

pub struct Application {
    started: bool,
    callback: Box<dyn FnMut(ApplicationContext)>,
    proxy: Option<EventLoopProxy<UserEvent>>,
    app_state: Option<Arc<Mutex<ApplicationState>>>,
    render_state: Option<Arc<Mutex<RenderState>>>,
}

impl Application {
    pub fn new() -> Self {
        Self {
            started: false,
            callback: Box::new(|_| {}),
            proxy: None,
            app_state: None,
            render_state: None,
        }
    }

    pub fn run<F>(&mut self, callback: F)
    where
        F: FnMut(ApplicationContext) + 'static,
    {
        self.callback = Box::new(callback);

        let event_loop = EventLoop::<UserEvent>::with_user_event()
            .build()
            .expect("Could not create eventloop");

        let proxy = event_loop.create_proxy();
        self.proxy = proxy.into();

        let app_state = ApplicationState::new();
        self.app_state = Arc::new(Mutex::new(app_state)).into();

        let render_state = RenderState::new();
        self.render_state = Arc::new(Mutex::new(render_state)).into();

        event_loop.run_app(self).expect("Running eventloop failed");
    }
}

impl ApplicationHandler<UserEvent> for Application {
    fn resumed(&mut self, _event_loop: &event_loop::ActiveEventLoop) {
        if self.started {
            return;
        } else {
            self.started = true
        };

        (self.callback)(ApplicationContext::new(
            self.app_state.as_ref().unwrap().clone(),
            self.proxy.as_ref().unwrap().clone(),
        ));
    }

    fn window_event(
        &mut self,
        event_loop: &event_loop::ActiveEventLoop,
        window_id: winit::window::WindowId,
        event: WindowEvent,
    ) {
        let mut app_state = self.app_state.as_ref().unwrap().lock().unwrap();
        let mut window_option = app_state
            .windows
            .iter_mut()
            .find(|window| window.handle.id() == window_id);

        let window = window_option
            .as_mut()
            .expect("Event emitted for window that did not exist");

        match event {
            WindowEvent::CloseRequested => {
                event_loop.exit();
            }
            WindowEvent::Resized(size) => {
                window.when_resized(size.width, size.height);
            }
            WindowEvent::RedrawRequested => {
                window.render();
            }
            WindowEvent::CursorMoved {
                device_id: _device_id,
                position: _position,
            } => (),
            _ => println!("{:?}", event),
        }
    }

    fn user_event(&mut self, event_loop: &event_loop::ActiveEventLoop, event: UserEvent) {
        let mut app_state = self.app_state.as_ref().unwrap().lock().unwrap();

        match event {
            UserEvent::OpenWindow { options } => {
                let mut attributes = WindowAttributes::default();
                attributes = attributes.with_title(options.title);

                let handle = event_loop.create_window(attributes).unwrap();
                let window = Window::new(self.render_state.as_ref().unwrap().clone(), handle);

                app_state.windows.push(window);
            }
        }
    }
}

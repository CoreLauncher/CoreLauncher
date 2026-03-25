use std::sync::Arc;

use wgpu::{
    BackendOptions, Backends, CurrentSurfaceTexture, InstanceDescriptor, InstanceFlags,
    MemoryBudgetThresholds, PowerPreference, RequestAdapterOptions, SurfaceTexture,
};
use winit::{
    application::ApplicationHandler,
    dpi::LogicalSize,
    error::EventLoopError,
    event::WindowEvent,
    event_loop::EventLoop,
    window::{Window, WindowAttributes},
};

struct State {
    device: wgpu::Device,
    queue: wgpu::Queue,
    config: wgpu::wgt::SurfaceConfiguration<Vec<wgpu::TextureFormat>>,
    window: Arc<Window>,
    surface: wgpu::Surface<'static>,
    is_surface_configured: bool,
}

impl State {
    async fn new(window: Arc<Window>) -> Self {
        let size = window.inner_size();

        let instance = wgpu::Instance::new(InstanceDescriptor {
            backends: Backends::default(),
            backend_options: BackendOptions::default(),
            display: None,
            flags: InstanceFlags::default(),
            memory_budget_thresholds: MemoryBudgetThresholds::default(),
        });

        let surface = instance.create_surface(window.clone()).unwrap();

        let adapter = instance
            .request_adapter(&RequestAdapterOptions {
                power_preference: PowerPreference::default(),
                force_fallback_adapter: false,
                compatible_surface: Some(&surface),
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

        let surface_caps = surface.get_capabilities(&adapter);

        let surface_format = surface_caps
            .formats
            .iter()
            .copied()
            .find(|f| f.is_srgb())
            .unwrap_or(surface_caps.formats[0]);

        let alpha_mode = surface_caps
            .alpha_modes
            .iter()
            .copied()
            .find(|&mode| mode == wgpu::CompositeAlphaMode::PreMultiplied)
            .unwrap_or(surface_caps.alpha_modes[0]);

        let config = wgpu::SurfaceConfiguration {
            usage: wgpu::TextureUsages::RENDER_ATTACHMENT,
            format: surface_format,
            width: size.width,
            height: size.height,
            present_mode: surface_caps.present_modes[0],
            alpha_mode,
            desired_maximum_frame_latency: 2,
            view_formats: vec![],
        };

        Self {
            surface,
            device,
            queue,
            config,
            window,
            is_surface_configured: false,
        }
    }

    fn get_texture(&self) -> Option<SurfaceTexture> {
        match self.surface.get_current_texture() {
            CurrentSurfaceTexture::Success(texture) => Some(texture),
            _ => None,
        }
    }

    fn render(&self) {
        if !self.is_surface_configured {
            self.window.request_redraw();
            println!("surface not configured");
            return;
        } else {
            println!("rendering");
        }

        let output = self.get_texture().expect("Unable to get surface texture");

        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("Render Encoder"),
            });

        let render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
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

        drop(render_pass);

        // submit will accept anything that implements IntoIter
        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        println!("{}x{}", width, height);
        if width > 0 && height > 0 {
            self.config.width = width;
            self.config.height = height;
            self.surface.configure(&self.device, &self.config);
            self.is_surface_configured = true;
        }
    }
}

#[derive(Default)]
struct Application {
    state: Option<State>,
}

impl ApplicationHandler for Application {
    fn resumed(&mut self, event_loop: &winit::event_loop::ActiveEventLoop) {
        let window: Arc<Window> = event_loop
            .create_window(
                WindowAttributes::default()
                    .with_inner_size(LogicalSize::new(256, 256))
                    .with_transparent(true)
                    .with_decorations(false)
                    .with_window_level(winit::window::WindowLevel::AlwaysOnTop)
                    .with_fullscreen(Some(winit::window::Fullscreen::Borderless(None))),
            )
            .unwrap()
            .into();

        window.set_cursor_hittest(false).unwrap();

        let state = pollster::block_on(State::new(window));

        self.state = Some(state);
    }

    fn window_event(
        &mut self,
        event_loop: &winit::event_loop::ActiveEventLoop,
        window_id: winit::window::WindowId,
        event: winit::event::WindowEvent,
    ) {
        let state = match &mut self.state {
            Some(canvas) => canvas,
            None => return,
        };

        match event {
            WindowEvent::CloseRequested => {
                event_loop.exit();
            }
            WindowEvent::Resized(size) => {
                println!("resized");
                state.resize(size.width, size.height);
            }
            WindowEvent::CursorMoved {
                device_id,
                position,
            } => {}
            WindowEvent::RedrawRequested => {
                state.render();
            }
            _ => {
                println!("{event:?}");
            }
        }
    }
}

fn main() -> Result<(), EventLoopError> {
    println!("Hello, world!");

    let event_loop = EventLoop::new()?;
    event_loop.run_app(&mut Application::default())?;

    Ok(())
}

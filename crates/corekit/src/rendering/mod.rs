mod wgpu_renderer;

use std::sync::Arc;

pub use wgpu_renderer::new_wgpu_renderer;

use crate::style::color::Color;

pub trait Renderer {
    fn register_window(&mut self, window: Arc<winit::window::Window>);
    fn deregister_window(&mut self, window: Arc<winit::window::Window>);
    fn resize_window(&mut self, window: Arc<winit::window::Window>, width: u32, height: u32);
    fn render_window(
        &mut self,
        window: Arc<winit::window::Window>,
        operations: Vec<PaintOperation>,
    );
}

pub enum PaintOperation {
    Rectangle {
        x: u32,
        y: u32,
        width: u32,
        height: u32,
        color: Color,
    },
}

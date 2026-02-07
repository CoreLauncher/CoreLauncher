use gpui::Hsla;
use gpui_component::hsl;

pub struct Style;

impl Style {
    pub fn background() -> Hsla {
        hsl(0., 0., 0.)
    }
    pub fn foreground() -> Hsla {
        hsl(0., 0., 5.)
    }
    pub fn accent() -> Hsla {
        hsl(0., 0., 10.)
    }
    pub fn text_color() -> Hsla {
        hsl(0., 0., 90.)
    }
}

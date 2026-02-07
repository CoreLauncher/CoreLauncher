use gpui::{Hsla, Pixels, hsla, px};

pub struct Style;

impl Style {
    pub fn background() -> Hsla {
        hsla(0., 0., 0.0, 1.)
    }
    pub fn foreground() -> Hsla {
        hsla(0., 0., 0.5, 1.)
    }
    pub fn accent() -> Hsla {
        hsla(0., 0., 0.1, 1.)
    }
    pub fn text_color() -> Hsla {
        hsla(0., 0., 0.9, 1.)
    }

    pub fn window_rounding() -> Pixels {
        px(10.)
    }
}

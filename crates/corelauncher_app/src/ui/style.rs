use gpui::{Hsla, Pixels, hsla, px};

pub struct Style;

impl Style {
    // Colors
    pub fn background() -> Hsla {
        hsla(0., 0., 0.0, 1.)
    }
    pub fn foreground() -> Hsla {
        hsla(0., 0., 0.05, 1.)
    }
    pub fn _accent() -> Hsla {
        hsla(0., 0., 0.1, 1.)
    }
    pub fn text_color() -> Hsla {
        hsla(0., 0., 0.9, 1.)
    }
    pub fn border_color() -> Hsla {
        hsla(0., 0., 0.1, 1.)
    }

    // Inputs
    pub fn input_background_normal() -> Hsla {
        hsla(0., 0., 0.03, 1.)
    }

    pub fn input_background_hover() -> Hsla {
        hsla(0., 0., 0.05, 1.)
    }

    pub fn input_background_active() -> Hsla {
        hsla(0., 0., 0.08, 1.)
    }

    pub fn input_background_disabled() -> Hsla {
        hsla(0., 0., 0.10, 1.)
    }

    // Buttons
    // // Standard
    pub fn button_standard_background_normal() -> Hsla {
        Style::input_background_normal()
    }

    pub fn button_standard_background_hover() -> Hsla {
        Style::input_background_hover()
    }

    pub fn button_standard_background_active() -> Hsla {
        Style::input_background_active()
    }

    pub fn button_standard_background_disabled() -> Hsla {
        Style::input_background_disabled()
    }

    // // Primary
    pub fn button_primary_background_normal() -> Hsla {
        hsla(210., 100., 0.40, 1.)
    }

    pub fn button_primary_background_hover() -> Hsla {
        hsla(210., 100., 0.50, 1.)
    }

    pub fn button_primary_background_active() -> Hsla {
        hsla(210., 100., 0.60, 1.)
    }

    pub fn button_primary_background_disabled() -> Hsla {
        hsla(210., 100., 0.30, 1.)
    }

    // // Success
    pub fn button_success_background_normal() -> Hsla {
        hsla(120., 100., 0.30, 1.)
    }

    pub fn button_success_background_hover() -> Hsla {
        hsla(120., 100., 0.40, 1.)
    }

    pub fn button_success_background_active() -> Hsla {
        hsla(120., 100., 0.50, 1.)
    }

    pub fn button_success_background_disabled() -> Hsla {
        hsla(120., 100., 0.30, 1.)
    }

    // // Warning
    pub fn button_warning_background_normal() -> Hsla {
        hsla(40., 100., 0.40, 1.)
    }

    pub fn button_warning_background_hover() -> Hsla {
        hsla(40., 100., 0.50, 1.)
    }

    pub fn button_warning_background_active() -> Hsla {
        hsla(40., 100., 0.60, 1.)
    }

    pub fn button_warning_background_disabled() -> Hsla {
        hsla(40., 100., 0.30, 1.)
    }

    // // Danger
    pub fn button_danger_background_normal() -> Hsla {
        hsla(0., 100., 0.25, 1.)
    }

    pub fn button_danger_background_hover() -> Hsla {
        hsla(0., 100., 0.35, 1.)
    }

    pub fn button_danger_background_active() -> Hsla {
        hsla(0., 100., 0.45, 1.)
    }

    pub fn button_danger_background_disabled() -> Hsla {
        hsla(0., 100., 0.10, 1.)
    }

    // Sizes
    pub fn small_gap() -> Pixels {
        px(4.)
    }

    pub fn normal_gap() -> Pixels {
        px(8.)
    }

    pub fn _large_gap() -> Pixels {
        px(16.)
    }

    pub fn window_rounding() -> Pixels {
        px(10.)
    }
}

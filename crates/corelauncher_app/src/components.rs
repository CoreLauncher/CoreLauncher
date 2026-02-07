use gpui::{
    Div, FontWeight, InteractiveElement, MouseButton, ParentElement, Pixels, Styled, Svg,
    WindowControlArea, div, px, red, svg,
};

use crate::{constants::Constants, style::Style};

pub fn window_drag_area() -> Div {
    div()
        .window_control_area(WindowControlArea::Drag)
        .on_mouse_down(MouseButton::Left, |_, window, _| {
            window.start_window_move();
        })
}

pub fn title_bar() -> Div {
    let height = px(50.);

    window_drag_area()
        .h(height)
        .w_full()
        .rounded_tl(Style::window_rounding())
        .rounded_tr(Style::window_rounding())
        .flex()
        .flex_row()
        .child(branding_logo(height))
        .bg(red())
}

pub fn branding_logo(height: Pixels) -> Div {
    let margin = px(4.0);
    let size = height - margin * 2.0;

    div()
        .flex()
        .flex_row()
        .items_center()
        .gap(px(8.0))
        .child(branding_symbol().size(size).m(margin))
        .child(branding_stamp())
}

pub fn branding_symbol() -> Svg {
    svg().path("logos/logo.svg").text_color(Style::text_color())
}

pub fn branding_stamp() -> Div {
    div()
        .child(Constants::app_name())
        .text_size(px(20.))
        .font_family("Rubik")
        .font_weight(FontWeight::BOLD)
}

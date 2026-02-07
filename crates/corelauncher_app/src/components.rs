use gpui::{
    Div, InteractiveElement, MouseButton, ParentElement, Pixels, Styled, Svg, WindowControlArea,
    div, px, red, svg,
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
        .child(logo(height))
        .bg(red())
}

pub fn logo(height: Pixels) -> Div {
    let margin = px(4.0);
    let size = height - margin * 2.0;

    div()
        .flex()
        .flex_row()
        .items_center()
        .gap(px(8.0))
        .child(symbol().size(size).m(margin))
        .child(Constants::app_name())
}

pub fn symbol() -> Svg {
    svg().path("logos/logo.svg").text_color(Style::text_color())
}

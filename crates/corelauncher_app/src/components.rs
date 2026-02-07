use gpui::{
    Div, InteractiveElement, MouseButton, ParentElement, Styled, Svg, WindowControlArea, div, px,
    red, svg, white,
};

use crate::style::Style;

pub fn window_drag_area() -> Div {
    div()
        .window_control_area(WindowControlArea::Drag)
        .on_mouse_down(MouseButton::Left, |_, window, cx| {
            window.start_window_move();
        })
}

pub fn title_bar() -> Div {
    window_drag_area()
        .h(px(50.))
        .w_full()
        .child(logo().size(px(50.)))
        .bg(red())
}

pub fn logo() -> Div {
    div().child(symbol())
}

pub fn symbol() -> Svg {
    svg()
        .path("logos/logo.svg")
        .size_full()
        .text_color(Style::text_color())
}

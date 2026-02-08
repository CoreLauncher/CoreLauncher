use gpui::{
    Context, Div, InteractiveElement, IntoElement, MouseButton, ParentElement, Render, Styled,
    Window, WindowControlArea, div, px,
};

use crate::{components::branding_logo, style::Style};

pub struct TitlebarSection;

impl TitlebarSection {
    fn window_drag_area(&self) -> Div {
        div()
            .window_control_area(WindowControlArea::Drag)
            .on_mouse_down(MouseButton::Left, |_, window, _| {
                window.start_window_move();
            })
    }
}

impl Render for TitlebarSection {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        let height = px(50.);

        self.window_drag_area()
            .h(height)
            .w_full()
            .flex()
            .flex_row()
            .justify_between()
            .p(Style::normal_gap())
            .child(
                div()
                    .flex()
                    .flex_row()
                    .gap(Style::normal_gap())
                    .child(branding_logo(height - px(16.0)))
                    .child(
                        div().flex().flex_row().gap(Style::normal_gap()).child(
                            div()
                                .flex()
                                .items_center()
                                .bg(Style::foreground())
                                .p(Style::normal_gap())
                                .rounded(Style::small_gap())
                                .cursor_pointer()
                                .border_1()
                                .border_color(Style::border_color())
                                .child("Library"),
                        ),
                    ),
            )
    }
}

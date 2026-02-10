use gpui::prelude::FluentBuilder;
use gpui::{
    Context, Div, InteractiveElement, IntoElement, MouseButton, ParentElement, Render, Styled,
    Window, WindowControlArea, div, px,
};

use crate::smart_components::{Button, ButtonFunction, ButtonVariant};
use crate::{components::branding_logo, style::Style};

pub struct TitlebarSection;

impl TitlebarSection {
    fn window_drag_area(&self) -> Div {
        let is_linux = cfg!(target_os = "linux");
        let is_windows = cfg!(target_os = "windows");

        div()
            .when(is_windows, |element| {
                element.window_control_area(WindowControlArea::Drag)
            })
            .when(is_linux, |element| {
                element.on_mouse_down(MouseButton::Left, |_, window, _| {
                    window.start_window_move();
                })
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
                        div()
                            .flex()
                            .flex_row()
                            .gap(Style::normal_gap())
                            .child(Button::new("titlebar_tab_library").set_label("Library"))
                            .child(Button::new("titlebar_tab_profile").set_label("Profile"))
                            .child(Button::new("titlebar_tab_settings").set_label("Settings")),
                    ),
            )
            .child(
                div()
                    .flex()
                    .flex_row()
                    .gap(Style::small_gap())
                    .child(
                        Button::new("titlebar_minimize")
                            .set_icon("icons/window-minimize.svg")
                            .set_ghost(true)
                            .set_variant(ButtonVariant::Standard)
                            .set_function(ButtonFunction::Minimize),
                    )
                    .child(
                        Button::new("titlebar_maximize")
                            .set_icon("icons/window-maximize.svg")
                            .set_ghost(true)
                            .set_variant(ButtonVariant::Standard)
                            .set_function(ButtonFunction::Maximize),
                    )
                    .child(
                        Button::new("titlebar_close")
                            .set_icon("icons/window-close.svg")
                            .set_ghost(true)
                            .set_variant(ButtonVariant::Danger)
                            .set_function(ButtonFunction::Close),
                    ),
            )
    }
}

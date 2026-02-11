use std::rc::Rc;

use gpui::prelude::FluentBuilder;
use gpui::{
    App, Context, Div, InteractiveElement, IntoElement, MouseButton, ParentElement, Render,
    RenderOnce, Styled, Window, WindowControlArea, div, px,
};

use crate::smart_components::{Button, ButtonFunction, ButtonVariant};
use crate::{components::branding_logo, style::Style};

struct TitlebarSectionState {
    should_drag: bool,
}

// TODO: Remove this when GPUI has released v0.2.3
impl Render for TitlebarSectionState {
    fn render(&mut self, _: &mut Window, _: &mut Context<Self>) -> impl IntoElement {
        div()
    }
}

#[derive(IntoElement)]
pub struct TitlebarSection {
    active_tab: String,
    on_tab_change: Rc<dyn FnMut(String, &mut Window, &mut App)>,
}

impl TitlebarSection {
    pub fn new(
        active_tab: &str,
        on_tab_change: impl FnMut(String, &mut Window, &mut App) + 'static,
    ) -> Self {
        Self {
            active_tab: active_tab.to_string(),
            on_tab_change: Rc::new(on_tab_change),
        }
    }
}

impl RenderOnce for TitlebarSection {
    fn render(self, window: &mut Window, cx: &mut App) -> impl IntoElement {
        let height = px(50.);
        let state = window.use_state(cx, |_, _| TitlebarSectionState { should_drag: false });

        div()
            .id("titlebar")
            .window_control_area(WindowControlArea::Drag)
            .on_mouse_down_out(window.listener_for(&state, |state, _, _, _| {
                state.should_drag = false;
            }))
            .on_mouse_down(
                MouseButton::Left,
                window.listener_for(&state, |state, _, _, _| {
                    state.should_drag = true;
                }),
            )
            .on_mouse_up(
                MouseButton::Left,
                window.listener_for(&state, |state, _, _, _| {
                    state.should_drag = false;
                }),
            )
            .on_mouse_move(window.listener_for(&state, |state, _, window, _| {
                if state.should_drag {
                    state.should_drag = false;
                    window.start_window_move();
                }
            }))
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
                            .child(
                                Button::new("titlebar_tab_library")
                                    .set_label("Library")
                                    .set_active(self.active_tab == "library")
                                    .on_click({
                                        let on_tab_change = self.on_tab_change.clone();
                                        move |_, window, app| {
                                            on_tab_change("library".to_string(), window, app)
                                        }
                                    }),
                            )
                            .child(
                                Button::new("titlebar_tab_profile")
                                    .set_label("Profile")
                                    .set_active(self.active_tab == "profile")
                                    .on_click({
                                        let on_tab_change = self.on_tab_change.clone();
                                        move |_, window, app| {
                                            on_tab_change("profile".to_string(), window, app)
                                        }
                                    }),
                            )
                            .child(
                                Button::new("titlebar_tab_settings")
                                    .set_label("Settings")
                                    .set_active(self.active_tab == "settings")
                                    .on_click({
                                        let on_tab_change = self.on_tab_change.clone();
                                        move |_, window, app| {
                                            on_tab_change("settings".to_string(), window, app)
                                        }
                                    }),
                            ),
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

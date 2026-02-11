use gpui::{Context, FontWeight, IntoElement, ParentElement, Render, Styled, Window, div};

use crate::{
    constants::Constants,
    ui::{Style, block},
};

pub struct SettingsView;

impl Render for SettingsView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .size_full()
            .flex()
            .flex_col()
            .gap(Style::normal_gap())
            .child(
                block()
                    .flex()
                    .flex_col()
                    .gap(Style::small_gap())
                    .w_full()
                    .child(
                        div()
                            .child("About CoreLauncher")
                            .text_2xl()
                            .font_weight(FontWeight::BOLD),
                    )
                    .child(format!(
                        "You are currently using version {} of CoreLauncher.",
                        Constants::app_version()
                    )),
            )
    }
}

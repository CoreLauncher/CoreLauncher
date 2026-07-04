use gpui::{Div, FontWeight, ParentElement, Pixels, Styled, Svg, div, px, svg};

use crate::{constants::Constants, ui::style::Style};

pub fn branding_logo(size: Pixels) -> Div {
    div()
        .flex()
        .flex_row()
        .items_center()
        .gap(Style::normal_gap())
        .child(branding_symbol().size(size))
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

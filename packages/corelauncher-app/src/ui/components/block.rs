use gpui::{Div, Styled, div};

use crate::ui::style::Style;

pub fn block() -> Div {
    div()
        .bg(Style::foreground())
        .rounded(Style::normal_gap())
        .p(Style::normal_gap())
}

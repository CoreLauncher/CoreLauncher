use crate::{
    element::Element,
    style::{ElementStyle, Styled},
};

pub fn div() -> Div {
    Div::new()
}

pub struct Div {
    style: ElementStyle,
}

impl Div {
    fn new() -> Self {
        Self {
            style: ElementStyle::new(),
        }
    }
}

impl Element for Div {
    fn calculate_layout(&self) {
        todo!()
    }

    fn paint(&self) {
        todo!()
    }
}

impl Styled for Div {
    fn style(&mut self) -> &mut ElementStyle {
        &mut self.style
    }
}

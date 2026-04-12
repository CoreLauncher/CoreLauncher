use crate::{
    element::{Element, ParentElement},
    style::{ElementStyle, StyledElement},
};

pub fn div() -> Div {
    Div::new()
}

pub struct Div {
    style: ElementStyle,
    children: Vec<Box<dyn Element>>,
}

impl Div {
    fn new() -> Self {
        Self {
            style: ElementStyle::new(),
            children: Vec::new(),
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

impl StyledElement for Div {
    fn style(&mut self) -> &mut ElementStyle {
        &mut self.style
    }
}

impl ParentElement for Div {
    fn expand(&mut self, children: impl IntoIterator<Item = Box<dyn Element>>) {
        self.children.extend(children);
    }
}

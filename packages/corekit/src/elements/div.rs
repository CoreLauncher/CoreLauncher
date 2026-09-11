use taffy::{NodeId, TaffyTree};

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
    fn taffy_layout(&self, tree: &mut TaffyTree) -> NodeId {
        let children: Vec<NodeId> = self.children.iter().map(|c| c.taffy_layout(tree)).collect();
        let node = tree
            .new_with_children(self.style.into_taffy_style(), &children)
            .unwrap();

        return node;
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

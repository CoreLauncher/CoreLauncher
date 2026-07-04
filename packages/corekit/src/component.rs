use taffy::{NodeId, TaffyTree};

use crate::Element;

pub trait Component {
    fn render(&self) -> Box<dyn Element>;
}

impl<T: Component + ?Sized> Element for T {
    fn taffy_layout(&self, tree: &mut TaffyTree) -> NodeId {
        return self.render().taffy_layout(tree);
    }

    fn paint(&self) {
        // TODO: implement painting
    }
}

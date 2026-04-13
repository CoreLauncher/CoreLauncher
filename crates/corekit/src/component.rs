use crate::Element;

pub trait Component {
    fn render(&self) -> Box<dyn Element>;
}

impl<T: Component + ?Sized> Element for T {
    fn calculate_layout(&self) {
        self.render().calculate_layout()
    }

    fn paint(&self) {
        // TODO: implement painting
    }
}

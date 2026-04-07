use crate::Element;

pub trait Component {
    fn render(&self) -> Box<dyn Element>;
}

pub trait Element {
    fn calculate_layout(&self);
    fn paint(&self);
}

impl<T: Element + 'static> From<T> for Box<dyn Element> {
    fn from(element: T) -> Self {
        Box::new(element)
    }
}

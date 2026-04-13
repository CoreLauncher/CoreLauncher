pub trait Element {
    fn calculate_layout(&self);
    fn paint(&self);
}

impl<T: Element + 'static> From<T> for Box<dyn Element> {
    fn from(element: T) -> Self {
        Box::new(element)
    }
}

pub trait ParentElement: Sized {
    fn expand(&mut self, children: impl IntoIterator<Item = Box<dyn Element>>);

    fn child(self, child: impl Element) -> Self {
        self
    }

    fn children(self, child: impl IntoIterator<Item = Box<dyn Element>>) -> Self {
        self
    }
}

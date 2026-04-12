pub trait Element {
    fn calculate_layout(&self);
    fn paint(&self);
}

impl<T: Element + 'static> From<T> for Box<dyn Element> {
    fn from(element: T) -> Self {
        Box::new(element)
    }
}

pub trait ParentElement {
    fn expand(&mut self, children: impl IntoIterator<Item = Box<dyn Element>>);

    fn child(&mut self, child: impl Element) {
        todo!()
    }

    fn children(&mut self, child: impl IntoIterator<Item = Box<dyn Element>>) {
        todo!()
    }
}

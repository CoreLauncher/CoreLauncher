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

    fn child(mut self, child: Box<dyn Element>) -> Self {
        self.expand(std::iter::once(child));
        return self;
    }

    fn children(mut self, children: impl IntoIterator<Item = Box<dyn Element>>) -> Self {
        self.expand(children);
        return self;
    }
}

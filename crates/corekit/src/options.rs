use crate::Component;

pub struct WindowOptions {
    pub root: Box<dyn Component>,
    pub title: String,
}

impl WindowOptions {
    pub fn builder() -> WindowOptionsBuilder {
        WindowOptionsBuilder::new()
    }
}

pub struct WindowOptionsBuilder {
    title: Option<String>,
    root: Option<Box<dyn Component>>,
}

impl WindowOptionsBuilder {
    fn new() -> Self {
        Self {
            title: None,
            root: None,
        }
    }

    pub fn with_root<C: Component + 'static>(mut self, component: C) -> Self {
        self.root = Some(Box::new(component));
        return self;
    }

    pub fn with_title(mut self, title: &str) -> Self {
        self.title = title.to_string().into();
        return self;
    }

    pub fn build(self) -> WindowOptions {
        WindowOptions {
            root: self.root.expect("Can not construct window without root."),
            title: self.title.unwrap_or("CoreKit Window".into()),
        }
    }
}

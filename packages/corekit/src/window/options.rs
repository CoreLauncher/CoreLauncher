use crate::Component;

pub struct WindowOptions {
    pub root: Box<dyn Component>,
    pub title: String,
    pub minimum_size: (u32, u32),
}

impl WindowOptions {
    pub fn builder() -> WindowOptionsBuilder {
        WindowOptionsBuilder::new()
    }
}

pub struct WindowOptionsBuilder {
    title: Option<String>,
    root: Option<Box<dyn Component>>,
    minimum_size: Option<(u32, u32)>,
}

impl WindowOptionsBuilder {
    fn new() -> Self {
        Self {
            title: None,
            root: None,
            minimum_size: None,
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

    pub fn with_minimum_size(mut self, width: u32, height: u32) -> Self {
        self.minimum_size = (width, height).into();
        return self;
    }

    pub fn build(self) -> WindowOptions {
        WindowOptions {
            root: self.root.expect("Can not construct window without root."),
            title: self.title.unwrap_or("CoreKit Window".into()),
            minimum_size: self.minimum_size.unwrap_or((512, 512)),
        }
    }
}

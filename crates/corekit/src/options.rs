#[derive(Debug, Default)]
pub struct WindowOptions {
    pub title: String,
}

impl WindowOptions {
    pub fn builder() -> WindowOptionsBuilder {
        WindowOptionsBuilder::new()
    }
}

pub struct WindowOptionsBuilder {
    title: Option<String>,
}

impl WindowOptionsBuilder {
    fn new() -> Self {
        Self { title: None }
    }

    pub fn with_root(mut self)

    pub fn with_title(mut self, title: &str) -> Self {
        self.title = title.to_string().into();
        return self;
    }

    pub fn build(self) -> WindowOptions {
        WindowOptions {
            title: self.title.unwrap_or("CoreKit Window".into()),
        }
    }
}

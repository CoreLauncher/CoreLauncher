#[derive(Debug)]
pub struct WindowOptions {}

impl WindowOptions {
    pub fn builder() -> WindowOptionsBuilder {
        WindowOptionsBuilder::new()
    }
}

pub struct WindowOptionsBuilder {}

impl WindowOptionsBuilder {
    fn new() -> Self {
        Self {}
    }

    pub fn build(self) -> WindowOptions {
        WindowOptions {}
    }
}

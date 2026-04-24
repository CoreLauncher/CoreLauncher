#[derive(Copy, Clone)]
pub struct Pixels(pub f32);

#[derive(Copy, Clone)]
pub struct Percent(pub f32);

#[derive(Copy, Clone)]
pub enum Dimension {
    Auto,
    Pixels(Pixels),
    Percent(Percent),
}

impl Into<taffy::Dimension> for Dimension {
    fn into(self) -> taffy::Dimension {
        match self {
            Dimension::Auto => taffy::Dimension::auto(),
            Dimension::Pixels(pixels) => taffy::Dimension::length(pixels.0),
            Dimension::Percent(percent) => taffy::Dimension::percent(percent.0),
        }
    }
}

#[derive(Copy, Clone)]
pub struct Size<T: Copy> {
    pub width: T,
    pub height: T,
}

impl Into<taffy::Size<taffy::Dimension>> for Size<Dimension> {
    fn into(self) -> taffy::Size<taffy::Dimension> {
        return taffy::Size {
            width: self.width.into(),
            height: self.height.into(),
        };
    }
}

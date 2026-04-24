use crate::style::{
    color::Color,
    units::{Dimension, Percent, Size},
};

pub struct ElementStyle {
    size: Size<Dimension>,
    background: Background,
}

impl ElementStyle {
    pub fn new() -> Self {
        Self {
            size: Size {
                width: Dimension::Auto,
                height: Dimension::Auto,
            },
            background: Background::None,
        }
    }

    pub fn into_taffy_style(&self) -> taffy::Style {
        taffy::Style {
            size: self.size.into(),
            ..Default::default()
        }
    }
}

pub trait StyledElement: Sized {
    fn style(&mut self) -> &mut ElementStyle;

    fn size_full(mut self) -> Self {
        let style = self.style();
        style.size.width = Dimension::Percent(Percent(1.));
        style.size.height = Dimension::Percent(Percent(1.));
        return self;
    }

    fn width_full(mut self) -> Self {
        self.style().size.width = Dimension::Percent(Percent(1.));
        return self;
    }

    fn height_full(mut self) -> Self {
        self.style().size.height = Dimension::Percent(Percent(1.));
        return self;
    }

    fn background(mut self, background: Background) -> Self {
        self.style().background = background;
        return self;
    }

    fn background_color(self, color: Color) -> Self {
        return self.background(Background::Color(color));
    }
}

pub enum Background {
    None,
    Color(Color),
}

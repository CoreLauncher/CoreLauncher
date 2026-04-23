use crate::style::{
    color::Color,
    units::{Length, Percent},
};

pub struct ElementStyle {
    size: Size<Length>,
    background: Background,
}

impl ElementStyle {
    pub fn new() -> Self {
        Self {
            size: Size {
                width: Length::Auto,
                height: Length::Auto,
            },
            background: Background::None,
        }
    }

    pub fn into_taffy_style(&self) -> taffy::Style {
        taffy::Style {
            ..Default::default()
        }
    }
}

pub trait StyledElement: Sized {
    fn style(&mut self) -> &mut ElementStyle;

    fn size_full(mut self) -> Self {
        let style = self.style();
        style.size.width = Length::Percent(Percent(1.));
        style.size.height = Length::Percent(Percent(1.));
        return self;
    }

    fn width_full(mut self) -> Self {
        self.style().size.width = Length::Percent(Percent(1.));
        return self;
    }

    fn height_full(mut self) -> Self {
        self.style().size.height = Length::Percent(Percent(1.));
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

struct Size<T> {
    pub width: T,
    pub height: T,
}

pub enum Background {
    None,
    Color(Color),
}

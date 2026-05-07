#[derive(Debug, Clone, Copy)]
pub enum Color {
    RGB(RGB),
    RGBA(RGBA),
    HSLA(HSLA),
}

impl Color {
    pub fn into_rgba_array(self) -> [f32; 4] {
        match self {
            Color::RGB(rgb) => [rgb.r, rgb.g, rgb.b, 1.0],
            Color::RGBA(rgba) => [rgba.r, rgba.g, rgba.b, rgba.a],
            Color::HSLA(_) => todo!(),
        }
    }

    pub fn r(&self) -> f32 {
        match self {
            Color::RGB(rgb) => rgb.r,
            Color::RGBA(rgba) => rgba.r,
            Color::HSLA(_) => todo!(),
        }
    }

    pub fn g(&self) -> f32 {
        match self {
            Color::RGB(rgb) => rgb.g,
            Color::RGBA(rgba) => rgba.g,
            Color::HSLA(_) => todo!(),
        }
    }

    pub fn b(&self) -> f32 {
        match self {
            Color::RGB(rgb) => rgb.b,
            Color::RGBA(rgba) => rgba.b,
            Color::HSLA(_) => todo!(),
        }
    }

    pub fn a(&self) -> f32 {
        match self {
            Color::RGB(_) => 1.0,
            Color::RGBA(rgba) => rgba.a,
            Color::HSLA(_) => todo!(),
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct RGB {
    // range from 0 to 1
    r: f32,
    // range from 0 to 1
    g: f32,
    // range from 0 to 1
    b: f32,
}

#[derive(Debug, Clone, Copy)]
pub struct RGBA {
    // range from 0 to 1
    r: f32,
    // range from 0 to 1
    g: f32,
    // range from 0 to 1
    b: f32,
    // range from 0 to 1
    a: f32,
}

#[derive(Debug, Clone, Copy)]
pub struct HSL {
    // range from 0 to 1
    h: f32,
    // range from 0 to 1
    s: f32,
    // range from 0 to 1
    l: f32,
}

#[derive(Debug, Clone, Copy)]
pub struct HSLA {
    // range from 0 to 1
    h: f32,
    // range from 0 to 1
    s: f32,
    // range from 0 to 1
    l: f32,
    // range from 0 to 1
    a: f32,
}

pub fn rgb(r: f32, g: f32, b: f32) -> Color {
    let value = RGB { r, g, b };
    return Color::RGB(value);
}

pub fn rgba(r: f32, g: f32, b: f32, a: f32) -> Color {
    let value = RGBA { r, g, b, a };
    return Color::RGBA(value);
}

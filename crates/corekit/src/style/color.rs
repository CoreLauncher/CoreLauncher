#[derive(Debug)]
pub enum Color {
    RGB(RGB),
    RGBA(RGBA),
    HSLA(HSLA),
}

#[derive(Debug)]
pub struct RGB {
    // range from 0 to 1
    r: f32,
    // range from 0 to 1
    g: f32,
    // range from 0 to 1
    b: f32,
}

#[derive(Debug)]
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

#[derive(Debug)]
pub struct HSL {
    // range from 0 to 1
    h: f32,
    // range from 0 to 1
    s: f32,
    // range from 0 to 1
    l: f32,
}

#[derive(Debug)]
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

pub fn rgb(r: u8, g: u8, b: u8) -> Color {
    return Color::RGB(r, g, b);
}

pub fn rgba(r: u8, g: u8, b: u8, a: u8) -> Color {
    return Color::RGBA(r, g, b, a);
}

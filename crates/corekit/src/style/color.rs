#[derive(Debug)]
pub enum Color {
    RGB(u8, u8, u8),
    RGBA(u8, u8, u8, u8),
}

pub fn rgb(r: u8, g: u8, b: u8) -> Color {
    return Color::RGB(r, g, b);
}

pub fn rgba(r: u8, g: u8, b: u8, a: u8) -> Color {
    return Color::RGBA(r, g, b, a);
}

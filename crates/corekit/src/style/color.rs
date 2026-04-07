pub enum Color {
    RGB(u8, u8, u8),
}

pub fn rgb(r: u8, g: u8, b: u8) -> Color {
    return Color::RGB(r, g, b);
}

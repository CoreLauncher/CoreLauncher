#[derive(Debug, Clone, Copy)]
pub enum Color {
    RGB(f32, f32, f32),
    RGBA(f32, f32, f32, f32),
    HSL(f32, f32, f32),
    HSLA(f32, f32, f32, f32),
}

impl Color {
    pub fn into_rgba_array(self) -> [f32; 4] {
        match self {
            Color::RGB(r, g, b) => [r, g, b, 1.0],
            Color::RGBA(r, g, b, a) => [r, g, b, a],
            Color::HSL(h, s, l) => return Color::HSLA(h, s, l, 1.).into_rgba_array(),
            Color::HSLA(h, s, l, a) => {
                let value = hsl::HSL {
                    h: h as f64,
                    s: s as f64,
                    l: l as f64,
                };
                let (r, g, b) = value.to_rgb();
                return [r as f32 / 255.0, g as f32 / 255.0, b as f32 / 255.0, a];
            }
        }
    }
}

pub fn rgb(r: f32, g: f32, b: f32) -> Color {
    return Color::RGB(r, g, b);
}

pub fn rgba(r: f32, g: f32, b: f32, a: f32) -> Color {
    return Color::RGBA(r, g, b, a);
}

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
            Color::HSL(..) => todo!(),
            Color::HSLA(..) => todo!(),
        }
    }

    pub fn r(&self) -> f32 {
        match self {
            Color::RGB(r, _, _) => *r,
            Color::RGBA(r, _, _, _) => *r,
            Color::HSL(..) => todo!(),
            Color::HSLA(..) => todo!(),
        }
    }

    pub fn g(&self) -> f32 {
        match self {
            Color::RGB(_, g, _) => *g,
            Color::RGBA(_, g, _, _) => *g,
            Color::HSL(..) => todo!(),
            Color::HSLA(..) => todo!(),
        }
    }

    pub fn b(&self) -> f32 {
        match self {
            Color::RGB(_, _, b) => *b,
            Color::RGBA(_, _, b, _) => *b,
            Color::HSL(..) => todo!(),
            Color::HSLA(..) => todo!(),
        }
    }

    pub fn a(&self) -> f32 {
        match self {
            Color::RGB(..) => 1.0,
            Color::RGBA(_, _, _, a) => *a,
            Color::HSL(..) => todo!(),
            Color::HSLA(..) => todo!(),
        }
    }
}

pub fn rgb(r: f32, g: f32, b: f32) -> Color {
    return Color::RGB(r, g, b);
}

pub fn rgba(r: f32, g: f32, b: f32, a: f32) -> Color {
    return Color::RGBA(r, g, b, a);
}

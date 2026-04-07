pub struct Pixels(pub f32);
pub struct Percent(pub f32);

pub enum Length {
    Auto,
    Pixels(Pixels),
    Percent(Percent),
}

#[derive(Clone, Copy)]
pub struct ClickCallbacks {
    pub left: extern "C" fn(),
    pub right: extern "C" fn(),
    pub middle: extern "C" fn(),
    pub double: extern "C" fn(),
}
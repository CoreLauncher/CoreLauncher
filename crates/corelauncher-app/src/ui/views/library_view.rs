use gpui::{Context, IntoElement, ParentElement, Render, Window, div};

pub struct LibraryView;

impl Render for LibraryView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Library View")
    }
}

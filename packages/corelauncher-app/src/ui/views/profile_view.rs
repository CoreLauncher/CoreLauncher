use gpui::{Context, IntoElement, ParentElement, Render, Window, div};

pub struct ProfileView;

impl Render for ProfileView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div().child("Profile View")
    }
}

use gpui::{
    App, Bounds, Context, CursorStyle, HitboxBehavior, InteractiveElement, IntoElement,
    ParentElement, Pixels, Point, Render, RenderOnce, ResizeEdge, Size, Styled, Window, canvas,
    div, point, px,
};

#[derive(Debug)]
enum WindowEdge {
    Left,
    Right,
    Top,
    Bottom,
    TopRight,
    TopLeft,
    BottomRight,
    BottomLeft,
}

impl WindowEdge {
    fn resize_direction(self) -> ResizeEdge {
        match self {
            WindowEdge::Left => ResizeEdge::Left,
            WindowEdge::Right => ResizeEdge::Right,
            WindowEdge::Top => ResizeEdge::Top,
            WindowEdge::Bottom => ResizeEdge::Bottom,
            WindowEdge::TopRight => ResizeEdge::TopRight,
            WindowEdge::TopLeft => ResizeEdge::TopLeft,
            WindowEdge::BottomRight => ResizeEdge::BottomRight,
            WindowEdge::BottomLeft => ResizeEdge::BottomLeft,
        }
    }

    fn cursor_style(self) -> CursorStyle {
        match self {
            WindowEdge::Left | WindowEdge::Right => CursorStyle::ResizeLeftRight,
            WindowEdge::Top | WindowEdge::Bottom => CursorStyle::ResizeUpDown,
            WindowEdge::TopLeft | WindowEdge::BottomRight => CursorStyle::ResizeUpLeftDownRight,
            WindowEdge::TopRight | WindowEdge::BottomLeft => CursorStyle::ResizeUpRightDownLeft,
        }
    }
}

fn window_edge(window_size: Size<Pixels>, mouse_position: Point<Pixels>) -> Option<WindowEdge> {
    let edge_threshold = px(10.);
    let left_edge = mouse_position.x <= edge_threshold;
    let right_edge = mouse_position.x >= window_size.width - edge_threshold;
    let top_edge = mouse_position.y <= edge_threshold;
    let bottom_edge = mouse_position.y >= window_size.height - edge_threshold;

    match (left_edge, right_edge, top_edge, bottom_edge) {
        (true, false, true, false) => Some(WindowEdge::TopLeft),
        (false, true, true, false) => Some(WindowEdge::TopRight),
        (true, false, false, true) => Some(WindowEdge::BottomLeft),
        (false, true, false, true) => Some(WindowEdge::BottomRight),
        (true, false, false, false) => Some(WindowEdge::Left),
        (false, true, false, false) => Some(WindowEdge::Right),
        (false, false, true, false) => Some(WindowEdge::Top),
        (false, false, false, true) => Some(WindowEdge::Bottom),
        _ => None,
    }
}

pub fn window_root() -> WindowRoot {
    WindowRoot {}
}

struct WindowRootState {
    cursor_style: Option<CursorStyle>,
}

// TODO: Remove this when GPUI has released v0.2.3
impl Render for WindowRootState {
    fn render(&mut self, _: &mut Window, _: &mut Context<Self>) -> impl IntoElement {
        div()
    }
}

#[derive(IntoElement)]
pub struct WindowRoot {}

impl RenderOnce for WindowRoot {
    fn render(self, window: &mut Window, cx: &mut App) -> impl IntoElement {
        let state = window.use_state(cx, |_, _| WindowRootState { cursor_style: None });

        let state_clone = state.clone();

        div()
            .child(
                canvas(
                    |_bounds, window, _| {
                        window.insert_hitbox(
                            Bounds::new(
                                point(px(0.0), px(0.0)),
                                window.window_bounds().get_bounds().size,
                            ),
                            HitboxBehavior::Normal,
                        )
                    },
                    move |_bounds, hitbox, window, cx| match state_clone.read(cx).cursor_style {
                        Some(style) => window.set_cursor_style(style, &hitbox),
                        _ => (),
                    },
                )
                .size_full()
                .absolute(),
            )
            .on_mouse_move(window.listener_for(&state, |state, _, window, cx| {
                let size = window.window_bounds().get_bounds().size;
                let position = window.mouse_position();
                let edge = window_edge(size, position);

                let previous_cursor_style = state.cursor_style;
                let new_cursor_style = edge.map(|edge| edge.cursor_style());

                if previous_cursor_style != new_cursor_style {
                    state.cursor_style = new_cursor_style;
                    cx.notify();
                }
            }))
            .on_mouse_down(gpui::MouseButton::Left, |_, window, _| {
                let size = window.window_bounds().get_bounds().size;
                let position = window.mouse_position();
                let edge = window_edge(size, position);

                if let Some(edge) = edge {
                    window.start_window_resize(edge.resize_direction());
                }
                println!("{:?} {:?}", size, position)
            })
            .size_full()
            .absolute()
    }
}

use std::rc::Rc;

use gpui::{
    App, ClickEvent, ElementId, Hsla, InteractiveElement, IntoElement, ParentElement, Render,
    RenderOnce, SharedString, StatefulInteractiveElement, Styled, Window, WindowControlArea, div,
    prelude::FluentBuilder, svg,
};

use crate::style::Style;

pub enum ButtonVariant {
    Standard,
    Primary,
    Success,
    Warning,
    Danger,
}

#[derive(PartialEq, Eq)]
pub enum ButtonFunction {
    Custom,
    Minimize,
    Maximize,
    Close,
}

pub struct ButtonStyle {
    background_normal: Hsla,
    background_hover: Hsla,
    background_active: Hsla,
    background_disabled: Hsla,
}

impl From<ButtonVariant> for ButtonStyle {
    fn from(variant: ButtonVariant) -> Self {
        match variant {
            ButtonVariant::Standard => ButtonStyle {
                background_normal: Style::button_standard_background_normal(),
                background_hover: Style::button_standard_background_hover(),
                background_active: Style::button_standard_background_active(),
                background_disabled: Style::button_standard_background_disabled(),
            },
            ButtonVariant::Primary => ButtonStyle {
                background_normal: Style::button_primary_background_normal(),
                background_hover: Style::button_primary_background_hover(),
                background_active: Style::button_primary_background_active(),
                background_disabled: Style::button_primary_background_disabled(),
            },
            ButtonVariant::Success => ButtonStyle {
                background_normal: Style::button_success_background_normal(),
                background_hover: Style::button_success_background_hover(),
                background_active: Style::button_success_background_active(),
                background_disabled: Style::button_success_background_disabled(),
            },
            ButtonVariant::Warning => ButtonStyle {
                background_normal: Style::button_warning_background_normal(),
                background_hover: Style::button_warning_background_hover(),
                background_active: Style::button_warning_background_active(),
                background_disabled: Style::button_warning_background_disabled(),
            },
            ButtonVariant::Danger => ButtonStyle {
                background_normal: Style::button_danger_background_normal(),
                background_hover: Style::button_danger_background_hover(),
                background_active: Style::button_danger_background_active(),
                background_disabled: Style::button_danger_background_disabled(),
            },
        }
    }
}

#[derive(IntoElement)]
pub struct Button {
    id: ElementId,
    style: ButtonStyle,
    ghost: bool,
    function: ButtonFunction,

    // Contents
    icon: Option<SharedString>,
    label: SharedString,
    // Interactivity
    on_click: Option<Rc<dyn Fn(&ClickEvent, &mut Window, &mut App)>>,
}

impl Button {
    pub fn new(id: impl Into<ElementId>) -> Self {
        Self {
            id: id.into(),
            style: ButtonStyle::from(ButtonVariant::Standard),
            ghost: false,
            function: ButtonFunction::Custom,
            icon: None,
            label: SharedString::new(""),
            on_click: None,
        }
    }

    pub fn set_variant(mut self, variant: ButtonVariant) -> Self {
        self.style = ButtonStyle::from(variant);
        self
    }

    pub fn set_style(mut self, style: ButtonStyle) -> Self {
        self.style = style;
        self
    }

    pub fn set_ghost(mut self, ghost: bool) -> Self {
        self.ghost = ghost;
        self
    }

    pub fn set_function(mut self, function: ButtonFunction) -> Self {
        self.function = function;
        self
    }

    pub fn set_icon(mut self, icon: &str) -> Self {
        self.icon = Some(SharedString::new(icon));
        self
    }

    pub fn set_label(mut self, label: &str) -> Self {
        self.label = SharedString::new(label);
        self
    }

    pub fn on_click(
        mut self,
        callback: impl Fn(&ClickEvent, &mut Window, &mut App) + 'static,
    ) -> Self {
        self.on_click = Some(Rc::new(callback));
        self
    }
}

impl RenderOnce for Button {
    fn render(self, window: &mut gpui::Window, cx: &mut gpui::App) -> impl gpui::IntoElement {
        let is_windows = cfg!(target_os = "windows");
        let is_linux = cfg!(target_os = "linux");

        return div()
            // Interactivity
            .cursor_pointer()
            .id(self.id.clone())
            // Flex
            .flex()
            .flex_row()
            .items_center()
            // Styling
            .p(Style::normal_gap())
            .rounded(Style::small_gap())
            .when(!self.ghost, |element| {
                element
                    .bg(self.style.background_normal)
                    .border_1()
                    .border_color(Style::border_color())
            })
            .active(|element| element.bg(self.style.background_active))
            .hover(|element| {
                element
                    .bg(self.style.background_hover)
                    .border_1()
                    .border_color(Style::border_color())
            })
            // Interactivity
            .when(self.function == ButtonFunction::Minimize, |element| {
                element
                    .window_control_area(WindowControlArea::Min)
                    .on_click(|event, window, _| {
                        window.minimize_window();
                    })
            })
            .when(self.function == ButtonFunction::Maximize, |element| {
                element
                    .window_control_area(WindowControlArea::Max)
                    .on_click(|event, window, _| {
                        window.zoom_window();
                    })
            })
            .when(self.function == ButtonFunction::Close, |element| {
                element
                    .window_control_area(WindowControlArea::Close)
                    .on_click(|event, window, _| {
                        window.minimize_window();
                    })
            })
            .when_some(self.on_click, |element, on_click| {
                element.on_click(move |event, window, cx| on_click(event, window, cx))
            })
            // Render children
            .when(self.icon.is_some(), |element| {
                element.child(
                    svg()
                        .path(self.icon.unwrap())
                        .size_4()
                        .text_color(Style::text_color()),
                )
            })
            .when(self.label.len() > 0, |element| element.child(self.label));
    }
}

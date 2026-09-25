use base64::prelude::*;

pub trait RustEmbedAddon {
    /// Get a resource from the embedded files and return it as a base64 encoded string with the correct mime type.
    fn get_base64_resource(path: &str) -> Option<String>;
}

impl<T> RustEmbedAddon for T
where
    T: rust_embed::RustEmbed,
{
    fn get_base64_resource(path: &str) -> Option<String> {
        let file = T::get(path)?;
        let mime = mime_guess::from_path(path).first()?; // Should this panic?
        let encoded = format!(
            "data:{};base64,{}",
            mime,
            BASE64_STANDARD.encode(file.data.as_ref())
        );

        Some(encoded)
    }
}

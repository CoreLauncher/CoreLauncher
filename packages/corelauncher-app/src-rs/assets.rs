use rust_embed::Embed;

#[derive(Embed)]
#[folder = "$OUT_DIR"]
pub struct Assets;

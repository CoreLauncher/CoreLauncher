# Only add bun to PATH on Linux
if [ "$(uname)" = "Linux" ]; then
	export BUN_INSTALL="$HOME/.bun"
	export PATH="$BUN_INSTALL/bin:$PATH"
fi
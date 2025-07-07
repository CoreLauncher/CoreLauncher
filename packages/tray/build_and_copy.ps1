# This PowerShell script builds the Rust project and copies the generated DLL to the project root.

# Build the project (release mode)
cargo build --release

# Set variables
$targetDir = "target/release"
$crateName = "tray"
$dllName = "$crateName.dll"
$srcPath = Join-Path $targetDir $dllName
$destPath = "$PSScriptRoot\$dllName"

# Copy the DLL if it exists
if (Test-Path $srcPath) {
    Copy-Item $srcPath $destPath -Force
    Write-Host "Copied $dllName to project root."
}
else {
    Write-Host "DLL not found: $srcPath"
}

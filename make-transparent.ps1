Add-Type -AssemblyName System.Drawing

$inputPath = (Resolve-Path "src/main/resources/static/images/nhanam-logo.png").Path
$dir = Split-Path $inputPath

$bmp = New-Object System.Drawing.Bitmap $inputPath
$greenBmp = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
$whiteBmp = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height

# Original green is roughly (0, 72, 43)
# White is (255, 255, 255)
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $p = $bmp.GetPixel($x, $y)
        # Calculate how close it is to white:
        # Distance from white (255,255,255)
        $whiteness = ($p.R + $p.G + $p.B) / (3.0 * 255.0)
        
        if ($whiteness -ge 0.98) {
            # Completely transparent
            $greenBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 72, 43))
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            # Calculate alpha: 0 at whiteness=0.98, 255 at whiteness <= 0.3
            $factor = (0.98 - $whiteness) / (0.98 - 0.28)
            if ($factor -gt 1.0) { $factor = 1.0 }
            if ($factor -lt 0.0) { $factor = 0.0 }
            $alpha = [int]($factor * 255)
            
            $greenBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 0, 72, 43))
            $whiteBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
        }
    }
}

$greenOut = [System.IO.Path]::Combine($dir, "nhanam-logo-green.png")
$whiteOut = [System.IO.Path]::Combine($dir, "nhanam-logo-white.png")

$greenBmp.Save($greenOut, [System.Drawing.Imaging.ImageFormat]::Png)
$whiteBmp.Save($whiteOut, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$greenBmp.Dispose()
$whiteBmp.Dispose()

# Also copy to target if target exists
$targetDir = "c:\Users\thanhh\.gemini\antigravity-ide\scratch\bookstore-ai\target\classes\static\images"
if (Test-Path $targetDir) {
    Copy-Item $greenOut $targetDir -Force
    Copy-Item $whiteOut $targetDir -Force
}

Write-Host "Created smooth green and white logos successfully!"

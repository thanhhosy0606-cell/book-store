Add-Type -AssemblyName System.Drawing

$inputPath = (Resolve-Path "src/main/resources/static/images/nhanam-logo.png").Path
$dir = Split-Path $inputPath

$bmp = New-Object System.Drawing.Bitmap $inputPath
$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $p = $bmp.GetPixel($x, $y)
        $whiteness = ($p.R + $p.G + $p.B) / (3.0 * 255.0)
        if ($whiteness -lt 0.95) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounding box: X=$minX..$maxX, Y=$minY..$maxY, Width=$($maxX - $minX + 1), Height=$($maxY - $minY + 1)"

$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1

$cropGreen = New-Object System.Drawing.Bitmap $cropW, $cropH
$cropWhite = New-Object System.Drawing.Bitmap $cropW, $cropH

for ($x = 0; $x -lt $cropW; $x++) {
    for ($y = 0; $y -lt $cropH; $y++) {
        $p = $bmp.GetPixel($minX + $x, $minY + $y)
        $whiteness = ($p.R + $p.G + $p.B) / (3.0 * 255.0)
        
        if ($whiteness -ge 0.98) {
            $cropGreen.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 72, 43))
            $cropWhite.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            $factor = (0.98 - $whiteness) / (0.98 - 0.28)
            if ($factor -gt 1.0) { $factor = 1.0 }
            if ($factor -lt 0.0) { $factor = 0.0 }
            $alpha = [int]($factor * 255)
            
            $cropGreen.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 0, 72, 43))
            $cropWhite.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
        }
    }
}

$greenOut = [System.IO.Path]::Combine($dir, "nhanam-logo-green.png")
$whiteOut = [System.IO.Path]::Combine($dir, "nhanam-logo-white.png")

$cropGreen.Save($greenOut, [System.Drawing.Imaging.ImageFormat]::Png)
$cropWhite.Save($whiteOut, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$cropGreen.Dispose()
$cropWhite.Dispose()

$targetDir = "c:\Users\thanhh\.gemini\antigravity-ide\scratch\bookstore-ai\target\classes\static\images"
if (Test-Path $targetDir) {
    Copy-Item $greenOut $targetDir -Force
    Copy-Item $whiteOut $targetDir -Force
}

Write-Host "Successfully generated cropped green and white transparent logos!"

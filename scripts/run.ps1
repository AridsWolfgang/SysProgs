param([int]$Port=8000)
$root=Split-Path $PSScriptRoot -Parent
python "$root/scripts/generate.py"
python -m http.server $Port --directory "$root/web"

# # ensure node path
# Propósito: Script ensure node path
# Pertenece a: Script utilitario
# Interacciones: CLI/automatización

param(
  [string]$NodePath = $env:NODE_BIN_PATH,
  [string]$Command
)

$defaultNodePath = "C:\Program Files\nodejs"
if (-not $NodePath -or [string]::IsNullOrWhiteSpace($NodePath)) {
  $NodePath = $defaultNodePath
}

if (-not (Test-Path -Path $NodePath)) {
  throw "No se encontró Node.js en '$NodePath'. Establece NODE_BIN_PATH o ajusta la ruta en scripts/ensure-node-path.ps1."
}

$pathEntries = $env:Path -split ';'
if (-not ($pathEntries -contains $NodePath)) {
  $env:Path = "$NodePath;$env:Path"
}

Write-Host "Node.js disponible en: $NodePath"
Write-Host "Versión: " -NoNewline
& "$NodePath\node.exe" -v

if ($Command) {
  Write-Host "Ejecutando comando: $Command"
  Invoke-Expression $Command
}

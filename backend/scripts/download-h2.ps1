$ErrorActionPreference = 'Stop'

$backendRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$libDir = Join-Path $backendRoot 'lib'
$version = '2.2.224'
$jarName = "h2-$version.jar"
$jarPath = Join-Path $libDir $jarName
$url = "https://repo1.maven.org/maven2/com/h2database/h2/$version/$jarName"

New-Item -ItemType Directory -Force -Path $libDir | Out-Null

if (Test-Path -LiteralPath $jarPath) {
    Write-Host "H2 ya existe: $jarPath"
    exit 0
}

Write-Host "Descargando H2 $version..."
Invoke-WebRequest -Uri $url -OutFile $jarPath
Write-Host "Listo: $jarPath"

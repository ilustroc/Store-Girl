$ErrorActionPreference = 'Stop'

$backendRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$version = '2.2.224'
$jarPath = Join-Path $backendRoot "lib\h2-$version.jar"
$outDir = Join-Path $backendRoot 'out'

& (Join-Path $PSScriptRoot 'download-h2.ps1')

if (Test-Path -LiteralPath $outDir) {
    Remove-Item -LiteralPath $outDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$sources = Get-ChildItem -Path (Join-Path $backendRoot 'src') -Recurse -Filter '*.java' | ForEach-Object { $_.FullName }
if (-not $sources) {
    throw 'No se encontraron archivos Java para compilar.'
}

& javac -encoding UTF-8 -cp $jarPath -d $outDir $sources
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "Backend compilado en $outDir"

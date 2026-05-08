$ErrorActionPreference = 'Stop'

$backendRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$version = '2.2.224'
$jarPath = Join-Path $backendRoot "lib\h2-$version.jar"
$outDir = Join-Path $backendRoot 'out'
$port = if ($args.Length -gt 0) { $args[0] } else { '8080' }

& (Join-Path $PSScriptRoot 'compile.ps1')

Push-Location $backendRoot
try {
    & java -cp "$outDir;$jarPath" com.tecnostore.Application $port
}
finally {
    Pop-Location
}

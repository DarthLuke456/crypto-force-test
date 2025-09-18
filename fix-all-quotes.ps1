# Script para arreglar todas las comillas sin escapar en el contenido de texto
$files = Get-ChildItem -Path "app" -Recurse -Filter "*.tsx"

foreach ($file in $files) {
    Write-Host "Procesando: $($file.Name)"
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Reemplazar comillas dobles en contenido de texto (no en atributos)
    # Buscar patrones como: >texto con "comillas"< y reemplazar las comillas internas
    $content = $content -replace '(?<=>)([^<]*)"([^<]*)"([^<]*)(?=<)', '$1&quot;$2&quot;$3'
    
    # Reemplazar comillas simples en contenido de texto
    $content = $content -replace '(?<=>)([^<]*)\'([^<]*)\'([^<]*)(?=<)', '$1&apos;$2&apos;$3'
    
    # Casos especiales para texto que está dentro de etiquetas p, h1, h2, h3, h4, li, etc.
    $content = $content -replace '(?<=<p[^>]*>)([^<]*)"([^<]*)"([^<]*)(?=</p>)', '$1&quot;$2&quot;$3'
    $content = $content -replace '(?<=<h[1-6][^>]*>)([^<]*)"([^<]*)"([^<]*)(?=</h[1-6]>)', '$1&quot;$2&quot;$3'
    $content = $content -replace '(?<=<li[^>]*>)([^<]*)"([^<]*)"([^<]*)(?=</li>)', '$1&quot;$2&quot;$3'
    $content = $content -replace '(?<=<span[^>]*>)([^<]*)"([^<]*)"([^<]*)(?=</span>)', '$1&quot;$2&quot;$3'
    $content = $content -replace '(?<=<div[^>]*>)([^<]*)"([^<]*)"([^<]*)(?=</div>)', '$1&quot;$2&quot;$3'
    
    # Casos especiales para comillas simples
    $content = $content -replace '(?<=<p[^>]*>)([^<]*)\'([^<]*)\'([^<]*)(?=</p>)', '$1&apos;$2&apos;$3'
    $content = $content -replace '(?<=<h[1-6][^>]*>)([^<]*)\'([^<]*)\'([^<]*)(?=</h[1-6]>)', '$1&apos;$2&apos;$3'
    $content = $content -replace '(?<=<li[^>]*>)([^<]*)\'([^<]*)\'([^<]*)(?=</li>)', '$1&apos;$2&apos;$3'
    
    # Guardar el archivo
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Archivo procesado: $($file.Name)"
}

Write-Host "Proceso completado!" 
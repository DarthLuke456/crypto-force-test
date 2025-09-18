# Script para arreglar atributos JSX que fueron escapados incorrectamente
$files = @(
    "app/dashboard/iniciado/Practico/2-introduccion-analisis-tecnico/contenido/page.tsx",
    "app/dashboard/iniciado/Practico/4-fibonacci-medias/contenido/page.tsx",
    "app/dashboard/iniciado/Practico/5-estocastico-bollinger/contenido/page.tsx",
    "app/dashboard/iniciado/Practico/7-analisis-fundamental/contenido/page.tsx",
    "app/dashboard/iniciado/Practico/8-correlaciones-mercados/contenido/page.tsx",
    "app/dashboard/iniciado/Practico/9-gestion-riesgo/contenido/page.tsx",
    "app/dashboard/iniciado/Teorico/1-introduccion-logica-economica/contenido/page.tsx",
    "app/dashboard/iniciado/Teorico/3-accion-gobierno-mercados/contenido/page.tsx",
    "app/dashboard/iniciado/Teorico/4-competencia-perfecta/contenido/page.tsx",
    "app/dashboard/iniciado/Teorico/6-tecnologia-blockchain/contenido/page.tsx",
    "app/dashboard/iniciado/Teorico/7-criptomonedas/contenido/page.tsx",
    "app/dashboard/iniciado/Teorico/8-operaciones-criptomonedas/contenido/page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Procesando: $file"
        
        # Leer el contenido del archivo
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Reemplazar atributos JSX específicos
        $content = $content -replace 'className=&quot;', 'className="'
        $content = $content -replace '&quot;>', '">'
        $content = $content -replace '&quot; />', '" />'
        $content = $content -replace '&quot; /', '" /'
        $content = $content -replace '&quot;', '"'
        
        # Escribir el contenido de vuelta al archivo
        $content | Set-Content $file -Encoding UTF8
        
        Write-Host "Archivo procesado: $file"
    } else {
        Write-Host "Archivo no encontrado: $file"
    }
}

Write-Host "Proceso completado!" 
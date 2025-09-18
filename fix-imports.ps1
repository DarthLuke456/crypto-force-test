# Script para arreglar declaraciones de importación con entidades HTML
$files = Get-ChildItem -Path "app" -Recurse -Filter "*.tsx" | Where-Object { $_.FullName -like "*contenido*" }

foreach ($file in $files) {
    Write-Host "Procesando: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Arreglar declaraciones de importación
    $content = $content -replace "import React from &apos;react&apos;;", "import React from 'react';"
    $content = $content -replace "import BackButton from &apos;@/components/ui/BackButton&apos;;", "import BackButton from '@/components/ui/BackButton';"
    $content = $content -replace "import Link from &apos;next/link&apos;;", "import Link from 'next/link';"
    $content = $content -replace "import \{ ArrowLeft \} from &apos;lucide-react&apos;;", "import { ArrowLeft } from 'lucide-react';"
    
    # Guardar el archivo
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Archivo procesado: $($file.Name)"
}

Write-Host "Proceso completado!" 
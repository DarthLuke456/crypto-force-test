@echo off
echo Haciendo push de cambios...
git add .
git commit -m "fix: Corregir selector de archivos y agregar logs de debug - Mejorar click handler del avatar con preventDefault - Agregar logs detallados en useAvatar hook - Corregir problema de selector de archivos no abierto"
git push origin main
echo Push completado!
pause

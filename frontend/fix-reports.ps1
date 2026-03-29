$reportFiles = Get-ChildItem -Path "app\(system)\reports" -Recurse -Filter "page.tsx"

foreach ($file in $reportFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove unused imports
    $content = $content -replace "import \{ useState \} from 'react';\s*\n", ""
    $content = $content -replace ",\s*useState", ""
    $content = $content -replace "useState,\s*", ""
    
    # Remove unused icons from lucide-react imports
    $content = $content -replace ",\s*Download", ""
    $content = $content -replace "Download,\s*", ""
    $content = $content -replace ",\s*Filter", ""
    $content = $content -replace "Filter,\s*", ""
    $content = $content -replace ",\s*Calendar", ""
    $content = $content -replace "Calendar,\s*", ""
    $content = $content -replace ",\s*RefreshCw", ""
    $content = $content -replace "RefreshCw,\s*", ""
    $content = $content -replace ",\s*Plus", ""
    $content = $content -replace "Plus,\s*", ""
    
    # Fix double semicolons
    $content = $content -replace ";;", ";"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
}

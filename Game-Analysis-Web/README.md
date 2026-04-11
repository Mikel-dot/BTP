# Game Analysis Web

Version estatica de `Game Analysis` y de las paginas de campeon, preparada para publicarse en GitHub Pages sin depender de `pywebview`.

## Contenido

- `index.html`: aplicacion web estatica.
- `assets/`: CSS y JavaScript del sitio.
- `data/`: JSON exportados desde los parquets.
- `scripts/export_data.py`: regenerador de datos estaticos.

## Regenerar datos

Desde la raiz del repositorio:

```powershell
python .\Game-Analysis-Web\scripts\export_data.py
```

## Probar localmente

```powershell
cd .\Game-Analysis-Web
python -m http.server 8080
```

Despues abre `http://localhost:8080`.

No abras `index.html` con doble clic directo. Esta version usa `fetch` para leer JSON estaticos y necesita servirse por `http`.

## Notas

- Esta version no incluye integracion con el cliente de LoL.
- Las imagenes de campeones, items y runas se cargan desde Data Dragon de Riot.

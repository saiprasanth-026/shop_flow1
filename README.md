# ShopFlow

A small Flask shop website with a product catalog, cart interactions, and SQLite-backed sign-up and login.

## Run locally

Requirements: Python 3.10 or newer.

From the project folder, activate the virtual environment and start Flask:

```powershell
..\.venv\Scripts\Activate.ps1
python app.py
```

The virtual environment is in the parent folder. If you do not have one yet, create it and install Flask:

```powershell
py -m venv ..\.venv
..\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Open `http://localhost:5000`. Stop the server with `Ctrl+C`.

The app creates `shopflow.db` next to `app.py` on first run. The demo account is `demo@example.com` with password `123456`.

## Deploy to Render

1. Push this project to a GitHub repository.
2. In Render, choose **New > Blueprint** and connect that repository.
3. Render reads `render.yaml` to create the Flask web service and persistent SQLite disk.

The persistent disk requires Render's paid Starter service. Keep it enabled so accounts survive redeploys. Render generates the session secret automatically.

## Project files

- `app.py`: Flask routes and SQLite user database
- `templates/`: storefront and login pages
- `static/`: CSS and browser JavaScript
- `requirements.txt`: Python dependencies

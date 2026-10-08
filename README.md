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

## Deploy the static storefront with GitHub Pages

The root `index.html` is a static version of the storefront. In the GitHub repository, open **Settings > Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save. The site will be available at `https://saiprasanth-026.github.io/shop_flow1/` after Pages finishes publishing.

The static version supports product search, filters, sorting, and a browser-local cart, wishlist, and theme preference. Account login, checkout, and newsletter signup require a backend and are not active on the static site. The Flask app and SQLite-backed accounts continue to work when run on a Python host.

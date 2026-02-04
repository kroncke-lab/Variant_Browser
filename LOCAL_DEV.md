# Local Development Setup for VariantBrowser

## Quick Start (SQLite Mode)

For quick template/view testing without Azure SQL:

```bash
cd /mnt/temp2/kronckbm/gitrepos/Variant_Browser

# Remove Windows venv if present
rm -rf venv

# Create Linux venv
python3 -m venv venv
source venv/bin/activate

# Install minimal dependencies (skip pyodbc for SQLite mode)
pip install Django==3.2 whitenoise==5.2.0 scipy>=1.9.0

# Run migrations (creates SQLite database)
python manage.py migrate --settings=variantbrowser.settings_local

# Collect static files
python manage.py collectstatic --settings=variantbrowser.settings_local --noinput

# Run the development server
python manage.py runserver --settings=variantbrowser.settings_local
```

Visit http://127.0.0.1:8000/

**Note:** In SQLite mode, variant data pages won't work (they need Azure SQL), but you can test:
- Home page
- About page  
- Penetrance Protocol pages
- Template/CSS changes

---

## Full Setup (Azure SQL Mode)

For testing with real variant data:

### Prerequisites

1. **Python 3.9+** installed
2. **ODBC Driver 17 for SQL Server** installed
   - Mac: `brew install microsoft/mssql-release/msodbcsql17`
   - Ubuntu/RHEL: See [Microsoft docs](https://docs.microsoft.com/en-us/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server)
   - Windows: Download from Microsoft

### Setup

```bash
cd /mnt/temp2/kronckbm/gitrepos/Variant_Browser
rm -rf venv  # Remove old venv if present
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Create `.env` file

Create a file named `.env` in the project root:

```bash
# .env - DO NOT COMMIT THIS FILE
SECRET_KEY=your-secret-key-here-make-it-long-and-random
DEBUG=true

# Azure SQL Database credentials
DJANGO_DATABASE_NAME=variantbrowser
DJANGO_DATABASE_USER=your-db-username
DJANGO_DATABASE_PASSWORD=your-db-password
DJANGO_DATABASE_SERVER=your-server.database.windows.net
```

**To generate a secret key:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Load environment and run

```bash
# Load env vars
export $(grep -v '^#' .env | xargs)

# Run the development server
python manage.py runserver
```

---

## Project Structure

```
Variant_Browser/
├── variantbrowser/          # Main Django project
│   ├── settings.py          # Production settings (Azure SQL)
│   ├── settings_local.py    # Local dev settings (SQLite)
│   ├── urls.py              # URL routing
│   ├── views.py             # Home, About, Penetrance Protocol views
│   ├── middleware.py        # Bot blocking middleware
│   └── templates/           # Base templates
├── scn5a/                   # SCN5A gene module
├── kcnh2/                   # KCNH2 gene module
├── kcnq1/                   # KCNQ1 gene module
├── ryr2/                    # RyR2 gene module
├── static/                  # Static files
├── staticfiles/             # Collected static files
├── requirements.txt         # Python dependencies
└── manage.py                # Django management script
```

---

## Key URLs

| URL | View | Description |
|-----|------|-------------|
| `/` | home | Homepage with gene links |
| `/about/` | about | About page |
| `/penetrance_estimate_protocol/` | penetrance_estimation | Protocol overview |
| `/penetrance_estimate_protocol_details/` | penetrance_estimation_first_SCN5A | SCN5A protocol details |
| `/SCN5A/` | scn5a index | SCN5A variant browser |
| `/KCNH2/` | kcnh2 index | KCNH2 variant browser |
| `/KCNQ1/` | kcnq1 index | KCNQ1 variant browser |
| `/RyR2/` | ryr2 index | RyR2 variant browser |

---

## Troubleshooting

### "ODBC Driver 17 for SQL Server not found"
Install the ODBC driver for your OS (see Prerequisites above).

### "Login failed for user"
Check your database credentials in `.env`. You may need to:
1. Whitelist your IP in Azure SQL firewall rules
2. Verify the username format (sometimes needs `user@server`)

### Static files not loading
Run:
```bash
python manage.py collectstatic
```

### Bot middleware blocking requests
In development, requests with `curl` or `python-requests` user agents are blocked.
Use `settings_local.py` which disables this middleware.

---

## Known Issues

### Protocol Link 400 Error (Production)

The Protocol pages (`/penetrance_estimate_protocol/` and `/penetrance_estimate_protocol_details/`) are simple template renders that don't require database access.

**Views involved:** (in `variantbrowser/views.py`)
```python
def penetrance_estimation(request):
    return render(request, 'penetrance_estimate.html')

def penetrance_estimation_first_SCN5A(request):
    return render(request, 'penetrance_protocol_first_SCN5A.html')
```

**If you get a 400 error on production, check:**

1. **ALLOWED_HOSTS mismatch** — The current `settings.py` has:
   ```python
   ALLOWED_HOSTS = ['variantbrowser.azurewebsites.net', 'variantbrowser.org', '127.0.0.1', 'localhost']
   ```
   If users access via `www.variantbrowser.org`, add it to this list.

2. **Bot middleware** — Returns 403 (not 400) for blocked user agents. Check `middleware.py` for the block list.

3. **Azure App Service** — Check if reverse proxy is forwarding incorrect Host headers.

4. **Large template files** — The penetrance templates are large (~7MB each with embedded base64 images). Unlikely to cause 400 on GET requests, but could cause timeouts.

5. **Django security middleware** — A 400 typically indicates `SuspiciousOperation` from:
   - Invalid Host header
   - Malformed request
   - Cookie size limits

**To debug:** Enable more verbose logging in `settings.py`:
```python
LOGGING['loggers']['django.request']['level'] = 'DEBUG'
```

**Local testing:** Use `settings_local.py` which disables bot middleware and sets `ALLOWED_HOSTS = ['*']`.

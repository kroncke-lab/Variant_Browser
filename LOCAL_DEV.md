# Local Development Setup for VariantBrowser

## Prerequisites

1. **Python 3.9+** installed
2. **ODBC Driver 17 for SQL Server** installed
   - Mac: `brew install microsoft/mssql-release/msodbcsql17`
   - Ubuntu: See [Microsoft docs](https://docs.microsoft.com/en-us/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server)
   - Windows: Download from Microsoft

## Setup

### 1. Clone and create virtual environment

```bash
cd ~/gitrepos/Variant_Browser
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Create `.env` file

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

### 3. Install python-dotenv (optional but recommended)

Add to requirements.txt or install:
```bash
pip install python-dotenv
```

Then add to the top of `variantbrowser/settings.py`:
```python
from dotenv import load_dotenv
load_dotenv()
```

**OR** load env vars manually before running:
```bash
export $(grep -v '^#' .env | xargs)
```

### 4. Run the development server

```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000/

## Notes

- The local server still connects to your Azure SQL Database (the data lives there)
- Static files are served via WhiteNoise in dev mode
- Cache is in-memory (LocMemCache), so restarts clear it
- Set `DEBUG=true` for detailed error pages

## Troubleshooting

### "ODBC Driver 17 for SQL Server not found"
Install the driver for your OS (see Prerequisites above).

### "Login failed for user"
Check your database credentials in `.env`. You may need to:
1. Whitelist your IP in Azure SQL firewall rules
2. Verify the username format (sometimes needs `user@server`)

### Static files not loading
Run:
```bash
python manage.py collectstatic
```

#!/usr/bin/env bash
# exit on error
set -o errexit

echo "==> Installing Python 3.11 dependencies"
pip install --upgrade pip
pip install --no-cache-dir -r backend/requirements.txt

echo "==> Initializing database"
cd backend
python -c "from database import init_db; init_db()" || echo "Database already initialized"

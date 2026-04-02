# Database Backup & Restore Cron Job Guide

This cron job allows you to automate daily database backups and restores for the `ChohanTravel` MSSQL database.

## Configuration (.env)

The following environment variables control the behavior:

```env
# Action can be: 'BACKUP', 'RESTORE', or 'BOTH'
DB_BACKUP_ACTION="BACKUP"

# Cron Schedule (Standard cron syntax)
# e.g., '0 2 * * *' runs daily at 2:00 AM
DB_BACKUP_SCHEDULE="0 2 * * *"

# The name of the database to backup/restore
DB_NAME="ChohanTravel"

# [RESTORE] Path to the source .bak file (relative to SQL Container filesystem)
DB_BACKUP_SOURCE_PATH="/var/opt/mssql/dbbackup/daily_backup.bak"

# [BACKUP/SAVE] Path to the directory where backups are saved (relative to SQL Container filesystem)
DB_BACKUP_SAVE_PATH="/var/opt/mssql/dbbackup/"
```

## Docker Volume Configuration

All backups are stored on the host at `/home/amit/chohantravel/dbbackup`.
Backups are automatically organized in **date-stamped folders** (e.g., `dbbackup/2026-04-02/`).

The `docker-compose.yml` has been updated to mount this directory:

```yaml
services:
  backend:
    volumes:
      - ./dbbackup:/api/dbbackup

  db:
    volumes:
      - ./dbbackup:/var/opt/mssql/dbbackup
```

## How it works

1. **BACKUP**: Runs `BACKUP DATABASE` to the `DB_BACKUP_SAVE_PATH` with a timestamped filename.
2. **RESTORE**: 
   - Sets the database to `SINGLE_USER` mode to drop current connections.
   - Runs `RESTORE DATABASE` from `DB_BACKUP_SOURCE_PATH`.
   - Sets the database back to `MULTI_USER` mode.
3. **LOGGING**: All activities are logged to `khuraki-cron.log` (shared with other cron tasks).

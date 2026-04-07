# Backend Directory

This directory stores the persistent database files for the Field Operations application's SQLite backend.

## Files

- `database.sqlite`: The main SQLite database file containing persistent tables and records (e.g., the `inventory` table).
- `database.sqlite-shm`: The shared memory file used by SQLite in Write-Ahead Logging (WAL) mode to coordinate access between multiple database connections.
- `database.sqlite-wal`: The Write-Ahead Log file used by SQLite to record changes before they are committed to the main database, providing improved concurrency and crash recovery.

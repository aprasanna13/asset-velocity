import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'backend', 'database.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

const setupDatabase = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_compatibility TEXT NOT NULL,
            part_number TEXT UNIQUE NOT NULL,
            description TEXT,
            stock_level INTEGER NOT NULL,
            lead_time_days INTEGER NOT NULL,
            warehouse_id TEXT NOT NULL
        );
    `);

    const insert = db.prepare(`
        INSERT OR IGNORE INTO inventory (model_compatibility, part_number, description, stock_level, lead_time_days, warehouse_id)
        VALUES (?, ?, ?, ?, ?, ?);
    `);

    const initialInventory = [
        ['High-Flow Centrifugal', 'GASK-9921-X', 'Compressor Valve Gasket Kit', 12, 0, 'TX-S-04'],
        ['High-Flow Centrifugal', 'SEAL-HT-434', 'High-Temp Main Shaft Seal', 4, 2, 'TX-S-04'],
        ['High-Flow Centrifugal', 'LUBE-SYN-Q', 'Synthetic Lubricant (5 Gal)', 25, 0, 'TX-S-04'],
    ];

    db.transaction(() => {
        for (const item of initialInventory) {
            insert.run(...item);
        }
    })();

    console.log('Database setup complete and populated with initial data.');
};

setupDatabase();

export default db;
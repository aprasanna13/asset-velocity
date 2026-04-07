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
        ['High-Flow Centrifugal', 'FLTR-oil-01', 'Main Oil Filter Element', 50, 2, 'WH-TX-01'],
        ['High-Flow Centrifugal', 'VLV-BYP-02', 'Bypass Valve Rebuild Kit', 3, 5, 'WH-TX-01'],
        ['High-Flow Centrifugal', 'SENS-VIB-03', 'High-Temp Vibration Sensor', 12, 1, 'WH-TX-02'],
        ['High-Flow Centrifugal', 'BRG-MAIN-04', 'Main Shaft Roller Bearing', 2, 10, 'WH-TX-01'],
        ['High-Flow Centrifugal', 'GSKT-HEAD-05', 'Cylinder Head Gasket Set', 15, 3, 'WH-TX-02'],
        ['Reciprocating XL', 'PIST-RING-06', 'Compression Ring Set set', 20, 4, 'WH-OK-01'],
        ['Reciprocating XL', 'VLV-SUC-07', 'Suction Valve Assembly', 5, 7, 'WH-OK-01'],
        ['Reciprocating XL', 'SENS-PRES-08', 'Digital Pressure Transducer', 8, 2, 'WH-OK-02'],
        ['General', 'LUBE-GEAR-09', 'Industrial Gear Oil (5 Gal)', 30, 0, 'WH-TX-01'],
        ['General', 'CLEAN-SOLV-10', 'Degreasing Solvent (1 Gal)', 45, 0, 'WH-TX-02'],
        ['High-Flow Centrifugal', 'O-RING-KIT-11', 'Viton O-Ring Assortment', 100, 1, 'WH-TX-01'],
        ['Reciprocating XL', 'PLUG-IGN-12', 'Industrial Spark Plug', 40, 1, 'WH-OK-01'],
        ['High-Flow Centrifugal', 'COUPLING-13', 'Flexible Shaft Coupling', 1, 14, 'WH-TX-02'],
        ['General', 'H2S-DET-14', 'Portable H2S Gas Detector', 6, 3, 'WH-TX-01'],
        ['Reciprocating XL', 'CON-ROD-15', 'Connecting Rod Bearing Kit', 4, 8, 'WH-OK-02'],
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
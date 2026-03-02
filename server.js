import express from 'express';
import db from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// API Routes (Defined BEFORE static middleware)
app.get('/api/inventory', (req, res) => {
    try {
        const inventory = db.prepare('SELECT * FROM inventory').all();
        const inventoryWithStatus = inventory.map(item => ({
            ...item,
            status: item.stock_level < 5 ? 'Low Stock' : 'Available',
        }));
        res.json(inventoryWithStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/inventory/:part_number', (req, res) => {
    const { part_number } = req.params;
    const { quantity } = req.body;

    try {
        const item = db.prepare('SELECT stock_level FROM inventory WHERE part_number = ?').get(part_number);
        if (!item) {
            return res.status(404).json({ error: 'Part number not found' });
        }

        const newStockLevel = item.stock_level + quantity;
        if (newStockLevel < 0) {
            return res.status(400).json({ error: 'Stock level cannot be negative' });
        }

        db.prepare('UPDATE inventory SET stock_level = ? WHERE part_number = ?').run(newStockLevel, part_number);
        res.json({ message: 'Stock level updated successfully', newStockLevel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', (req, res) => {
    const { part_number, quantity } = req.body;
    if (!part_number || !quantity) {
        return res.status(400).json({ error: 'Part number and quantity are required.' });
    }

    try {
        const item = db.prepare('SELECT stock_level FROM inventory WHERE part_number = ?').get(part_number);
        if (item) {
            const newStockLevel = item.stock_level + quantity;
            db.prepare('UPDATE inventory SET stock_level = ? WHERE part_number = ?').run(newStockLevel, part_number);
            res.status(200).json({ message: `Ordered ${quantity} of ${part_number}. Stock increased.`, newStockLevel });
        } else {
            res.status(404).json({ message: 'Part not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html for React Router
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
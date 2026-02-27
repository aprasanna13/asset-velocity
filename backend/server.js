const express = require('express');
const cors = require('cors');
const db = require('./database'); // Assuming database.js is in the same directory

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Inventory route
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
    const { quantity } = req.body; // Expecting { quantity: -1 } to decrement, { quantity: 1 } to increment

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


// Orders route (simplified for now, can be expanded)
app.post('/api/orders', (req, res) => {
    const { part_number, quantity } = req.body;
    if (!part_number || !quantity) {
        return res.status(400).json({ error: 'Part number and quantity are required.' });
    }

    try {
        // For simplicity, we'll just increment the stock for now
        // In a real scenario, this would create an order record and potentially update stock later.
        const item = db.prepare('SELECT stock_level FROM inventory WHERE part_number = ?').get(part_number);
        if (item) {
            const newStockLevel = item.stock_level + quantity;
            db.prepare('UPDATE inventory SET stock_level = ? WHERE part_number = ?').run(newStockLevel, part_number);
            res.status(200).json({ message: `Ordered ${quantity} of ${part_number}. Stock increased.`, newStockLevel });
        } else {
            // If the part doesn't exist, we might create a new entry or just return an error
            res.status(404).json({ message: 'Part not found for ordering, consider adding it first.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

**Timestamp:** 2026-02-27   10:06

**Upgrade to the  SAP inventory serivce  . 

-** Sample Data  and fiellds
model,part_number,description,stock_level,lead_time_days
High-Flow Centrifugal,GASK-9921-X,Compressor Valve Gasket Kit,12,0
High-Flow Centrifugal,SEAL-HT-44,High-Temp Main Shaft Seal,4,2
High-Flow Centrifugal,LUBE-SYN-Q,Synthetic Lubricant (5 Gal),25,0


This technical implementation plan outlines the steps required to transition the **SAP Mock Inventory Lookup** from hardcoded data to a persistent Node.js and SQLite backend.

### **Phase 1: Environment & Database Architecture**

1. **Project Initialization:** Initialize a Node.js project and install dependencies (`express`, `sqlite3` or `better-sqlite3`, `cors`).
2. **Database Seeding:** Create a `database.sqlite` file and implement a migration script to define the `inventory` table.
3. **Schema Definition:** Define the table columns to match the UI:
* `id` (Primary Key)
* `model_compatibility` (String)
* `part_number` (String, Unique)
* `description` (Text)
* `stock_level` (Integer)
* `lead_time_days` (Integer)
* `warehouse_id` (String - e.g., "TX-S-04")

### **Phase 1.1: Sample Data **

```

model,part_number,description,stock_level,lead_time_days
High-Flow Centrifugal,GASK-9921-X,Compressor Valve Gasket Kit,12,0
High-Flow Centrifugal,SEAL-HT-44,High-Temp Main Shaft Seal,4,2
High-Flow Centrifugal,LUBE-SYN-Q,Synthetic Lubricant (5 Gal),25,0

```

4. **Initial Data Population:** Write a script to insert the three core assets (Gasket Kit, Shaft Seal, Lubricant) into the SQLite table.

### **Phase 2: Backend API Development (Node.js)**

5. **Server Setup:** Configure an Express.js server with JSON parsing and CORS enabled for the React frontend.
6. **Read Endpoint (GET):** Implement a `GET /api/inventory` route to fetch all records from the SQLite database.
7. **Dynamic Status Logic:** Implement backend logic to calculate the `status` string (e.g., if `stock_level` < 5, return "LOW STOCK", else "AVAILABLE").
8. **Update Endpoint (PATCH):** Implement a `PATCH /api/inventory/:part_number` route to decrement stock levels when Agent B "Reserves" a part during a maintenance workflow.
9. **Order Entry Endpoint (POST):** Implement a `POST /api/orders` route to handle the "Order Parts" button logic, which increments stock levels or creates a pending procurement record.

### **Phase 3: Frontend Binding & Integration**

10. **State Refactoring:** Replace the `SAP_INVENTORY` constant in `app.jsx` with a React state variable (e.g., `const [inventory, setInventory] = useState([])`).
11. **Data Fetching:** Implement a `useEffect` hook to call the `GET` endpoint on component mount and populate the inventory table.
12. **Agent B Logic Update:** Modify the `nextStep` function in the Workflow Engine to trigger a backend `PATCH` request when "Verify Stock" is clicked, ensuring the database reflects the part reservation.
13. **Order Parts Binding:** Connect the "Order Parts" UI button to the `POST` endpoint to simulate the procurement process.
14. **Error Handling:** Implement visual feedback (e.g., toast messages or status indicators) if the API fails to connect or if a part is out of stock in the database.
# **Gemini CLI Instruction: Single-Port React & Node.js Integration**

**Context:** I am developing a full-stack application on **GCP Cloud Workstations**. I am currently facing **CORS errors** and **Google Identity Proxy (302 redirect) issues** because my React frontend (Port 3000\) and Node.js backend (Port 3001\) are running on different ports.

**Objective:** Convert my project into a **Single-Port Deployment** where the Node.js server serves the React static build files. This will eliminate CORS by using a single origin.

**Please provide the following:**

### **1\. Project Structure Setup**

Explain how to structure the folders so that the Node.js server can access the React `build` or `dist` directory.

### **2\. Node.js (Express) Code Changes**

Provide the code to:

* Use `path` and `express.static` to serve the frontend files.  
* Implement a **catch-all route** (`app.get('*')`) to ensure React Router works correctly (client-side routing).  
* Ensure API routes (e.g., `/api/*`) are defined **before** the static middleware.

### **3\. Frontend (React) Code Changes**

* Show how to change `fetch` or `axios` calls from absolute URLs (e.g., `https://3001...`) to **relative paths** (e.g., `/api/inventory`).  
* Explain how to update the `package.json` to include a `proxy` field for local development.

### **4\. Build & Deployment Script**

Provide a single `npm` script for the root `package.json` that:

1. Enters the frontend folder.  
2. Runs `npm install` and `npm run build`.  
3. Moves the build folder to the backend directory (if necessary).  
4. Starts the Node.js server.

**Constraints:**

* The solution must work within the **GCP Cloud Workstation** environment.  
* The final application must run entirely on **Port 3001** (or a single defined port).  
* Avoid using the `cors` npm package, as it should no longer be needed.

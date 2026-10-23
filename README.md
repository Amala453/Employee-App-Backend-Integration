# Employee App Backend Integration

## Setup
1. Open this `Casestudy2` folder in VS Code.
2. Run `npm install`.
3. In MongoDB Atlas, create a database user, allow your current IP address in Network Access, and copy the connection string.
4. Set the connection string as `MONGODB_URI` before starting the server.

### Windows PowerShell
```powershell
$env:MONGODB_URI="mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/employeeDB?retryWrites=true&w=majority"
npm start
```

### macOS/Linux
```bash
export MONGODB_URI="mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/employeeDB?retryWrites=true&w=majority"
npm start
```

Open `http://localhost:3000`. Do not commit your real MongoDB connection string or password to GitHub.

## API routes
- `GET /api/employeelist` - list all employees
- `GET /api/employeelist/:id` - get one employee
- `POST /api/employeelist` - create an employee; JSON body: `{"name":"...","location":"...","position":"...","salary":50000}`
- `PUT /api/employeelist` - update an employee; include `_id` (or `id`) plus fields to update
- `DELETE /api/employeelist/:id` - delete one employee

The provided `dist/Frontend` files are included unchanged.

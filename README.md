# Todo Full Stack App

React + Node.js + SQLite todo application.

## Project Structure

```
Full stack app/
├── backend/      # Express API (port 5000)
└── frontend/     # React + Vite (port 5173)
```

## Run the App

### Backend
```bash
cd backend
npm run dev     # development (nodemon)
# or
npm start       # production
```

### Frontend
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | Endpoint         | Description     |
|--------|-----------------|-----------------|
| GET    | /api/todos       | Get all todos   |
| POST   | /api/todos       | Create todo     |
| PATCH  | /api/todos/:id   | Update todo     |
| DELETE | /api/todos/:id   | Delete todo     |

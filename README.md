# Shopping Cart App

A full-stack shopping cart application built with **ReactJS**, **NestJS**, and **PostgreSQL**.

## Features

- Browse products with name, description, price and stock
- Add / remove items from the cart and adjust quantities
- View line totals and cart total
- Checkout — creates an order and reduces stock
- Prevents checkout if stock is insufficient
- Order history page showing past orders and their items
- Swagger API docs

## Project Structure

```
Assignment/
├── backend/    # NestJS REST API
└── frontend/   # React + Vite SPA
```

## Prerequisites

- Node.js v18+
- PostgreSQL running locally (or any accessible instance)

---

## Backend Setup

```bash
cd backend

# Copy the env template and fill in your DB credentials
cp .env.example .env

# Install dependencies (already done if cloned fresh)
npm install

# Start the dev server
npm run start:dev
```

The API will be available at **http://localhost:3000**  
Swagger docs at **http://localhost:3000/api**

### Seed the database

After the server has started at least once (so the tables are created):

```bash
npm run seed
```

This inserts 6 sample products into the `products` table.

---

## Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

The React app will be available at **http://localhost:5173**

---

## Environment Variables

| Variable      | Description               | Default     |
|---------------|---------------------------|-------------|
| `DB_HOST`     | PostgreSQL host           | `localhost` |
| `DB_PORT`     | PostgreSQL port           | `5432`      |
| `DB_USERNAME` | PostgreSQL username       | `postgres`  |
| `DB_PASSWORD` | PostgreSQL password       | —           |
| `DB_NAME`     | Database name             | `shopping_cart` |
| `PORT`        | Port the API listens on   | `3000`      |

---

## API Endpoints

| Method | Path          | Description               |
|--------|---------------|---------------------------|
| GET    | /products     | List all products         |
| GET    | /products/:id | Get a single product      |
| POST   | /products     | Create a product          |
| GET    | /orders       | List all orders (history) |
| GET    | /orders/:id   | Get a single order        |
| POST   | /orders       | Submit cart / checkout    |

---

## Assumptions

- The shopping cart is stored in React component state (not persisted server-side between sessions).
- `synchronize: true` is used in development — TypeORM auto-creates and updates tables. This should be disabled in production and replaced with proper migrations.
- Stock is reduced inside a database transaction so partial failures are rolled back cleanly.
- Prices are captured at checkout time (`unitPrice` on `order_items`) so future product price changes don't affect old orders.

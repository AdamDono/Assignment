# Adams's Shop (Full-Stack Shopping Cart App)

A highly polished, premium full-stack shopping cart application built with **ReactJS (Vite)**, **NestJS**, and **PostgreSQL**.

This application implements a complete e-commerce checkout flow with transactional stock control, order history tracking, and JWT-based authentication.

---

## 🌟 Key Features

* **Product Listing**: View products with name, description, price, and stock levels.
* **Search & Sorting**: Filter products by search term and sort by price (Low to High / High to Low).
* **Cart Management**: Add items to the cart, increase/decrease quantities, remove items, and view live totals.
* **Secure Checkout**: Insufficient stock checks and atomic stock reduction wrapped in a **database transaction** to prevent race conditions.
* **Order History**: View previously submitted orders with details (date, items, unit prices, subtotal, and total).
* **Authentication**: JWT-based login/register flow supporting:
  * **Customer Role**: Safe checkout, personal order history.
  * **Admin Role**: View all orders, CRUD operations for adding/editing products directly in the UI.
* **Swagger/OpenAPI Documentation**: Automatically generated API documentation.

---

## 📊 Database Schema

The database consists of 4 main tables:

### 1. `users`
* Stores user credentials and access permissions.
* **Fields**: `id` (PK), `email` (Unique), `password` (bcrypt hash), `role` (`customer` | `admin`), `createdAt`.

### 2. `products`
* Stores catalog item data.
* **Fields**: `id` (PK), `name`, `description` (Nullable), `price` (Decimal), `stock` (Integer).

### 3. `orders`
* Records successfully placed orders.
* **Fields**: `id` (PK), `total` (Decimal), `userId` (FK to `users`, Nullable with `SET NULL` on delete), `createdAt`.
* **Relationship**: Many-to-One with `users`.

### 4. `order_items`
* The line items containing historical product state at checkout time.
* **Fields**: `id` (PK), `quantity` (Integer), `unitPrice` (Decimal, snapshot of price at purchase), `orderId` (FK to `orders`), `productId` (FK to `products`).
* **Relationships**: Many-to-One with `orders`, Many-to-One with `products`.

---

## 🚀 Running the App (Step-by-Step without Docker)

Follow these steps to get the backend, frontend, and database up and running locally.

### 📋 Prerequisites

* **Node.js** v18+
* **PostgreSQL** v14+ running locally on your machine

---

### Step 1: Database Setup

1. Open your PostgreSQL terminal (psql) or GUI client (like pgAdmin, DBeaver, or Postico) and create a database named `shopping_cart`:
   ```sql
   CREATE DATABASE shopping_cart;
   ```

   > [!NOTE]
   > **How the tables are created**: You do **not** need to run any manual table creation scripts. The application is configured with TypeORM's `synchronize: true` in development mode. As soon as you start the backend server in Step 2, TypeORM will automatically inspect the TypeScript entities and create all the database tables (`users`, `products`, `orders`, and `order_items`) for you.

---

### Step 2: Backend Setup & Seeding

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Copy the `.env.example` template to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open the newly created `.env` file and adjust the database credentials to match your local PostgreSQL server:
   ```env
   DB_HOST=localhost
   DB_PORT=5432       # Update if your Postgres runs on a different port (e.g. 5433)
   DB_USERNAME=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=shopping_cart
   PORT=3000
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   *The server will start at http://localhost:3000.*

6. **Seed the database** (in a new terminal tab or window inside the `backend` folder):
   ```bash
   npm run seed
   ```
   *This seeds 6 demo products and registers default testing credentials.*

---

### Step 3: Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client application will start at http://localhost:5173.*

---

## 🔑 Test Credentials

The database seed script sets up default accounts for easy testing:

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Admin** | `admin@shop.com` | `admin123` | Can view all orders and add/edit products |
| **Customer** | `customer@shop.com` | `customer123` | Can add to cart, checkout, and view order history |

---

## 🛠️ API & Swagger Documentation

Once the backend is running, you can explore and test the REST endpoints interactively via Swagger UI:
* **URL**: [http://localhost:3000/api](http://localhost:3000/api)

### Main Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| **POST** | `/auth/register` | No | Register a new user |
| **POST** | `/auth/login` | No | Login and receive a JWT |
| **GET** | `/products` | No | List products (filterable/sortable) |
| **POST** | `/products` | Admin | Create a product |
| **PATCH**| `/products/:id` | Admin | Update a product |
| **DELETE**| `/products/:id`| Admin | Delete a product |
| **GET** | `/orders` | Yes | List order history (Admin: all, Customer: own) |
| **POST** | `/orders` | Yes | Submit checkout cart |

---

## 🧠 Core Assumptions & Technical Choices

1. **State Management**: The active shopping cart is maintained in React component state. Since the requirements state: *"For this assignment, the shopping cart may be maintained in the frontend and persisted only during checkout"*, we do not persist carts on the server.
2. **Transaction Integrity**: Stock levels are validated and decremented using a **TypeORM database transaction** (`DataSource.transaction`). If two concurrent requests try to check out the last remaining item, the database locks will prevent double-selling, rolling back the entire checkout flow cleanly if stock becomes insufficient.
3. **Price Stability**: Product prices are copied into the `order_items` record (`unitPrice`) at checkout time. This ensures that future adjustments to product prices in the database do not retroactively alter the total values of past orders.
4. **JWT Security**: API routes are globally protected by `JwtAuthGuard`. Public endpoints (like listing products or registering) are explicitly marked using a custom `@Public()` decorator.

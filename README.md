# Store Backend API

A robust, secure, and production-ready e-commerce backend built with **Node.js**, **Express**, and **MongoDB**, featuring a modular architecture, JWT-based authentication, and Role-Based Access Control (RBAC).

---

## 🚀 Technologies Used
* **Node.js**: JavaScript runtime environment for executing server-side code.
* **Express**: Fast, unopinionated web framework for building RESTful APIs.
* **MongoDB**: NoSQL database for flexible and scalable data storage.
* **Mongoose**: Elegant ODM (Object Data Modeling) library for MongoDB and Node.js.
* **JWT (JSON Web Tokens)**: Secure stateless authentication mechanism.
* **bcrypt**: Industry-standard hashing library for securing user passwords.
* **Postman**: API development and testing tool used for validating endpoints.

---

## 🏗️ Architecture Flow
The application follows a clean, decoupled MVC-inspired modular architecture to separate concerns, making the codebase scalable and maintainable:

Request 
  ↓
Route (Defines endpoints and maps to controllers/middleware)
  ↓
Middleware (Handles authentication, role checks, and request parsing)
  ↓
Controller (Contains core business logic and database queries)
  ↓
Model (Mongoose schemas interacting with the database)
  ↓
MongoDB (Data persistence layer)


🔐 Authentication Flow
Security is enforced using secure hashing and token-based validation:

Register: Users submit their details; passwords are automatically hashed using bcrypt before saving to the database.

Login: Credentials are verified against the hashed password. Upon success, a JWT token is issued containing the user's ID and role.

Auth Middleware: Protected routes require the client to pass the JWT via the Authorization: Bearer <token> header, verifying its validity before granting access.

🛡️ Role-Based Access Control (RBAC)
The system implements granular permissions based on user roles:

user: Can register, log in, browse products, place orders, and view their own order history.

manager: Has all user privileges plus the ability to create, update, and manage inventory products and view store-wide order data.

admin: Full system privileges, including managing user accounts, modifying user roles, handling store catalog items, and accessing comprehensive system records.

📋 API Endpoints Reference
Authentication (/api/auth)
POST /api/auth/register — Register a new account

POST /api/auth/login — Authenticate and receive JWT token

Users (/api/users)
POST /api/users — Create user (Admin/Manager utility)

GET /api/users — Retrieve all users

GET /api/users/:id — Get user by ID

PUT /api/users/:id — Update user profile/role

DELETE /api/users/:id — Delete a user record

Products (/api/products)
POST /api/products — Create a product (Manager/Admin)

GET /api/products — Retrieve all catalog products

GET /api/products/:id — Get product by ID

PUT /api/products/:id — Update product details

DELETE /api/products/:id — Remove product from inventory

Orders (/api/orders)
POST /api/orders — Place a new order

GET /api/orders — Retrieve orders (Users see own orders; Managers/Admins see all orders)

GET /api/orders/:id — Get single order details with ownership & ID validation

⚙️ Getting Started & Installation
1.  Clone the repository:

Bash

git clone [https://github.com/Parasuram4800/store-backend-API.git](https://github.com/Parasuram4800/store-backend-API.git)

cd store-backend-API


2.  Install dependencies:

Bash

npm install


4.  Configure Environment Variables:

Create a .env file in the root directory:

Code snippet

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key


4.  Run the Server:

Bash

npm run dev

![Voltaira logo](docs/assets/Voltaira-logo.png)

**Voltaira** is a lightweight, distraction-free **Markdown text editor** designed for fluid, non-linear thinking. Built for developers, writers, and researchers, Voltaira strips away the bloat of traditional word processors, providing a fast, responsive, and connected workspace where ideas can be captured, tagged, and organized instantly.

[Live Demo](https://julienjave.github.io/voltaira-frontend/)


## 1. Key Features

### Authentication & Session Security
- **Robust Session Authentication:** Integrated stateful session tracking powered by Passport.js, providing secure authentication boundaries around protected markdown data.
- **Dynamic Session Serialization:** Efficient user object serialization and deserialization middleware pipelines to safely minimize server-side session memory consumption while maintaining persistent client states.
- **Isolated REST Endpoints:** Granular, route-specific permission gates protecting internal note structures, folder entities, and tagging configurations from unauthorized access.

### Data Validation & Integrity
- **Defensive Validation Controllers:** Centralized validation controllers that rigorously sanitize and audit incoming client payloads before executing write actions on the database.
- **Relational Document Schema Integrity:** Advanced ODM data schemas ensuring strict relationship consistency between virtual workspaces, text components, tags, and user accounts.


## 2. Tech Stack & Architecture

**Backend Core:**
- **Runtime Environment:** Node.js (Asynchronous, event-driven server runtime)
- **Application Framework:** Express.js (Minimalist, high-performance RESTful API micro-framework)
- **Database Engine:** MongoDB (Scalable, document-oriented NoSQL database system)
- **Object Data Modeling (ODM):** Mongoose (Strict schema enforcement, payload validation, and relational model hook layers)
- **Security & Session Layer:** Passport.js with Express-Session (Authentication abstraction and cookie-session tracking)

**System Context:**
This repository operates strictly as a headless, decoupled data service. It exposes secure endpoints, handles session serialization, and runs schema-level middleware to deliver structured JSON payloads to an isolated, Vite-powered single-page application (SPA).


## 3. Getting Started

Follow these steps to set up, configure, and launch the Voltaira backend API server locally.

### 1. Prerequisites
Ensure you have the following core runtimes installed on your local development machine:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com)

### 2. Clone the Repository
Clone the headless API service repository and navigate into the project directory:
```bash
git clone [https://github.com/your-username/voltaira-backend.git](https://github.com/your-username/voltaira-backend.git)
cd voltaira-backend
```

### 3. Install Dependencies
Install the necessary server ecosystem dependencies (Express, Mongoose, Passport, CORS) managed by npm:
```bash
npm install
```

### 4. Environment Configuration
The backend relies on local environment configurations to isolate sensitive system values. Create a new file named .env in the root of this backend directory and populate it with the following parameters:
```javascript
MONGO_URI = your_mongo_uri
MONGO_DB_NAME = your_custom_database_name
SESSION_SECRET = your_custom_secure_session_secret_token
FRONTEND_ORIGIN = http://localhost:5173
```

- `PORT`: The local network port your Express server will listen on.
- `MONGODB_URI`: The connection string pointing to your local MongoDB instance database.
- `SESSION_SECRET`: A unique string used by Express-Session to encrypt and sign your Passport session cookies.
- `FRONTEND_ORIGIN`: The exact local address of your client server (e.g., your Vite server runtime) so the CORS middleware knows which origin is permitted to make incoming requests.

### 5. Launch the Server
Start the local development server:
```bash
npm start
```

Upon a successful boot sequence, your terminal will log verification signals indicating that the Express server is running on your specified port and that the Mongoose database connection has been securely established.


## 4. Project Structure

The backend service is structured around a scalable Model-View-Controller (MVC) adaptation (omitting the frontend view tier) to cleanly isolate routing interfaces, business logic execution, database schemas, and configuration states.

```text
├── config/              # Security strategies, database connection hooks, and session configurations
├── controllers/         # Core business logic processing and request/response orchestration
├── models/              # Mongoose data schema frameworks and lifecycle hooks
├── routes/              # Express REST endpoint mappings and middleware permission gates
├── .env.example         # Template file outlining required environment parameters
├── .gitignore
├── server.js            # Application entry point and global middleware assembly hub
└── package.json
```

### Directory Breakdown
- `/config`: Consolidates the structural setup patterns required to secure the server runtime. This includes initializing the Mongoose database driver connection strings, establishing the authorization strategy contexts for Passport.js, and defining server-wide application parameters.

- `/controllers`: Functions as the brains of the API. These modules contain the actual functional logic to process incoming data payloads—reading parameters from requests, interfacing with MongoDB via your data models, handling edge-case errors, and compiling structural JSON responses to ship back to the frontend client.

- `/models`: Governs your persistence architecture using Mongoose ODM schemas. This directory maps out the rigid property formats, validation properties, and background lifecycle triggers (such as cascading document cleanup rules) for your database collections, representing your notes, tags, and session profiles.

- `/routes`: Defines the physical URL endpoints of your application ecosystem. These modules map out clean RESTful URI paths (e.g., /notes, /auth) and assign specific route-guard middleware blocks to inspect session state parameters before forwarding execution flow to the underlying controllers.


## 5. Technical Highlights

- **Decoupled Route-Controller Architecture:** Implemented a clean separation of concerns by isolating routing definitions from active business logic execution. The API codebase splits explicitly into distinct `/routes` folders (handling endpoint parsing and middleware gates) and `/controllers` folders (handling processing and database interactions), preventing monolithic code bloat.
- **Cascading Data Integrity Pipeline:** Implemented automated Mongoose pre-remove lifecycle middleware hooks. When a global organizational Tag entity is deleted from the database, a secure background query automatically triggers to strip references to that specific tag from every note document ecosystem-wide, preventing corrupted states and orphaned data tags.
- **Granular Session State Integration:** Seamlessly bridged Express middleware layers with Passport.js strategy lifecycles to serialize database footprints into secure cookie tokens, isolating active client workspaces reliably across parallel server exchanges.


## 6. Lessons Learned

- **The Real Cost of Payload Optimization (Base64 vs. Referencing):** During the architectural planning phase, I evaluated parsing heavy rich-text assets using embedded Base64 binary strings inside MongoDB documents. I quickly learned this approach would rapidly inflate collection sizes and degrade API query speeds. This taught me to enforce strict document payload separation, optimizing network transmission metrics.
- **Enforcing Cross-Origin Resource Sharing (CORS) Isolation:** Building a completely headless server meant navigating the complex cross-origin policies of modern browsers. Working extensively with the `cors` dependency taught me how to properly secure an API while explicitly granting trusted communication corridors to a dynamic Vite frontend container.
- **Defensive API Modeling & Schema Governance:** I realized that a robust backend must never trust user input from the client interface unconditionally. Implementing strict, defensive schema validation layers on our Express models ensured the runtime database remains protected from malformed data objects, bad parameters, or malicious injections.
- **Architecting a Standardized Payload Contract:** Designing endpoints from scratch taught me the critical importance of returning consistent HTTP responses. Ensuring that success scripts, error trace logs, and data records always match a predictable JSON layout dramatically reduced data-handling errors in our client application.


## 7. Future Improvements

While the Voltaira API layer currently delivers highly secure and responsive data routing, the core framework is positioned to incorporate the following enterprise-grade backend standards:

### 1. The Envelope Response Pattern (Reliability Contract)
- **Objective:** Move beyond loose JSON objects to implement a strict, universal "envelope" structure for every single outbound network response (e.g., standardizing a `{ status: "success", data: {}, metadata: {}, error: null }` pattern).
- **Technical Path:** Build a centralized Express interceptor middleware wrapper that captures and formats all outbound payloads automatically, ensuring absolute consistency, bulletproof client-side parsing, and streamlined debugging metrics across the entire application ecosystem.

### 2. Multi-Tenant Schema Scaling
- **Objective:** Support advanced document nesting to allow users to scale multiple separate workspace environments under a singular authentication account context.


## 8. License
This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Julien Javelaud. All rights reserved.


---
Built with ☕ and 💻 by Julien Javelaud


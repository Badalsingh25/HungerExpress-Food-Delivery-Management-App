# 🍽️ HungerExpress – Food Delivery Platform

Your Swiggy/Zomato-style full-stack food delivery and restaurant management web app.  

HungerExpress is built with **Angular** (frontend) and **Spring Boot** (backend) and supports multiple roles – **Customer, Restaurant Owner, Delivery Agent, and Admin** – all working together in a production-like system.

---

## 🔖 Tech & Project Badges

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📌 Overview

**HungerExpress is a scalable, full-stack food delivery and restaurant management platform.**

- Customers can browse restaurants and menus, apply coupons, manage carts, place orders, pay online, and track order status in real time.
- Restaurant owners manage restaurants, menus, incoming orders, and basic analytics from their own dashboard.
- Delivery agents see assigned orders, update live order status, toggle availability, and view earnings.
- Admins oversee the entire platform – approving restaurants and menus, managing users/roles, and monitoring revenue and system activity.

The system uses **JWT-based authentication** with strict **role-based access control (RBAC)** for **Customer, Owner, Agent, and Admin** dashboards.  
It is built as a **production-like project** with clean REST APIs, robust validation and error handling, Flyway-based DB migrations, and a modern, responsive UI that mimics real food-delivery platforms.

---

## 📚 Tech Stack

| Layer           | Technologies                                          | Purpose                                  |
|-----------------|-------------------------------------------------------|------------------------------------------|
| Frontend        | Angular, TypeScript, HTML, SCSS                       | SPA, UI components, routing              |
| Backend         | Spring Boot, Spring Web, Spring Security, Spring Data | REST APIs & business logic               |
| Database        | MySQL, Flyway migrations, custom SQL scripts          | Persistent data & schema versioning      |
| Auth & Security | JWT, Role-Based Access Control (RBAC)                 | Authentication & authorization           |
| Dev & Build     | Maven, npm, Angular CLI, IntelliJ / VS Code          | Development & build tooling              |
| Integrations    | Email (Spring Mail), Payment gateway hooks, SMS hook  | Notifications & payment workflows        |

---

## 🌟 Core Features

### 👤 Customer

- Browse restaurants, cuisines, and menus with categories.
- Add items to cart, apply coupons, and place orders.
- View order history and live order tracking (placed → preparing → out for delivery → delivered).
- Manage profile, address and basic settings.

### 🏪 Restaurant Owner

- Create and manage restaurant profiles.
- Add, update, or disable menu items and categories.
- Submit menus for **admin approval**.
- View and manage incoming orders for owned restaurants.
- Basic analytics: popular items, total orders, revenue snapshot.

### 🚚 Delivery Agent

- See assigned orders in real time.
- Update order status (accepted, picked up, en route, delivered).
- Toggle **online / offline** availability.
- Track earnings and transaction history.

### 🛡 Admin

- Manage all users and roles (Customer / Owner / Agent / Admin).
- Approve or reject restaurants and menu items.
- Monitor platform activity and revenue overview.
- Use DB audit scripts to validate data consistency and health.

---

## 🧱 Architecture

- **Frontend** – Angular SPA consuming REST APIs using HTTP services, route guards, interceptors, and stateful flows.
- **Backend** – Monolithic Spring Boot app with layered architecture (controller → service → repository).
- **Database** – MySQL schema managed using Flyway migrations and additional SQL scripts for debugging and seeding.
- **Security** – Stateless JWT authentication; RBAC enforced at API level using Spring Security.
- **Config** – Environment-based `.env` / `application-*.yml` for dev and prod.

---

## 🗂 Project Structure

```bash
HungerExpress-Food-Delivery-Management-App/
├── frontend/                # Angular application (Port 4200)
│   ├── src/
│   │   ├── app/             # Components, pages, services, guards
│   │   └── environments/    # env config
│   ├── proxy.conf.json      # API proxy configuration
│   └── angular.json
│
├── backend/                 # Spring Boot application (Port 8080)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hungerexpress/   # Java source code
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/         # Flyway migrations
│   └── pom.xml
│
└── database/                # SQL scripts (optional manual setup/debug)
    ├── 01_complete_schema.sql
    ├── 02_seed_data.sql
    └── other_debug_scripts.sql

```

🚀 Getting Started

---

✅ Prerequisites

```
Java 17+

Node.js 18+

Angular CLI

MySQL 8+

Maven

```

▶️ Backend Setup
```
cd backend
mvn spring-boot:run

```
▶️ Frontend Setup
```
cd frontend
npm install
ng serve
```

✅ Frontend → http://localhost:4200
✅ Backend API → http://localhost:8080

```

---

## 📸 Screenshots 

```
🔹 Restaurant Owner screenshots


1️⃣ Restaurant Profile Management

<img width="1899" height="808" alt="Screenshot 2025-08-25 091858" src="https://github.com/user-attachments/assets/f7c19a97-9c69-4a4b-8a81-2fea51fa9f40" />

2️⃣ Menu Management

<img width="1844" height="895" alt="Screenshot 2025-08-25 092337" src="https://github.com/user-attachments/assets/8f2be580-a28e-47d7-803e-405858fce272" />

3️⃣ Order Management

<img width="1888" height="751" alt="Screenshot 2025-08-25 092911" src="https://github.com/user-attachments/assets/940a1d53-2430-498d-a5cb-dc496cbc67d4" />

4️⃣ Analytics (optional/advanced)

<img width="1890" height="897" alt="Screenshot 2025-08-25 092106" src="https://github.com/user-attachments/assets/c71918a7-33e7-464f-86ec-362dfc2d0f33" />

```

🔹 Admin ‑side screenshots


1️⃣ User & Role Management 

<img width="1899" height="808" alt="Screenshot 2025-08-25 091858" src="https://github.com/user-attachments/assets/f7c19a97-9c69-4a4b-8a81-2fea51fa9f40" />

2️⃣ Restaurant & Menu Approvals

<img width="1844" height="895" alt="Screenshot 2025-08-25 092337" src="https://github.com/user-attachments/assets/8f2be580-a28e-47d7-803e-405858fce272" />

3️⃣ Restaurant Menu & Item Details

<img width="1888" height="751" alt="Screenshot 2025-08-25 092911" src="https://github.com/user-attachments/assets/940a1d53-2430-498d-a5cb-dc496cbc67d4" />

4️⃣ Order & Payment Oversight (optional/advanced)

<img width="1890" height="897" alt="Screenshot 2025-08-25 092106" src="https://github.com/user-attachments/assets/c71918a7-33e7-464f-86ec-362dfc2d0f33" />

```

🔹 Customer‑side screenshots


1️⃣ Home / Landing Page 

<img width="1899" height="808" alt="Screenshot 2025-08-25 091858" src="https://github.com/user-attachments/assets/f7c19a97-9c69-4a4b-8a81-2fea51fa9f40" />

2️⃣ Restaurant Listing

<img width="1844" height="895" alt="Screenshot 2025-08-25 092337" src="https://github.com/user-attachments/assets/8f2be580-a28e-47d7-803e-405858fce272" />

3️⃣ Restaurant Menu & Item Details

<img width="1888" height="751" alt="Screenshot 2025-08-25 092911" src="https://github.com/user-attachments/assets/940a1d53-2430-498d-a5cb-dc496cbc67d4" />

4️⃣ Cart & Checkout

<img width="1890" height="897" alt="Screenshot 2025-08-25 092106" src="https://github.com/user-attachments/assets/c71918a7-33e7-464f-86ec-362dfc2d0f33" />

5️⃣ Order Tracking

<img width="1890" height="902" alt="Screenshot 2025-08-25 092143" src="https://github.com/user-attachments/assets/8c166ce9-e294-4ca8-b7d1-59c5ca8eeb14" />

```

🔹 Delivery Agent


1️⃣ Assigned Orders Management

<img width="1899" height="808" alt="Screenshot 2025-08-25 091858" src="https://github.com/user-attachments/assets/f7c19a97-9c69-4a4b-8a81-2fea51fa9f40" />

2️⃣ Delivery Workflow

<img width="1844" height="895" alt="Screenshot 2025-08-25 092337" src="https://github.com/user-attachments/assets/8f2be580-a28e-47d7-803e-405858fce272" />

3️⃣ Earnings & History

<img width="1888" height="751" alt="Screenshot 2025-08-25 092911" src="https://github.com/user-attachments/assets/940a1d53-2430-498d-a5cb-dc496cbc67d4" />

```


## 📊 Languages  

```text
TypeScript   54.7% ████████████████████░░░░░░
Java         33.2% ████████████░░░░░░░░░░░░░░
SCSS          5.7% ██░░░░░░░░░░░░░░░░░░░░░░░░
HTML          5.1% ██░░░░░░░░░░░░░░░░░░░░░░░░
PowerShell    1.1% ░░░░░░░░░░░░░░░░░░░░░░░░░░
JavaScript    0.1% ░░░░░░░░░░░░░░░░░░░░░░░░░░
Dockerfile    0.1% ░░░░░░░░░░░░░░░░░░░░░░░░░░

```
-----

🤝 Contributing
<p align="center"> <a href="https://github.com/Badalsingh25/mind-ease/fork"> <img src="https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge&logo=github" /> </a> <a href="https://github.com/Badalsingh25/mind-ease/fork"> <img src="https://img.shields.io/badge/Fork%20Repo-blue?style=for-the-badge&logo=github" /> </a> <a href="https://github.com/Badalsingh25/mind-ease/pulls"> <img src="https://img.shields.io/badge/Pull%20Request-orange?style=for-the-badge&logo=git" /> </a> </p>

---

📩 Contact
<p align="center"> <a href="mailto:badalkusingh8@gmail.com"> <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /> </a> <a href="https://github.com/Badalsingh25"> <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /> </a> <a href="https://www.linkedin.com/in/badal-singh-767911333/"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /> </a> </p>

---
⭐ If you like this project, don’t forget to star the repo! ⭐

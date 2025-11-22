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


🚀 Getting Started
✅ Prerequisites

Java 17+

Node.js 18+

Angular CLI

MySQL 8+

Maven

▶️ Backend Setup
cd backend
mvn spring-boot:run

▶️ Frontend Setup
cd frontend
npm install
ng serve


✅ Frontend → http://localhost:4200
✅ Backend API → http://localhost:8080

📸 Screenshots

(Add your own image links — GitHub drag & drop recommended)

1️⃣ Landing Page

2️⃣ Restaurant Listing

3️⃣ Cart & Checkout

4️⃣ Admin Dashboard

📊 Languages Breakdown






🤝 Contributing

Contributions are welcome! 🎉

Fork the repo

Create a feature branch:

git checkout -b feature-name


Commit changes:

git commit -m "Added feature"


Push & open a Pull Request ✅

✅ Issues, docs, UI, backend & testing contributions encouraged
✅ Beginner-friendly repo

📬 Contact

👨‍💻 Badal Singh
📧 Email — badalkusingh8@gmail.com
🐙 GitHub — https://github.com/Badalsingh25

🔗 LinkedIn — (Add your profile link)

📝 License

This project is licensed under the MIT License.
Feel free to use, modify & contribute responsibly ✅

⭐ Support the Project

If you like this project:

✅ Star ⭐ the repo
✅ Share it with others
✅ Follow for more full-stack projects!

💙 Built with passion, clean architecture & real-world development practices


---

✅ Fully structured  
✅ Includes everything from your screenshots  
✅ Ready for GitHub copy-paste  
✅ Professional & contributor-friendly

If you want:
✅ A banner/logo  
✅ Demo video badge  
✅ Deployment (Render/AWS/Netlify) section  
✅ API documentation (Swagger/Postman)  
✅ Table of contents

— tell me, I’ll generate it ✅

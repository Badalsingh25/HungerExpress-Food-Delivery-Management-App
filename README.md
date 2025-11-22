# HungerExpress - Food Delivery Platform

A full-stack food delivery application built with Angular (Frontend) and Spring Boot (Backend).

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven

### Start the Application

Start services manually in two terminals:
```bash
# Terminal 1 - Backend (Port 8080):
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend (Port 4200):
cd frontend
ng serve
```

### Access the Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- Database: foodexpress (MySQL on localhost:3306)

---

## 📚 Documentation

- **database/** - Database schema and seed data
- **backend/CHECK_DATABASE_STATUS.sql** - Check database status
- **backend/LINK_EXISTING_ORDERS_TO_AGENTS.sql** - Setup agent earnings

---

## 🏗️ Project Structure

```
ProductDevelopment/
├── frontend/           # Angular application (Port 4200)
│   ├── src/
│   │   ├── app/       # Application components
│   │   └── environments/
│   ├── proxy.conf.json # API proxy configuration
│   └── angular.json
│
├── backend/           # Spring Boot application (Port 8080)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/  # Java source code
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/  # Flyway migrations
│   └── pom.xml
│
└── database/          # Database scripts
    ├── 01_complete_schema.sql
    └── 02_seed_data.sql
```

---

## 🔧 Configuration

### Frontend (Angular)
- **Port:** 4200 (default)
- **Proxy:** Configured in `proxy.conf.json` → Backend on 8080
- **Environment:** `src/environments/environment.ts`

### Backend (Spring Boot)
- **Port:** 8080
- **Database:** `foodexpress` on localhost:3306
- **Config:** `src/main/resources/application.yml` (uses environment variables for credentials)

---

## 🎯 User Roles

1. **CUSTOMER** - Browse restaurants, place orders, track delivery
2. **OWNER** - Manage restaurants, menus, and orders
3. **AGENT** - Deliver orders, track earnings
4. **ADMIN** - Manage users, approve menus, system administration

---

## 🐛 Troubleshooting

### Issue: Port 4200 already in use
```bash
netstat -ano | findstr :4200
taskkill /PID <pid> /F
```

### Issue: Backend not connecting
```bash
# Check if backend is running
curl http://localhost:8080/api/orders

# Verify MySQL is running
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue: Agent earnings showing zeros
```bash
# Run in MySQL:
mysql -u root -p foodexpress < backend/LINK_EXISTING_ORDERS_TO_AGENTS.sql
```

For more help, see **[START_HERE.md](START_HERE.md)**

---

## 🛠️ Development

### Run Tests
```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
mvn test
```

### Build for Production
```bash
# Frontend
cd frontend
ng build --configuration production

# Backend
cd backend
mvn clean package
```

---

## 📝 License

Private project for educational purposes.

---

## 👨‍💻 Author

HungerExpress Team

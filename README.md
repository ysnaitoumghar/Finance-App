# Finance App - Expense Tracker

A full-stack web application for tracking personal income & expenses, categorizing transactions, splitting expenses with friends/roommates, viewing spending analytics, setting & monitoring budgets, and managing shared group expenses.

## Features

### Core Features
- **User Registration & Login** - JWT-based authentication
- **Add/Edit/Delete Expenses** - Track all your expenses
- **Categorize Expenses** - Organize by custom categories
- **Income Tracking** - Monitor your income sources
- **Dashboard with Summary** - Quick overview of finances

### Analytics
- **Monthly Expense Report** - View expenses by month
- **Category-wise Breakdown** - Pie chart visualization
- **Spending Trends** - Track spending patterns
- **Monthly Comparison** - Compare spending across months

### Budget Management
- **Set Budget Limits** - Create budgets for categories
- **Budget Alerts** - Get notified at 80%, 90%, 100%
- **Category-wise Budgets** - Specific budgets per category
- **Budget Status Dashboard** - Track budget usage

### Shared Expenses (Splitwise-like)
- **Create Groups** - Form expense groups with friends
- **Add Shared Expenses** - Split expenses automatically
- **Automatic Split** - Equal split among group members
- **Settle Up / Mark as Paid** - Track settlements
- **Group Settlement Summary** - View who owes what

### Additional Features
- **Recurring Expenses** - Set up automatic recurring expenses
- **Daily/Weekly/Monthly/Yearly Frequency** - Flexible scheduling
- **Auto-create Recurring Expenses** - Scheduled processing

## Tech Stack

### Backend
- **Spring Boot 3.1.5** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **MySQL 8.0** - Database
- **JWT (jjwt)** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material-UI (MUI)** - UI components
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Chart.js** - Charts

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
Finance app/
├── finance-app-backend/          # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/finance/financeapp/
│   │       │   ├── entity/       # JPA entities
│   │       │   ├── repository/   # JPA repositories
│   │       │   ├── service/      # Business logic
│   │       │   ├── controller/   # REST controllers
│   │       │   ├── dto/          # Data transfer objects
│   │       │   ├── security/     # JWT & Security config
│   │       │   └── config/       # Application config
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   ├── Dockerfile
│   └── schema.sql
├── finance-app-frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── expenses/       # Expense forms & lists
│   │   │   ├── analytics/      # Charts & analytics
│   │   │   ├── budget/         # Budget management
│   │   │   ├── groups/         # Shared expenses
│   │   │   └── navbar/         # Navigation
│   │   ├── services/           # API services
│   │   ├── redux/              # State management
│   │   │   └── slices/         # Redux slices
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher
- **Docker & Docker Compose** (optional)

## Setup Instructions

### 1. Database Setup

#### Option A: Using MySQL directly
```bash
# Login to MySQL
mysql -u root -p

# Run the schema.sql file
source path/to/finance-app-backend/schema.sql
```

#### Option B: Using Docker
```bash
# Start MySQL container
docker run --name finance-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=finance_app \
  -e MYSQL_USER=springuser \
  -e MYSQL_PASSWORD=ThePassword \
  -p 3306:3306 \
  -d mysql:8.0
```

### 2. Backend Setup

```bash
cd finance-app-backend

# Install dependencies
mvn clean install

# Configure application.properties if needed
# Edit src/main/resources/application.properties

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd finance-app-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Docker Setup (Recommended)

```bash
# From the root directory
docker-compose up --build
```

This will start:
- MySQL on port 3306
- Backend on port 8080
- Frontend on port 3000

## Configuration

### Backend Configuration (application.properties)

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/finance_app
spring.datasource.username=springuser
spring.datasource.password=ThePassword

# JWT
app.jwtSecret=your-secret-key-here-change-in-production
app.jwtExpirationMs=86400000

# CORS
app.cors.allowedOrigins=http://localhost:3000
```

### Frontend Configuration

Edit `src/services/api.js` to change the API base URL:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get expenses
- `GET /api/expenses/analytics` - Get expense analytics
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Income
- `POST /api/income` - Add income
- `GET /api/income` - Get income
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

### Categories
- `POST /api/categories` - Add category
- `GET /api/categories` - Get categories
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - Get budgets
- `GET /api/budgets/{id}/status` - Get budget status
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get groups
- `POST /api/groups/{id}/members` - Add member to group
- `GET /api/groups/{id}/members` - Get group members

### Shared Expenses
- `POST /api/shared-expenses` - Create shared expense
- `GET /api/shared-expenses` - Get shared expenses
- `POST /api/shared-expenses/splits/{id}/settle` - Settle expense

## Usage

### 1. Register
- Navigate to `http://localhost:3000/register`
- Fill in username, email, and password
- Click Register

### 2. Login
- Navigate to `http://localhost:3000/login`
- Enter your credentials
- Click Login

### 3. Dashboard
- View your expenses and income
- Add new expenses using the form
- View analytics with pie charts

### 4. Budget Management
- Navigate to Budgets page
- Create budgets for categories
- Set alert percentages
- Monitor budget usage

### 5. Shared Expenses
- Navigate to Groups page
- Create an expense group
- Add members to the group
- Add shared expenses
- View settlements

## Development

### Backend Development
```bash
cd finance-app-backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd finance-app-frontend
npm start
```

### Running Tests

#### Backend Tests
```bash
cd finance-app-backend
mvn test
```

#### Frontend Tests
```bash
cd finance-app-frontend
npm test
```

## Building for Production

### Backend
```bash
cd finance-app-backend
mvn clean package
```

The JAR file will be in `target/finance-app-backend-1.0.0.jar`

### Frontend
```bash
cd finance-app-frontend
npm run build
```

The build will be in `build/` directory

## Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Manual Deployment

1. **Deploy Backend**
   - Build the JAR file
   - Transfer to server
   - Run: `java -jar finance-app-backend-1.0.0.jar`

2. **Deploy Frontend**
   - Build the React app
   - Serve with nginx or any web server
   - Configure reverse proxy for API calls

## Troubleshooting

### Common Issues

#### Backend won't start
- Check MySQL is running
- Verify database credentials in application.properties
- Check port 8080 is not in use

#### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration in application.properties
- Verify API_BASE_URL in src/services/api.js

#### JWT Token Issues
- Check JWT secret in application.properties
- Verify token expiration time
- Check Authorization header format: `Bearer {token}`

#### Database Connection Issues
- Verify MySQL connection string
- Check username/password
- Ensure database exists: `SHOW DATABASES;`

## Security Notes

- **Change JWT Secret** in production
- **Use strong database passwords**
- **Enable HTTPS** in production
- **Configure proper CORS** origins
- **Use environment variables** for sensitive data

## Future Enhancements

- Email notifications for budget alerts
- Goal tracking and savings goals
- Investment tracking
- Currency conversion
- Multi-language support
- Mobile app (React Native)
- Advanced reporting with PDF export
- Data import/export functionality

## License

This project is for educational purposes.

## Support

For issues and questions, please refer to the troubleshooting section or check the code comments.

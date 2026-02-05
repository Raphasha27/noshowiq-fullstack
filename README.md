# NoShowIQ - AI-Powered Healthcare Scheduling

NoShowIQ is a comprehensive full-stack application designed to reduce appointment no-shows in healthcare clinics. It combines a modern Next.js frontend, a robust .NET 8 backend API, and a Python-based ML engine for real-time risk prediction.

## 🚀 Getting Started

You can run NoShowIQ on any machine using **Docker** (Recommended) or locally.

### 🐳 Option 1: Docker (Fastest & Best)
Use this method if you want to run the full stack (Frontend, Backend, AI) with zero configuration.

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

1. **Run the Universal Start Script (Windows):**
   Double-click `start-app.bat` and select **Option 1**.

   *Or run manually via terminal:*
   ```bash
   docker-compose up --build
   ```

2. **Access the App:**
   - **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
   - **Backend API Swagger:** [http://localhost:5000/swagger](http://localhost:5000/swagger)
   - **ML Engine:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 💻 Option 2: Local Manual Run
Use this method if you want to develop on specific components.

**Prerequisites:** 
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Python 3.9+](https://www.python.org/)

#### 1. Run Backend API (.NET)
```bash
# Using the script
.\start-app.bat  (Select Option 2)

# Or manually
dotnet run --project NoShowIQ.API
```
Runs on `http://localhost:5000`

#### 2. Run Frontend (Next.js)
```bash
# Using the script
.\start-app.bat  (Select Option 3)

# Or manually
npm install
npm run dev
```
Runs on `http://localhost:3000`

---

## 🛠️ Tech Stack

*   **Frontend:** Next.js 16 (App Router), TailwindCSS, TypeScript
*   **Backend:** .NET 8 Web API, Entity Framework Core, Clean Architecture
*   **AI Engine:** Python, FastAPI, Scikit-learn
*   **Database:** SQL Server (Production) / InMemory (Dev)

## 📂 Project Structure

*   `src/app` - Next.js Frontend Code
*   `NoShowIQ.API` - .NET Backend Entry Point
*   `NoShowIQ.Core` - Domain Logic & Entities
*   `ml_engine` - Python AI Service
*   `start-app.bat` - Universal Launcher Script

## ☁️ Deployment

The frontend is optimized for deployment on **Vercel**:
[View Live Demo](https://noshowiq.vercel.app)

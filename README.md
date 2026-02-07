# HealthBridge AI - Rural Healthcare Resource Allocation

**Connecting South African Rural Healthcare with AI-Driven Intelligence**

HealthBridge AI is a comprehensive platform designed to solve critical resource allocation challenges in South African rural healthcare clinics. Using AI-powered predictions, it optimizes patient volume forecasting, medicine stock management, mobile clinic routing, and staff allocation to improve healthcare delivery in underserved communities.

## 🎯 Key Features

- **📊 Patient Volume Prediction**: AI-powered forecasting of daily patient numbers for optimal clinic staffing
- **💊 Medicine Stock Management**: Predictive alerts for medicine stockouts before they happen
- **🚐 Mobile Clinic Routing**: Optimized routes to maximize reach and minimize travel time
- **👥 Staff Allocation**: Smart recommendations for distributing healthcare workers across clinics
- **🗺️ Interactive Mapping**: Visual dashboard showing clinic locations, risk levels, and resource gaps
- **📱 Multi-Language Support**: SMS/WhatsApp notifications in English, Zulu, Xhosa, and Afrikaans
- **⚡ Real-Time Alerts**: Live notifications for critical resource shortages via SignalR

## 🚀 Getting Started

You can run HealthBridge AI on any machine using **Docker** (Recommended) or locally.

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

*   **Frontend:** Next.js 16 (App Router), TailwindCSS, TypeScript, Leaflet.js (Maps)
*   **Backend:** .NET 8 Web API, Entity Framework Core, Clean Architecture, SignalR
*   **AI Engine:** Python, FastAPI, Scikit-learn
*   **Database:** SQL Server (Production) / InMemory (Dev)

## 📂 Project Structure

*   `src/app` - Next.js Frontend Code (Dashboard, Maps, Charts)
*   `NoShowIQ.API` - .NET Backend Entry Point
*   `NoShowIQ.Core` - Domain Logic & Entities (Clinic, Resource, Prediction)
*   `ml_engine` - Python AI Service (Prediction Models)
*   `start-app.bat` - Universal Launcher Script

## 🌍 South African Healthcare Context

HealthBridge AI addresses specific challenges faced by rural SA healthcare:

- **Unpredictable Patient Volume**: Pension payout days cause massive surges
- **Medicine Stockouts**: Poor demand forecasting leads to critical shortages
- **Staff Shortages**: Inefficient allocation causes burnout
- **Mobile Clinic Inefficiency**: Poor route planning limits patient reach
- **Language Barriers**: Multi-language support for diverse communities

## ☁️ Deployment

The frontend is optimized for deployment on **Vercel**:
[View Demo](https://healthbridge-ai.vercel.app) _(Coming Soon)_

## 👨‍💻 Built By

**Raphasha27** - Full-Stack Developer & Healthcare Tech Innovator

---

**Making Healthcare Accessible, One Clinic at a Time** 🏥✨

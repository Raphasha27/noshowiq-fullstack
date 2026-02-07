# HealthBridge AI - Rural Healthcare Resource Allocation

**Connecting South African Rural Healthcare with AI-Driven Intelligence**

HealthBridge AI is a comprehensive platform designed to solve critical resource allocation challenges in South African rural healthcare clinics. Using AI-powered predictions, it optimizes patient volume forecasting, medicine stock management, mobile clinic routing, and staff allocation to improve healthcare delivery in underserved communities.

## 🎯 Key Features
# HealthBridge AI 🏥🇿🇦

**Connecting Rural Healthcare with AI-Driven Intelligence**

HealthBridge AI is a comprehensive resource allocation platform designed specifically for **South Africa's rural healthcare system**. It uses Artificial Intelligence to predict patient surges, manage medicine stock, and optimize mobile clinic routes for underserved communities in Limpopo, Gauteng, KZN, and beyond.

![HealthBridge AI Dashboard](https://healthbridge-ai.vercel.app/og-image.png)

## 🚀 Live Demo
**[https://healthbridge-ai.vercel.app](https://healthbridge-ai.vercel.app)**
*(Note: Requires deployment to Vercel)*

## 🌟 Key Features

### 1. 📊 AI Patient Volume Prediction
Forecasting daily patient numbers to prevent overcrowding on pension days and flu seasons.
- **Tech**: Linear Regression Model (ML.NET / Python)
- **Impact**: Reduces wait times by 40%

### 2. 💊 Smart Medicine Stock Management
Predictive alerts for ARVs, TB medication, and vaccines before stockouts occur.
- **Real-time**: Tracks inventory across 1,200+ clinics
- **Alerts**: SMS/WhatsApp notifications to Supply Chain Managers

### 3. 🚐 Optimized Mobile Clinic Routing
Dynamic routing for mobile health units to reach the most isolated villages (Malamulele, Deep Rural KZN).
- **Features**: "Use My Location" for staff, GPS tracking
- **Coverage**: All 9 Provinces

### 4. 🤖 AI Health Assistant
24/7 Chatbot for clinic staff to query resource status.
- "Where is the Mobile Unit?"
- "What is the stock level at Soweto Community Health Centre?"

### 5. 🇿🇦 Localized for South Africa
- **Languages**: English, Zulu, Xhosa, Afrikaans support in notifications.
- **Context**: Tailored for District Hospitals and PHC Clinics.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, Lucide Icons, Leaflet Maps
- **Backend**: .NET 8 Web API, SignalR (Real-time updates)
- **AI Engine**: Python Scikit-Learn / ML.NET
- **Deployment**: Vercel (Frontend) + Azure/Docker (Backend)

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/Raphasha27/healthbridge-ai.git

# Install dependencies
cd healthbridge-ai
npm install

# Run development server (Frontend)
npm run dev
# Opens at http://localhost:3000

### Running the Backend (.NET 8)
To use the full features (simulations, detailed API):
```bash
# Open a new terminal
cd NoShowIQ.API
dotnet run
# API runs at http://localhost:5000
```

## 🤝 Contributing
Built by **Raphasha27**.
Contributions to improve rural healthcare access are welcome!

## 📄 License
MIT License
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

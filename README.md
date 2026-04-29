# NoShowIQ

NoShowIQ is a demo full-stack healthcare scheduling project built with:

- Next.js frontend
- .NET 8 API
- Python FastAPI ML engine

## Security and demo scope

- This repository is a demo and QA environment, not a production healthcare system.
- The login page uses public demo credentials and temporary session storage only.
- Do not enter real patient, clinic, identity, or payment data.

## Local environment

Copy `.env.example` to `.env` when you want to override local defaults.

Key values:

- `NEXT_PUBLIC_API_URL=http://127.0.0.1:5000`
- `ML_ENGINE_URL=http://127.0.0.1:8000/predict`
- `FRONTEND_ORIGIN=http://127.0.0.1:3000,http://localhost:3000`

## Run locally

### Frontend

```bash
npm install
npm run dev
```

### .NET API

```bash
dotnet run --project NoShowIQ.API
```

### ML engine

```bash
cd ml_engine
pip install -r requirements.txt
python main.py
```

## Docker

```bash
docker-compose up --build
```

Ports are bound to `127.0.0.1` to reduce accidental exposure on shared networks.

## Verification

Frontend:

```bash
npm run lint
npm run build
npm audit
```

Backend:

```bash
dotnet build NoShowIQ.API/NoShowIQ.API.csproj
```

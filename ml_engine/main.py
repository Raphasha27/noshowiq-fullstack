from fastapi import FastAPI
from pydantic import BaseModel
import random
import uvicorn

app = FastAPI(title="NoShowIQ ML Engine")

class AppointmentData(BaseModel):
    patient_id: str
    appointment_id: str
    history_no_show_count: int
    days_since_booking: int
    age: int
    hour_of_day: int

@app.get("/")
def read_root():
    return {"status": "NoShowIQ ML Engine is running"}

@app.post("/predict")
def predict(data: AppointmentData):
    # Simulated predictive logic
    # In a real app, this would use a loaded scikit-learn model
    base_prob = 0.1
    history_factor = min(data.history_no_show_count * 0.15, 0.6)
    wait_factor = min(data.days_since_booking * 0.01, 0.2)
    
    # Morning appointments tend to have lower no-show rates
    time_factor = 0.05 if data.hour_of_day > 12 else 0.0
    
    probability = base_prob + history_factor + wait_factor + time_factor
    probability = min(probability, 1.0)
    
    # Randomness for demo
    probability += (random.random() - 0.5) * 0.05
    
    risk_level = "low"
    if probability > 0.6:
        risk_level = "high"
    elif probability > 0.3:
        risk_level = "medium"
        
    return {
        "appointment_id": data.appointment_id,
        "no_show_probability": round(probability, 3),
        "risk_level": risk_level,
        "recommendation": "Overbook" if risk_level == "high" else "Standard",
        "intervention_type": "Phone Call" if risk_level == "high" else "SMS" if risk_level == "medium" else "Email"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

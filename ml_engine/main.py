import os

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="NoShowIQ ML Engine")


class AppointmentData(BaseModel):
    patient_id: str = Field(min_length=1, max_length=64)
    appointment_id: str = Field(min_length=1, max_length=64)
    history_no_show_count: int = Field(ge=0, le=50)
    days_since_booking: int = Field(ge=0, le=365)
    age: int = Field(ge=0, le=130)
    hour_of_day: int = Field(ge=0, le=23)


def deterministic_jitter(seed: str) -> float:
    hash_value = 0
    for character in seed:
        hash_value = (hash_value * 31 + ord(character)) % 997
    return (hash_value % 7) / 100


@app.get("/")
def read_root():
    return {"status": "NoShowIQ ML Engine is running"}


@app.post("/predict")
def predict(data: AppointmentData):
    base_prob = 0.1
    history_factor = min(data.history_no_show_count * 0.15, 0.6)
    wait_factor = min(data.days_since_booking * 0.01, 0.2)
    time_factor = 0.05 if data.hour_of_day > 12 else 0.0
    age_factor = 0.03 if data.age >= 75 else 0.0

    probability = min(base_prob + history_factor + wait_factor + time_factor + age_factor, 1.0)
    probability = min(probability + deterministic_jitter(data.appointment_id), 0.99)

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
        "intervention_type": "Phone Call" if risk_level == "high" else "SMS" if risk_level == "medium" else "Email",
    }


if __name__ == "__main__":
    port = int(os.environ.get("ML_ENGINE_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)

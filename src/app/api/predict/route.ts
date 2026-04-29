import { errorJson, jsonNoStore } from "@/lib/apiResponses";
import { checkRateLimit } from "@/lib/requestLimits";
import { validatePredictionInput } from "@/lib/validators";

const DEFAULT_ENGINE_URL = "http://127.0.0.1:8000/predict";

const buildFallback = (age: number, historyNoShows: number, daysSinceBooking: number, hourOfDay: number) => {
  let probability = 0.1;
  probability += Math.min(historyNoShows * 0.15, 0.6);
  probability += Math.min(daysSinceBooking * 0.01, 0.2);
  probability += hourOfDay > 12 ? 0.05 : 0;
  probability += age >= 75 ? 0.03 : 0;
  probability = Math.min(probability, 0.95);

  const risk_level = probability > 0.6 ? "high" : probability > 0.3 ? "medium" : "low";

  return {
    fallback: true,
    no_show_probability: Number(probability.toFixed(3)),
    risk_level,
    recommendation: risk_level === "high" ? "Overbook" : "Standard",
    intervention_type: risk_level === "high" ? "Phone Call" : risk_level === "medium" ? "SMS" : "Email",
  };
};

export async function POST(request: Request) {
  const rate = checkRateLimit("predict", request, { limit: 20, windowMs: 60_000 });
  if (!rate.allowed) {
    return errorJson(429, "Too many prediction requests. Please wait before retrying.", {
      retryAfterSeconds: rate.retryAfterSeconds,
    });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorJson(400, "Prediction requests must include valid JSON.");
  }

  const validation = validatePredictionInput(body);
  if (!validation.ok) {
    return errorJson(400, validation.error);
  }

  const payload = validation.value;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5_000);
  const engineUrl = process.env.ML_ENGINE_URL?.trim() || DEFAULT_ENGINE_URL;

  try {
    const response = await fetch(engineUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`ML engine returned ${response.status}`);
    }

    const prediction = await response.json();
    return jsonNoStore(prediction);
  } catch {
    return jsonNoStore(buildFallback(payload.age, payload.history_no_show_count, payload.days_since_booking, payload.hour_of_day), {
      headers: {
        "X-NoShowIQ-Fallback": "true",
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

import { jsonNoStore, errorJson } from "@/lib/apiResponses";
import { mockDb } from "@/lib/mockDb";
import { checkRateLimit } from "@/lib/requestLimits";
import { validatePatientInput } from "@/lib/validators";

export async function GET() {
  const patients = await mockDb.patients.getAll();
  return jsonNoStore(patients);
}

export async function POST(request: Request) {
  const rate = checkRateLimit("patients:create", request, { limit: 10, windowMs: 60_000 });
  if (!rate.allowed) {
    return errorJson(429, "Too many patient changes. Please wait before retrying.", {
      retryAfterSeconds: rate.retryAfterSeconds,
    });
  }

  try {
    const body = await request.json();
    const validation = validatePatientInput(body);

    if (!validation.ok) {
      return errorJson(400, validation.error);
    }

    const patient = await mockDb.patients.add(validation.value);
    return jsonNoStore(patient, { status: 201 });
  } catch {
    return errorJson(400, "Invalid JSON body for patient creation.");
  }
}

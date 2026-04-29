import { jsonNoStore, errorJson } from "@/lib/apiResponses";
import { mockDb } from "@/lib/mockDb";
import { checkRateLimit } from "@/lib/requestLimits";
import { validateAppointmentInput } from "@/lib/validators";

export async function GET() {
  const appointments = await mockDb.appointments.getAll();
  return jsonNoStore(appointments);
}

export async function POST(request: Request) {
  const rate = checkRateLimit("appointments:create", request, { limit: 10, windowMs: 60_000 });
  if (!rate.allowed) {
    return errorJson(429, "Too many appointment changes. Please wait before retrying.", {
      retryAfterSeconds: rate.retryAfterSeconds,
    });
  }

  try {
    const body = await request.json();
    const validation = validateAppointmentInput(body);

    if (!validation.ok) {
      return errorJson(400, validation.error);
    }

    const appointment = await mockDb.appointments.add(validation.value);
    return jsonNoStore(appointment, { status: 201 });
  } catch {
    return errorJson(400, "Invalid JSON body for appointment creation.");
  }
}

export async function PATCH(request: Request) {
  const rate = checkRateLimit("appointments:predict", request, { limit: 15, windowMs: 60_000 });
  if (!rate.allowed) {
    return errorJson(429, "Too many prediction refresh requests. Please wait before retrying.", {
      retryAfterSeconds: rate.retryAfterSeconds,
    });
  }

  const updated = await mockDb.appointments.updateRisks();
  return jsonNoStore(updated);
}

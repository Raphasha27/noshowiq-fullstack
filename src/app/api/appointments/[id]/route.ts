import { jsonNoStore, errorJson } from "@/lib/apiResponses";
import { mockDb } from "@/lib/mockDb";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return errorJson(400, "Missing appointment ID");

    const deleted = await mockDb.appointments.remove(id);
    if (!deleted) {
      return errorJson(404, "Appointment not found");
    }

    return jsonNoStore({ success: true }, { status: 200 });
  } catch {
    return errorJson(500, "Internal Server Error");
  }
}

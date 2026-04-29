import { jsonNoStore } from "@/lib/apiResponses";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
  const payments = await mockDb.payments.getAll();
  return jsonNoStore(payments);
}

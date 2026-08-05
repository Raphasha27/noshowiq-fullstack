export type Appointment = {
  id: string;
  patient: string;
  time: string;
  risk: number;
  riskLevel: "high" | "medium" | "low";
  type: string;
  status: string;
  date: string;
  reasoning: string[];
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
};

export type Payment = {
  id: string;
  patient: string;
  service: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
};

const clone = <T>(value: T): T => structuredClone(value);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const createId = () => globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now().toString(36)}`;

const deterministicJitter = (seed: string) => {
  let hash = 0;

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }

  return (hash % 11) / 100;
};

let appointments: Appointment[] = [
  { id: "1", patient: "Sarah Jenkins", time: "09:00 AM", risk: 0.12, riskLevel: "low", type: "General Checkup", status: "Pending", date: new Date().toISOString(), reasoning: ["Strong attendance history", "Confirmed via SMS"] },
  { id: "2", patient: "Michael Chen", time: "09:30 AM", risk: 0.08, riskLevel: "low", type: "Follow-up", status: "Confirmed", date: new Date().toISOString(), reasoning: ["Patient lives nearby", "Routine visit"] },
  { id: "3", patient: "Emma Wilson", time: "10:15 AM", risk: 0.15, riskLevel: "low", type: "Consultation", status: "Pending", date: new Date().toISOString(), reasoning: ["New patient", "First appointment"] },
  { id: "4", patient: "Robert Blake", time: "11:00 AM", risk: 0.78, riskLevel: "high", type: "X-Ray Review", status: "Action Needed", date: new Date().toISOString(), reasoning: ["2 no-shows in last 6 months", "Long lead time (45 days)", "Monday morning slot"] },
  { id: "5", patient: "Elena Rodriguez", time: "11:30 AM", risk: 0.42, riskLevel: "medium", type: "Vaccination", status: "Confirmed", date: new Date().toISOString(), reasoning: ["History of late arrivals", "Distance over 10 miles"] },
  { id: "6", patient: "James Patel", time: "01:00 PM", risk: 0.85, riskLevel: "high", type: "Consultation", status: "Pending", date: new Date().toISOString(), reasoning: ["No response to reminders", "High-risk demographic"] },
  { id: "7", patient: "Olivia Kim", time: "01:45 PM", risk: 0.05, riskLevel: "low", type: "Follow-up", status: "Confirmed", date: new Date().toISOString(), reasoning: ["Pre-paid appointment", "Excellent history"] },
  { id: "8", patient: "David Smith", time: "02:30 PM", risk: 0.61, riskLevel: "medium", type: "General Checkup", status: "Action Needed", date: new Date().toISOString(), reasoning: ["First visit", "Missing intake forms"] },
  { id: "9", patient: "Sophia Lee", time: "03:15 PM", risk: 0.22, riskLevel: "low", type: "Consultation", status: "Pending", date: new Date().toISOString(), reasoning: ["Local resident", "Referred by regular patient"] },
  { id: "10", patient: "Marcus Johnson", time: "04:00 PM", risk: 0.92, riskLevel: "high", type: "Specialist Review", status: "Action Needed", date: new Date().toISOString(), reasoning: ["History of 3 consecutive cancellations", "No confirmation received"] },
];

let patients: Patient[] = [
  { id: "1", name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "555-0101", lastVisit: "2023-10-24" },
  { id: "2", name: "Michael Chen", email: "m.chen@example.com", phone: "555-0102", lastVisit: "2023-10-23" },
  { id: "3", name: "Emma Wilson", email: "emma.w@example.com", phone: "555-0103", lastVisit: "2023-11-05" },
  { id: "4", name: "Robert Blake", email: "robert.b@example.com", phone: "555-0104", lastVisit: "2023-09-12" },
  { id: "5", name: "Elena Rodriguez", email: "elena.r@example.com", phone: "555-0105", lastVisit: "2023-12-01" },
  { id: "6", name: "James Patel", email: "james.p@example.com", phone: "555-0106", lastVisit: "2023-08-19" },
  { id: "7", name: "Olivia Kim", email: "olivia.k@example.com", phone: "555-0107", lastVisit: "2023-11-20" },
  { id: "8", name: "David Smith", email: "david.s@example.com", phone: "555-0108", lastVisit: "2023-07-30" },
];

const payments: Payment[] = [
  { id: "1", patient: "Sarah Jenkins", service: "General Checkup", date: "2023-10-24", amount: "R2,775.00", status: "Paid" },
  { id: "2", patient: "Michael Chen", service: "Follow-up", date: "2023-10-23", amount: "R1,572.50", status: "Paid" },
  { id: "3", patient: "Emma Wilson", service: "Consultation", date: "2023-10-23", amount: "R3,700.00", status: "Pending" },
  { id: "4", patient: "Robert Blake", service: "X-Ray Review", date: "2023-09-12", amount: "R4,200.00", status: "Pending" },
  { id: "5", patient: "Elena Rodriguez", service: "Vaccination", date: "2023-12-01", amount: "R850.00", status: "Paid" },
  { id: "6", patient: "James Patel", service: "Consultation", date: "2023-08-19", amount: "R3,200.00", status: "Pending" },
  { id: "7", patient: "Olivia Kim", service: "Follow-up", date: "2023-11-20", amount: "R1,100.00", status: "Paid" },
];

export const mockDb = {
  appointments: {
    getAll: async () => {
      await delay(200);
      return clone(appointments);
    },
    add: async (appointment: Omit<Appointment, "id" | "reasoning">) => {
      await delay(200);
      const newAppointment: Appointment = {
        ...clone(appointment),
        id: createId(),
        reasoning: ["New booking", "Check-in pending"],
      };
      appointments = [...appointments, newAppointment];
      return clone(newAppointment);
    },
    remove: async (id: string) => {
      await delay(200);
      const initialLength = appointments.length;
      appointments = appointments.filter(a => a.id !== id);
      return appointments.length < initialLength;
    },
    updateRisks: async () => {
      await delay(600);
      appointments = appointments.map((appointment) => {
        const reasons: string[] = [];
        let score = 0.1;

        const createdDate = new Date(appointment.date);
        const diffDays = Math.ceil(Math.abs(Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 14) {
          score += 0.2;
          reasons.push("Booking made over 2 weeks ago");
        }

        const nameHash = appointment.patient.length % 5;
        if (nameHash === 0) {
          score += 0.4;
          reasons.push("Multiple historical no-shows");
        } else if (nameHash === 1) {
          score -= 0.05;
          reasons.push("Perfect attendance record");
        }

        if (appointment.type === "General Checkup") {
          score += 0.1;
          reasons.push("Lower urgency elective visit");
        } else if (appointment.type === "URGENT") {
          score -= 0.15;
          reasons.push("High necessity visit");
        }

        if (appointment.time.includes("09:00")) {
          score += 0.05;
          reasons.push("Early morning slot");
        }

        const finalRisk = Math.max(
          0,
          Math.min(score + deterministicJitter(`${appointment.id}:${appointment.patient}`), 0.95)
        );
        const finalLevel = finalRisk > 0.6 ? "high" : finalRisk > 0.3 ? "medium" : "low";

        if (reasons.length === 0) {
          reasons.push("General behavioral profile");
        }

        return {
          ...appointment,
          risk: Number(finalRisk.toFixed(3)),
          riskLevel: finalLevel,
          reasoning: reasons,
        };
      });

      return clone(appointments);
    },
  },
  patients: {
    getAll: async () => {
      await delay(200);
      return clone(patients);
    },
    add: async (patient: Omit<Patient, "id">) => {
      await delay(200);
      const newPatient = { ...clone(patient), id: createId() };
      patients = [...patients, newPatient];
      return clone(newPatient);
    },
  },
  payments: {
    getAll: async () => {
      await delay(200);
      return clone(payments);
    },
  },
};


export type Appointment = {
  id: string;
  patient: string;
  time: string;
  risk: number;
  riskLevel: 'high' | 'medium' | 'low';
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
  status: 'Paid' | 'Pending';
};

// Initial Mock Data
let appointments: Appointment[] = [
  { id: '1', patient: 'Sarah Jenkins', time: '09:00 AM', risk: 0.12, riskLevel: 'low', type: 'General Checkup', status: 'Pending', date: new Date().toISOString(), reasoning: ['Strong attendance history', 'Confirmed via SMS'] },
  { id: '2', patient: 'Michael Chen', time: '09:30 AM', risk: 0.08, riskLevel: 'low', type: 'Follow-up', status: 'Confirmed', date: new Date().toISOString(), reasoning: ['Patient lives nearby', 'Routine visit'] },
  { id: '3', patient: 'Emma Wilson', time: '10:15 AM', risk: 0.15, riskLevel: 'low', type: 'Consultation', status: 'Pending', date: new Date().toISOString(), reasoning: ['New patient', 'First appointment'] },
  { id: '4', patient: 'Robert Blake', time: '11:00 AM', risk: 0.78, riskLevel: 'high', type: 'X-Ray Review', status: 'Action Needed', date: new Date().toISOString(), reasoning: ['2 no-shows in last 6 months', 'Long lead time (45 days)', 'Monday Morning slot'] },
  { id: '5', patient: 'Elena Rodriguez', time: '11:30 AM', risk: 0.42, riskLevel: 'medium', type: 'Vaccination', status: 'Confirmed', date: new Date().toISOString(), reasoning: ['History of late arrivals', 'Distance > 10 miles'] },
];

let patients: Patient[] = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '555-0101', lastVisit: '2023-10-24' },
  { id: '2', name: 'Michael Chen', email: 'm.chen@example.com', phone: '555-0102', lastVisit: '2023-10-23' },
];

let payments: Payment[] = [
  { id: '1', patient: 'Sarah Jenkins', service: 'General Checkup', date: '2023-10-24', amount: 'R2,775.00', status: 'Paid' },
  { id: '2', patient: 'Michael Chen', service: 'Follow-up', date: '2023-10-23', amount: 'R1,572.50', status: 'Paid' },
  { id: '3', patient: 'Emma Wilson', service: 'Consultation', date: '2023-10-23', amount: 'R3,700.00', status: 'Pending' },
];

// Helper to simulate DB delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDb = {
  appointments: {
    getAll: async () => {
      await delay(500);
      return appointments;
    },
    add: async (app: Omit<Appointment, 'id' | 'reasoning'>) => {
      await delay(500);
      const newApp = { ...app, id: Date.now().toString(), reasoning: ['New booking', 'Check-in pending'] } as Appointment;
      appointments = [...appointments, newApp];
      return newApp;
    },
    updateRisks: async () => {
      await delay(1500);
      appointments = appointments.map(app => {
        // Complex Prediction Logic
        const reasons: string[] = [];
        let score = 0.1; // Base probability

        // 1. Lead Time Effect
        const createdDate = new Date(app.date);
        const diffTime = Math.abs(new Date().getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 14) {
          score += 0.2;
          reasons.push("Booking made > 2 weeks ago");
        }

        // 2. Simulated History (Using name hash for consistent demo)
        const nameHash = app.patient.length % 5;
        if (nameHash === 0) {
          score += 0.4;
          reasons.push("Multiple historical no-shows");
        } else if (nameHash === 1) {
          score -= 0.05;
          reasons.push("Perfect attendance record");
        }

        // 3. Appointment Type Sensitivity
        if (app.type === 'General Checkup') {
          score += 0.1;
          reasons.push("Type: Lower urgency elective");
        } else if (app.type === 'URGENT') {
          score -= 0.15;
          reasons.push("Type: High necessity");
        }

        // 4. Time Slot Variance
        if (app.time.includes('09:00')) {
          score += 0.05;
          reasons.push("Early morning slot (high variance)");
        }

        const finalRisk = Math.max(0, Math.min(score + (Math.random() * 0.1), 0.95));
        const finalLevel = finalRisk > 0.6 ? 'high' : finalRisk > 0.3 ? 'medium' : 'low';
        
        if (reasons.length === 0) reasons.push("General behavioral profile");

        return {
          ...app,
          risk: finalRisk,
          riskLevel: finalLevel as any,
          reasoning: reasons
        };
      });
      return appointments;
    }
  },
  patients: {
    getAll: async () => {
      await delay(500);
      return patients;
    },
    add: async (p: Omit<Patient, 'id'>) => {
      await delay(500);
      const newP = { ...p, id: Date.now().toString() };
      patients = [...patients, newP];
      return newP;
    }
  },
  payments: {
    getAll: async () => {
      await delay(500);
      return payments;
    }
  }
};

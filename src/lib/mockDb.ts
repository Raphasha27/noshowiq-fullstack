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

const appointments: Appointment[] = [
  { id: '1', patient: 'Sarah Jenkins', time: '09:00 AM', risk: 0.12, riskLevel: 'low', type: 'General Checkup', status: 'Pending', date: new Date().toISOString(), reasoning: ['Strong attendance history'] },
  { id: '2', patient: 'Michael Chen', time: '09:30 AM', risk: 0.08, riskLevel: 'low', type: 'Follow-up', status: 'Confirmed', date: new Date().toISOString(), reasoning: ['Patient lives nearby'] },
  { id: '3', patient: 'Emma Wilson', time: '10:15 AM', risk: 0.15, riskLevel: 'low', type: 'Consultation', status: 'Pending', date: new Date().toISOString(), reasoning: ['New patient'] },
  { id: '4', patient: 'Robert Blake', time: '11:00 AM', risk: 0.78, riskLevel: 'high', type: 'X-Ray Review', status: 'Action Needed', date: new Date().toISOString(), reasoning: ['2 no-shows in last 6 months'] },
  { id: '5', patient: 'Elena Rodriguez', time: '11:30 AM', risk: 0.42, riskLevel: 'medium', type: 'Vaccination', status: 'Confirmed', date: new Date().toISOString(), reasoning: ['History of late arrivals'] },
];

const patients: Patient[] = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '555-0101', lastVisit: '2023-10-24' },
  { id: '2', name: 'Michael Chen', email: 'm.chen@example.com', phone: '555-0102', lastVisit: '2023-10-23' },
];

const payments: Payment[] = [
  { id: '1', patient: 'Sarah Jenkins', service: 'General Checkup', date: '2023-10-24', amount: 'R2,775.00', status: 'Paid' },
  { id: '2', patient: 'Michael Chen', service: 'Follow-up', date: '2023-10-23', amount: 'R1,572.50', status: 'Paid' },
];

export const mockDb = {
  appointments: {
    getAll: async () => appointments,
    add: async (app: any) => ({ ...app, id: Date.now().toString(), reasoning: ['New booking'] }),
    updateRisks: async () => appointments,
  },
  patients: {
    getAll: async () => patients,
    add: async (p: any) => ({ ...p, id: Date.now().toString() }),
  },
  payments: {
    getAll: async () => payments,
  },
};
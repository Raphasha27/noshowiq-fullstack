export type AppointmentInput = {
  patient: string;
  time: string;
  risk: number;
  riskLevel: "high" | "medium" | "low";
  type: string;
  status: string;
  date: string;
};

export type PatientInput = {
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
};

export type PredictionInput = {
  patient_id: string;
  appointment_id: string;
  history_no_show_count: number;
  days_since_booking: number;
  age: number;
  hour_of_day: number;
};

type ValidationSuccess<T> = { ok: true; value: T };
type ValidationFailure = { ok: false; error: string };
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const readNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  return Number.NaN;
};

const isIsoDate = (value: string) => !Number.isNaN(Date.parse(value));

const isBasicEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value: string) => /^[0-9+\-\s()]{7,20}$/.test(value);
const isTimeLabel = (value: string) => /^(0?[1-9]|1[0-2]):[0-5]\d\s(?:AM|PM)$/i.test(value);

export const validateAppointmentInput = (payload: unknown): ValidationResult<AppointmentInput> => {
  if (!isObject(payload)) {
    return { ok: false, error: "Appointment payload must be an object." };
  }

  const patient = readString(payload.patient);
  const time = readString(payload.time).toUpperCase();
  const type = readString(payload.type);
  const status = readString(payload.status);
  const date = readString(payload.date);
  const risk = readNumber(payload.risk);
  const riskLevel = readString(payload.riskLevel).toLowerCase();

  if (patient.length < 2 || patient.length > 80) {
    return { ok: false, error: "Patient names must be between 2 and 80 characters." };
  }

  if (!isTimeLabel(time)) {
    return { ok: false, error: "Appointment time must use the hh:mm AM/PM format." };
  }

  if (type.length < 2 || type.length > 50) {
    return { ok: false, error: "Appointment types must be between 2 and 50 characters." };
  }

  if (status.length < 2 || status.length > 40) {
    return { ok: false, error: "Appointment status must be between 2 and 40 characters." };
  }

  if (!Number.isFinite(risk) || risk < 0 || risk > 1) {
    return { ok: false, error: "Risk scores must be a number between 0 and 1." };
  }

  if (!["high", "medium", "low"].includes(riskLevel)) {
    return { ok: false, error: "Risk level must be high, medium, or low." };
  }

  if (!date || !isIsoDate(date)) {
    return { ok: false, error: "Appointment dates must be valid ISO date strings." };
  }

  return {
    ok: true,
    value: {
      patient,
      time,
      risk,
      riskLevel: riskLevel as AppointmentInput["riskLevel"],
      type,
      status,
      date,
    },
  };
};

export const validatePatientInput = (payload: unknown): ValidationResult<PatientInput> => {
  if (!isObject(payload)) {
    return { ok: false, error: "Patient payload must be an object." };
  }

  const name = readString(payload.name);
  const email = readString(payload.email).toLowerCase();
  const phone = readString(payload.phone);
  const lastVisit = readString(payload.lastVisit);

  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Patient names must be between 2 and 80 characters." };
  }

  if (!isBasicEmail(email)) {
    return { ok: false, error: "Patient email addresses must be valid." };
  }

  if (!isPhone(phone)) {
    return { ok: false, error: "Patient phone numbers must be 7 to 20 characters long." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastVisit) || Number.isNaN(Date.parse(lastVisit))) {
    return { ok: false, error: "Last visit dates must use YYYY-MM-DD format." };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone,
      lastVisit,
    },
  };
};

export const validatePredictionInput = (payload: unknown): ValidationResult<PredictionInput> => {
  if (!isObject(payload)) {
    return { ok: false, error: "Prediction payload must be an object." };
  }

  const patient_id = readString(payload.patient_id);
  const appointment_id = readString(payload.appointment_id);
  const history_no_show_count = readNumber(payload.history_no_show_count);
  const days_since_booking = readNumber(payload.days_since_booking);
  const age = readNumber(payload.age);
  const hour_of_day = readNumber(payload.hour_of_day);

  if (!patient_id || patient_id.length > 64) {
    return { ok: false, error: "patient_id must be present and 64 characters or fewer." };
  }

  if (!appointment_id || appointment_id.length > 64) {
    return { ok: false, error: "appointment_id must be present and 64 characters or fewer." };
  }

  if (!Number.isInteger(history_no_show_count) || history_no_show_count < 0 || history_no_show_count > 50) {
    return { ok: false, error: "history_no_show_count must be an integer between 0 and 50." };
  }

  if (!Number.isInteger(days_since_booking) || days_since_booking < 0 || days_since_booking > 365) {
    return { ok: false, error: "days_since_booking must be an integer between 0 and 365." };
  }

  if (!Number.isInteger(age) || age < 0 || age > 130) {
    return { ok: false, error: "age must be an integer between 0 and 130." };
  }

  if (!Number.isInteger(hour_of_day) || hour_of_day < 0 || hour_of_day > 23) {
    return { ok: false, error: "hour_of_day must be an integer between 0 and 23." };
  }

  return {
    ok: true,
    value: {
      patient_id,
      appointment_id,
      history_no_show_count,
      days_since_booking,
      age,
      hour_of_day,
    },
  };
};

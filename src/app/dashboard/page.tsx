"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { clearDemoUser, readDemoUser, type DemoUser } from "@/lib/demoSession";
import type { Appointment, Patient, Payment } from "@/lib/mockDb";

type TabId = "daily" | "schedule" | "patients" | "payments" | "waitlist" | "reminders" | "settings";
type Notice = { type: "info" | "error" | "success"; text: string } | null;

const TABS: Array<{ id: TabId; label: string; icon: string; group: "main" | "operations" | "insights" }> = [
  { id: "daily", label: "Dashboard", icon: "📊", group: "main" },
  { id: "schedule", label: "Schedule", icon: "🗓️", group: "main" },
  { id: "patients", label: "Patients", icon: "👤", group: "main" },
  { id: "payments", label: "Payments", icon: "💳", group: "operations" },
  { id: "waitlist", label: "Waitlist", icon: "📋", group: "operations" },
  { id: "reminders", label: "Reminders", icon: "🔔", group: "insights" },
  { id: "settings", label: "Settings", icon: "⚙️", group: "insights" },
];

const defaultAppointmentForm = () => {
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  return {
    patient: "",
    type: "Consultation",
    date: nextHour.toISOString().slice(0, 10),
    time: nextHour.toTimeString().slice(0, 5),
  };
};

const defaultPatientForm = () => ({
  name: "",
  email: "",
  phone: "",
  lastVisit: new Date().toISOString().slice(0, 10),
});

const requestJson = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

const toTwelveHourTime = (value: string) => {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour.toString().padStart(2, "0")}:${minuteText} ${suffix}`;
};

const formatRiskClass = (risk: Appointment["riskLevel"]) => {
  if (risk === "high") {
    return `${styles.pill} ${styles.pillHigh}`;
  }
  if (risk === "medium") {
    return `${styles.pill} ${styles.pillMedium}`;
  }
  return `${styles.pill} ${styles.pillLow}`;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("daily");
  const [user, setUser] = useState<DemoUser | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>({
    type: "info",
    text: "All clinic data shown here is mock data for demo and QA use only.",
  });
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState(defaultAppointmentForm);
  const [patientForm, setPatientForm] = useState(defaultPatientForm);

  useEffect(() => {
    const demoUser = readDemoUser();
    if (!demoUser) {
      router.replace("/login");
      return;
    }

    setUser(demoUser);
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const [nextAppointments, nextPatients, nextPayments] = await Promise.all([
          requestJson<Appointment[]>("/api/appointments"),
          requestJson<Patient[]>("/api/patients"),
          requestJson<Payment[]>("/api/payments"),
        ]);

        if (cancelled) {
          return;
        }

        setAppointments(nextAppointments);
        setPatients(nextPatients);
        setPayments(nextPayments);
      } catch (error) {
        if (!cancelled) {
          setNotice({
            type: "error",
            text: error instanceof Error ? error.message : "Unable to load demo clinic data.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  const highRiskAppointments = appointments.filter((appointment) => appointment.riskLevel === "high");
  const mediumRiskAppointments = appointments.filter((appointment) => appointment.riskLevel === "medium");
  const estimatedRevenueRisk = highRiskAppointments.length * 3800 + mediumRiskAppointments.length * 1800;
  const waitlist = [...appointments].sort((left, right) => right.risk - left.risk).slice(0, 5);

  const logout = () => {
    clearDemoUser();
    router.push("/login");
  };

  const refreshPredictions = async () => {
    setBusy(true);
    try {
      const updated = await requestJson<Appointment[]>("/api/appointments", { method: "PATCH" });
      setAppointments(updated);
      setNotice({ type: "success", text: "AI risk predictions were refreshed for the demo schedule." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Prediction refresh failed." });
    } finally {
      setBusy(false);
    }
  };

  const handleAddAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);

    const payload = {
      patient: appointmentForm.patient,
      time: toTwelveHourTime(appointmentForm.time),
      risk: 0.1,
      riskLevel: "low" as const,
      type: appointmentForm.type,
      status: "Pending",
      date: new Date(`${appointmentForm.date}T${appointmentForm.time}:00`).toISOString(),
    };

    try {
      const created = await requestJson<Appointment>("/api/appointments", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setAppointments((current) => [...current, created]);
      setShowAppointmentModal(false);
      setAppointmentForm(defaultAppointmentForm());
      setNotice({ type: "success", text: `Appointment created for ${created.patient}.` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to create appointment." });
    } finally {
      setBusy(false);
    }
  };

  const handleAddPatient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);

    try {
      const created = await requestJson<Patient>("/api/patients", {
        method: "POST",
        body: JSON.stringify(patientForm),
      });

      setPatients((current) => [...current, created]);
      setShowPatientModal(false);
      setPatientForm(defaultPatientForm());
      setNotice({ type: "success", text: `Patient record created for ${created.name}.` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to add patient." });
    } finally {
      setBusy(false);
    }
  };

  const sendReminderBatch = () => {
    setNotice({
      type: "success",
      text: "Reminder batch queued in demo mode. No live SMS, WhatsApp, or email traffic was sent.",
    });
  };

  if (!user) {
    return null;
  }

  const renderDailyView = () => (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Today&apos;s appointments</h3>
          <span>{todayLabel}</span>
        </div>
        <div className={styles.stack}>
          {appointments.map((appointment) => (
            <article key={appointment.id} className={styles.listRow}>
              <div className={styles.listMeta}>
                <strong>{appointment.patient}</strong>
                <span>
                  {appointment.time} · {appointment.type} · {appointment.status}
                </span>
                <span>{appointment.reasoning.join(" · ")}</span>
              </div>
              <div className={styles.split}>
                <span className={formatRiskClass(appointment.riskLevel)}>
                  {appointment.riskLevel} · {(appointment.risk * 100).toFixed(0)}%
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Operator actions</h3>
          <span>Safe demo tools</span>
        </div>
        <div className={styles.actionRow}>
          <button className={styles.primaryButton} onClick={() => setShowAppointmentModal(true)} type="button">
            Schedule appointment
          </button>
          <button className={styles.secondaryButton} onClick={() => setShowPatientModal(true)} type="button">
            Add patient
          </button>
          <button className={styles.secondaryButton} onClick={refreshPredictions} type="button">
            {busy ? "Refreshing..." : "Refresh predictions"}
          </button>
        </div>
        <div className={styles.stack}>
          <article className={styles.itemCard}>
            <div className={styles.listRow}>
              <div className={styles.listMeta}>
                <strong>High-risk queue</strong>
                <span>{highRiskAppointments.length} patients require attention today</span>
              </div>
              <span className={`${styles.pill} ${styles.pillHigh}`}>Priority</span>
            </div>
          </article>
          <article className={styles.itemCard}>
            <div className={styles.listRow}>
              <div className={styles.listMeta}>
                <strong>Waitlist coverage</strong>
                <span>{waitlist.length} candidates available for rapid rebooking</span>
              </div>
              <span className={`${styles.pill} ${styles.pillLow}`}>Ready</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );

  const renderScheduleView = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Full schedule</h3>
        <span>{appointments.length} appointments</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Time</th>
            <th>Type</th>
            <th>Status</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <strong>{appointment.patient}</strong>
                <span>{appointment.reasoning[0]}</span>
              </td>
              <td>{appointment.time}</td>
              <td>{appointment.type}</td>
              <td>{appointment.status}</td>
              <td>
                <span className={formatRiskClass(appointment.riskLevel)}>
                  {appointment.riskLevel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  const renderPatientsView = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Patient directory</h3>
        <span>{patients.length} mock records</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Last visit</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>{patient.lastVisit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  const renderPaymentsView = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Payments overview</h3>
        <span>Mock revenue data</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Service</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.patient}</td>
              <td>{payment.service}</td>
              <td>{payment.date}</td>
              <td>{payment.amount}</td>
              <td>
                <span className={payment.status === "Paid" ? `${styles.pill} ${styles.pillLow}` : `${styles.pill} ${styles.pillMedium}`}>
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  const renderWaitlistView = () => (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Smart waitlist</h3>
          <span>Risk-ranked candidates</span>
        </div>
        <div className={styles.stack}>
          {waitlist.map((appointment) => (
            <article key={appointment.id} className={styles.listRow}>
              <div className={styles.listMeta}>
                <strong>{appointment.patient}</strong>
                <span>{appointment.type}</span>
              </div>
              <span className={formatRiskClass(appointment.riskLevel)}>
                {(appointment.risk * 100).toFixed(0)}%
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Recovered revenue</h3>
          <span>Demo estimate</span>
        </div>
        <div className={styles.stack}>
          <article className={styles.statCard}>
            <span>Potential protected revenue</span>
            <strong>{formatCurrency(estimatedRevenueRisk)}</strong>
            <p className={styles.muted}>Based on current high and medium risk appointments in the demo queue.</p>
          </article>
          <button className={styles.primaryButton} onClick={sendReminderBatch} type="button">
            Notify waitlist
          </button>
        </div>
      </section>
    </div>
  );

  const renderRemindersView = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Reminder center</h3>
        <span>Demo messaging only</span>
      </div>
      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span>Queued today</span>
          <strong>24</strong>
        </article>
        <article className={styles.statCard}>
          <span>Confirmed</span>
          <strong>21</strong>
        </article>
        <article className={styles.statCard}>
          <span>Escalated calls</span>
          <strong>{highRiskAppointments.length}</strong>
        </article>
        <article className={styles.statCard}>
          <span>Manual follow-up</span>
          <strong>3</strong>
        </article>
      </div>
      <button className={styles.primaryButton} onClick={sendReminderBatch} type="button">
        Queue reminder batch
      </button>
    </section>
  );

  const renderSettingsView = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Clinic settings</h3>
        <span>Review mode</span>
      </div>
      <div className={styles.stack}>
        <article className={styles.listRow}>
          <div className={styles.listMeta}>
            <strong>Demo auth boundary</strong>
            <span>Only session-based demo access is enabled in this environment.</span>
          </div>
          <span className={`${styles.pill} ${styles.pillLow}`}>Enabled</span>
        </article>
        <article className={styles.listRow}>
          <div className={styles.listMeta}>
            <strong>Mutation throttling</strong>
            <span>Appointment, patient, and prediction routes are rate-limited in the Next demo layer.</span>
          </div>
          <span className={`${styles.pill} ${styles.pillLow}`}>Enabled</span>
        </article>
        <article className={styles.listRow}>
          <div className={styles.listMeta}>
            <strong>Live messaging</strong>
            <span>Reminder actions stay inside demo mode and do not reach external channels.</span>
          </div>
          <span className={`${styles.pill} ${styles.pillMedium}`}>Simulated</span>
        </article>
      </div>
    </section>
  );

  const renderActiveView = () => {
    if (activeTab === "schedule") {
      return renderScheduleView();
    }
    if (activeTab === "patients") {
      return renderPatientsView();
    }
    if (activeTab === "payments") {
      return renderPaymentsView();
    }
    if (activeTab === "waitlist") {
      return renderWaitlistView();
    }
    if (activeTab === "reminders") {
      return renderRemindersView();
    }
    if (activeTab === "settings") {
      return renderSettingsView();
    }
    return renderDailyView();
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>IQ</div>
            <div className={styles.brandText}>
              <span>Secure clinic demo</span>
              <strong>NoShowIQ</strong>
            </div>
          </div>

          {(["main", "operations", "insights"] as const).map((group) => (
            <div key={group} className={styles.navGroup}>
              <div className={styles.navLabel}>{group}</div>
              {TABS.filter((tab) => tab.group === group).map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.navButton} ${activeTab === tab.id ? styles.navButtonActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          ))}

          <div className={styles.operator}>
            <div className={styles.operatorCard}>
              <div className={styles.avatar}>{user.name.charAt(0)}</div>
              <div className={styles.operatorMeta}>
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
            </div>
            <button className={styles.logoutButton} onClick={logout} type="button">
              End demo session
            </button>
          </div>
        </aside>

        <section className={styles.content}>
          <header className={styles.header}>
            <div>
              <h1>Clinic operations dashboard</h1>
              <p>
                Manage a mock appointment book, inspect AI-assisted risk signals, and test workflows
                without touching real patient or billing data.
              </p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.secondaryButton} onClick={() => setShowPatientModal(true)} type="button">
                Add patient
              </button>
              <button className={styles.primaryButton} onClick={() => setShowAppointmentModal(true)} type="button">
                Schedule appointment
              </button>
            </div>
          </header>

          <section className={styles.hero}>
            <h2>Demo-only mode is active</h2>
            <p>
              Authentication, reminders, and scheduling changes stay inside this sandbox. High-risk
              signals are useful for UI validation, not medical or operational decisions.
            </p>
          </section>

          {notice && (
            <div
              className={`${styles.banner} ${
                notice.type === "error"
                  ? styles.errorBanner
                  : notice.type === "success"
                    ? styles.successBanner
                    : styles.infoBanner
              }`}
            >
              {notice.text}
            </div>
          )}

          <section className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span>Total appointments</span>
              <strong>{appointments.length}</strong>
              <p className={styles.muted}>Current mock schedule</p>
            </article>
            <article className={styles.statCard}>
              <span>High risk patients</span>
              <strong>{highRiskAppointments.length}</strong>
              <p className={styles.muted}>Needs manual follow-up</p>
            </article>
            <article className={styles.statCard}>
              <span>Potential revenue at risk</span>
              <strong>{formatCurrency(estimatedRevenueRisk)}</strong>
              <p className={styles.muted}>Demo estimate only</p>
            </article>
            <article className={styles.statCard}>
              <span>Patient records</span>
              <strong>{patients.length}</strong>
              <p className={styles.muted}>Stored in mock API memory</p>
            </article>
          </section>

          {loading ? <div className={styles.emptyState}>Loading demo clinic data...</div> : renderActiveView()}
        </section>
      </div>

      {showAppointmentModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2>Schedule appointment</h2>
              <button className={styles.iconButton} onClick={() => setShowAppointmentModal(false)} type="button">
                ×
              </button>
            </div>
            <form className={styles.form} onSubmit={handleAddAppointment}>
              <div className={styles.field}>
                <label htmlFor="patient">Patient name</label>
                <input
                  id="patient"
                  onChange={(event) =>
                    setAppointmentForm((current) => ({ ...current, patient: event.target.value }))
                  }
                  required
                  type="text"
                  value={appointmentForm.patient}
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="type">Appointment type</label>
                  <select
                    id="type"
                    onChange={(event) =>
                      setAppointmentForm((current) => ({ ...current, type: event.target.value }))
                    }
                    value={appointmentForm.type}
                  >
                    <option>Consultation</option>
                    <option>General Checkup</option>
                    <option>Follow-up</option>
                    <option>Vaccination</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="date">Date</label>
                  <input
                    id="date"
                    onChange={(event) =>
                      setAppointmentForm((current) => ({ ...current, date: event.target.value }))
                    }
                    required
                    type="date"
                    value={appointmentForm.date}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  onChange={(event) =>
                    setAppointmentForm((current) => ({ ...current, time: event.target.value }))
                  }
                  required
                  type="time"
                  value={appointmentForm.time}
                />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} onClick={() => setShowAppointmentModal(false)} type="button">
                  Cancel
                </button>
                <button className={styles.primaryButton} disabled={busy} type="submit">
                  {busy ? "Saving..." : "Create appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPatientModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2>Add patient</h2>
              <button className={styles.iconButton} onClick={() => setShowPatientModal(false)} type="button">
                ×
              </button>
            </div>
            <form className={styles.form} onSubmit={handleAddPatient}>
              <div className={styles.field}>
                <label htmlFor="patient-name">Full name</label>
                <input
                  id="patient-name"
                  onChange={(event) =>
                    setPatientForm((current) => ({ ...current, name: event.target.value }))
                  }
                  required
                  type="text"
                  value={patientForm.name}
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="patient-email">Email</label>
                  <input
                    id="patient-email"
                    onChange={(event) =>
                      setPatientForm((current) => ({ ...current, email: event.target.value }))
                    }
                    required
                    type="email"
                    value={patientForm.email}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="patient-phone">Phone</label>
                  <input
                    id="patient-phone"
                    onChange={(event) =>
                      setPatientForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    required
                    type="tel"
                    value={patientForm.phone}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="patient-last-visit">Last visit</label>
                <input
                  id="patient-last-visit"
                  onChange={(event) =>
                    setPatientForm((current) => ({ ...current, lastVisit: event.target.value }))
                  }
                  required
                  type="date"
                  value={patientForm.lastVisit}
                />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} onClick={() => setShowPatientModal(false)} type="button">
                  Cancel
                </button>
                <button className={styles.primaryButton} disabled={busy} type="submit">
                  {busy ? "Saving..." : "Create patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

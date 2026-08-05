"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import { clearDemoUser, readDemoUser, type DemoUser } from "@/lib/demoSession";
import type { Appointment, Patient, Payment } from "@/lib/mockDb";

type TabId = "daily" | "schedule" | "patients" | "payments" | "waitlist" | "reminders" | "settings";
type Notice = { type: "info" | "error" | "success"; text: string } | null;

const TABS: Array<{ id: TabId; label: string; icon: string; group: "main" | "operations" | "insights" }> = [
  { id: "daily", label: "Dashboard", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", group: "main" },
  { id: "schedule", label: "Schedule", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", group: "main" },
  { id: "patients", label: "Patients", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", group: "main" },
  { id: "payments", label: "Payments", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", group: "operations" },
  { id: "waitlist", label: "Waitlist", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", group: "operations" },
  { id: "reminders", label: "Reminders", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", group: "insights" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", group: "insights" },
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
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const payload = (await response.json()) as T & { message?: string };
  if (!response.ok) throw new Error(payload.message || `Request failed with status ${response.status}`);
  return payload;
};

const toTwelveHourTime = (value: string) => {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${(hour % 12 || 12).toString().padStart(2, "0")}:${minuteText} ${suffix}`;
};

const formatRiskClass = (risk: Appointment["riskLevel"]) => {
  if (risk === "high") return `${styles.pill} ${styles.pillHigh}`;
  if (risk === "medium") return `${styles.pill} ${styles.pillMedium}`;
  return `${styles.pill} ${styles.pillLow}`;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

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
    if (!demoUser) { router.replace("/login"); return; }
    setUser(demoUser);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const [nextAppointments, nextPatients, nextPayments] = await Promise.all([
          requestJson<Appointment[]>("/api/appointments"),
          requestJson<Patient[]>("/api/patients"),
          requestJson<Payment[]>("/api/payments"),
        ]);
        if (cancelled) return;
        setAppointments(nextAppointments);
        setPatients(nextPatients);
        setPayments(nextPayments);
      } catch (error) {
        if (!cancelled) setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to load demo clinic data." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadData();
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const todayLabel = useMemo(() =>
    new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }), []);

  const highRiskAppointments = appointments.filter((a) => a.riskLevel === "high");
  const mediumRiskAppointments = appointments.filter((a) => a.riskLevel === "medium");
  const estimatedRevenueRisk = highRiskAppointments.length * 3800 + mediumRiskAppointments.length * 1800;
  const waitlist = [...appointments].sort((a, b) => b.risk - a.risk).slice(0, 5);

  const logout = () => { clearDemoUser(); router.push("/login"); };

  const refreshPredictions = async () => {
    setBusy(true);
    try {
      const updated = await requestJson<Appointment[]>("/api/appointments", { method: "PATCH" });
      setAppointments(updated);
      setNotice({ type: "success", text: "AI risk predictions were refreshed for the demo schedule." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Prediction refresh failed." });
    } finally { setBusy(false); }
  };

  const handleAddAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const created = await requestJson<Appointment>("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          patient: appointmentForm.patient,
          time: toTwelveHourTime(appointmentForm.time),
          risk: 0.1,
          riskLevel: "low" as const,
          type: appointmentForm.type,
          status: "Pending",
          date: new Date(`${appointmentForm.date}T${appointmentForm.time}:00`).toISOString(),
        }),
      });
      setAppointments((prev) => [...prev, created]);
      setShowAppointmentModal(false);
      setAppointmentForm(defaultAppointmentForm());
      setNotice({ type: "success", text: `Appointment created for ${created.patient}.` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to create appointment." });
    } finally { setBusy(false); }
  };

  const handleCancelAppointment = async (id: string, patientName: string) => {
    setBusy(true);
    try {
      await requestJson(`/api/appointments/${id}`, { method: "DELETE" });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setNotice({ type: "success", text: `Appointment for ${patientName} cancelled. Waitlist notified to claim the freed slot.` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to cancel appointment." });
    } finally { setBusy(false); }
  };

  const handleAddPatient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const created = await requestJson<Patient>("/api/patients", {
        method: "POST",
        body: JSON.stringify(patientForm),
      });
      setPatients((prev) => [...prev, created]);
      setShowPatientModal(false);
      setPatientForm(defaultPatientForm());
      setNotice({ type: "success", text: `Patient record created for ${created.name}.` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to add patient." });
    } finally { setBusy(false); }
  };

  const sendReminderBatch = () => {
    setNotice({ type: "success", text: "Reminder batch queued. No live SMS, WhatsApp, or email traffic was sent." });
  };

  if (!user) return null;

  const renderDailyView = () => (
    <motion.div className={styles.grid} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Today&apos;s appointments</h3>
          <span>{todayLabel}</span>
        </div>
        <div className={styles.stack}>
          {appointments.map((appointment, i) => (
            <motion.div key={appointment.id} className={styles.listRow} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className={styles.listMeta}>
                <strong>{appointment.patient}</strong>
                <span>{appointment.time} &middot; {appointment.type} &middot; {appointment.status}</span>
                <span>{appointment.reasoning.join(" &middot; ")}</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span className={formatRiskClass(appointment.riskLevel)}>
                  {appointment.riskLevel} &middot; {(appointment.risk * 100).toFixed(0)}%
                </span>
                <button
                  className={styles.iconButton}
                  style={{ width: "30px", height: "30px", fontSize: "16px", background: "none", color: "#94a3b8" }}
                  onClick={() => handleCancelAppointment(appointment.id, appointment.patient)}
                  title="Cancel appointment"
                >
                  &times;
                </button>
              </div>
            </motion.div>
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
          <div className={styles.listRow}>
            <div className={styles.listMeta}>
              <strong>High-risk queue</strong>
              <span>{highRiskAppointments.length} patients require attention today</span>
            </div>
            <span className={`${styles.pill} ${styles.pillHigh}`}>Priority</span>
          </div>
          <div className={styles.listRow}>
            <div className={styles.listMeta}>
              <strong>Waitlist coverage</strong>
              <span>{waitlist.length} candidates available for rapid rebooking</span>
            </div>
            <span className={`${styles.pill} ${styles.pillLow}`}>Ready</span>
          </div>
        </div>
      </section>
    </motion.div>
  );

  const renderScheduleView = () => (
    <motion.section className={styles.panel} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className={styles.panelHeader}>
        <h3>Full schedule</h3>
        <span>{appointments.length} appointments</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr><th>Patient</th><th>Time</th><th>Type</th><th>Status</th><th>Risk</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <motion.tr key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <td><strong>{a.patient}</strong><span>{a.reasoning[0]}</span></td>
              <td>{a.time}</td><td>{a.type}</td><td>{a.status}</td>
              <td><span className={formatRiskClass(a.riskLevel)}>{a.riskLevel}</span></td>
              <td>
                <button
                  className={styles.secondaryButton}
                  style={{ padding: "6px 12px", fontSize: "0.75rem", background: "transparent", borderColor: "transparent", color: "#dc2626" }}
                  onClick={() => handleCancelAppointment(a.id, a.patient)}
                  title="Cancel appointment"
                >
                  Cancel
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );

  const renderPatientsView = () => (
    <motion.section className={styles.panel} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className={styles.panelHeader}>
        <h3>Patient directory</h3>
        <span>{patients.length} mock records</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Last visit</th></tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <motion.tr key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <td><strong>{p.name}</strong></td>
              <td>{p.email}</td><td>{p.phone}</td><td>{p.lastVisit}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );

  const renderPaymentsView = () => (
    <motion.section className={styles.panel} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className={styles.panelHeader}>
        <h3>Payments overview</h3>
        <span>Mock revenue data</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr><th>Patient</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <motion.tr key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <td>{p.patient}</td><td>{p.service}</td><td>{p.date}</td><td>{p.amount}</td>
              <td><span className={p.status === "Paid" ? `${styles.pill} ${styles.pillLow}` : `${styles.pill} ${styles.pillMedium}`}>{p.status}</span></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );

  const renderWaitlistView = () => (
    <motion.div className={styles.grid} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Smart waitlist</h3>
          <span>Risk-ranked candidates</span>
        </div>
        <div className={styles.stack}>
          {waitlist.map((a, i) => (
            <motion.div key={a.id} className={styles.listRow} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className={styles.listMeta}>
                <strong>{a.patient}</strong>
                <span>{a.type}</span>
              </div>
              <span className={formatRiskClass(a.riskLevel)}>{(a.risk * 100).toFixed(0)}%</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>Recovered revenue</h3>
          <span>Demo estimate</span>
        </div>
        <div className={styles.stack}>
          <div className={styles.statCard}>
            <span>Potential protected revenue</span>
            <strong>{formatCurrency(estimatedRevenueRisk)}</strong>
            <p className={styles.muted}>Based on current high and medium risk appointments in the demo queue.</p>
          </div>
          <button className={styles.primaryButton} onClick={sendReminderBatch} type="button">
            Notify waitlist
          </button>
        </div>
      </section>
    </motion.div>
  );

  const renderRemindersView = () => (
    <motion.section className={styles.panel} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className={styles.panelHeader}>
        <h3>Reminder center</h3>
        <span>Demo messaging only</span>
      </div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Queued today</span>
          <strong>24</strong>
        </div>
        <div className={styles.statCard}>
          <span>Confirmed</span>
          <strong>21</strong>
        </div>
        <div className={styles.statCard}>
          <span>Escalated calls</span>
          <strong>{highRiskAppointments.length}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Manual follow-up</span>
          <strong>3</strong>
        </div>
      </div>
      <button className={styles.primaryButton} onClick={sendReminderBatch} type="button">
        Queue reminder batch
      </button>
    </motion.section>
  );

  const renderSettingsView = () => (
    <motion.section className={styles.panel} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className={styles.panelHeader}>
        <h3>Clinic settings</h3>
        <span>Review mode</span>
      </div>
      <div className={styles.stack}>
        <div className={styles.listRow}>
          <div className={styles.listMeta}>
            <strong>Demo auth boundary</strong>
            <span>Only session-based demo access is enabled in this environment.</span>
          </div>
          <span className={`${styles.pill} ${styles.pillLow}`}>Enabled</span>
        </div>
        <div className={styles.listRow}>
          <div className={styles.listMeta}>
            <strong>Mutation throttling</strong>
            <span>Appointment, patient, and prediction routes are rate-limited in the Next demo layer.</span>
          </div>
          <span className={`${styles.pill} ${styles.pillLow}`}>Enabled</span>
        </div>
        <div className={styles.listRow}>
          <div className={styles.listMeta}>
            <strong>Live messaging</strong>
            <span>Reminder actions stay inside demo mode and do not reach external channels.</span>
          </div>
          <span className={`${styles.pill} ${styles.pillMedium}`}>Simulated</span>
        </div>
      </div>
    </motion.section>
  );

  const renderActiveView = () => {
    switch (activeTab) {
      case "schedule": return renderScheduleView();
      case "patients": return renderPatientsView();
      case "payments": return renderPaymentsView();
      case "waitlist": return renderWaitlistView();
      case "reminders": return renderRemindersView();
      case "settings": return renderSettingsView();
      default: return renderDailyView();
    }
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
              {TABS.filter((t) => t.group === group).map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.navButton} ${activeTab === tab.id ? styles.navButtonActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={tab.icon} />
                  </svg>
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
              <p>Manage a mock appointment book, inspect AI-assisted risk signals, and test workflows without touching real patient or billing data.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.secondaryButton} onClick={() => setShowPatientModal(true)} type="button">Add patient</button>
              <button className={styles.primaryButton} onClick={() => setShowAppointmentModal(true)} type="button">Schedule appointment</button>
            </div>
          </header>

          <section className={styles.hero}>
            <h2>Demo-only mode is active</h2>
            <p>Authentication, reminders, and scheduling changes stay inside this sandbox. High-risk signals are useful for UI validation, not medical or operational decisions.</p>
          </section>

          {notice && (
            <div className={`${styles.banner} ${notice.type === "error" ? styles.errorBanner : notice.type === "success" ? styles.successBanner : styles.infoBanner}`}>
              {notice.text}
            </div>
          )}

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span>Total appointments</span>
              <strong>{appointments.length}</strong>
              <p className={styles.muted}>Current mock schedule</p>
            </div>
            <div className={styles.statCard}>
              <span>High risk patients</span>
              <strong>{highRiskAppointments.length}</strong>
              <p className={styles.muted}>Needs manual follow-up</p>
            </div>
            <div className={styles.statCard}>
              <span>Potential revenue at risk</span>
              <strong>{formatCurrency(estimatedRevenueRisk)}</strong>
              <p className={styles.muted}>Demo estimate only</p>
            </div>
            <div className={styles.statCard}>
              <span>Patient records</span>
              <strong>{patients.length}</strong>
              <p className={styles.muted}>Stored in mock API memory</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.emptyState}>Loading demo clinic data...</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} variants={pageVariants} initial="initial" animate="animate" exit="exit">
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </div>

      {showAppointmentModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowAppointmentModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Schedule appointment</h2>
              <button className={styles.iconButton} onClick={() => setShowAppointmentModal(false)} type="button">&times;</button>
            </div>
            <form className={styles.form} onSubmit={handleAddAppointment}>
              <div className={styles.field}>
                <label htmlFor="patient">Patient name</label>
                <input id="patient" onChange={(e) => setAppointmentForm((p) => ({ ...p, patient: e.target.value }))} required type="text" value={appointmentForm.patient} />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="type">Appointment type</label>
                  <select id="type" onChange={(e) => setAppointmentForm((p) => ({ ...p, type: e.target.value }))} value={appointmentForm.type}>
                    <option>Consultation</option>
                    <option>General Checkup</option>
                    <option>Follow-up</option>
                    <option>Vaccination</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="date">Date</label>
                  <input id="date" onChange={(e) => setAppointmentForm((p) => ({ ...p, date: e.target.value }))} required type="date" value={appointmentForm.date} />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="time">Time</label>
                <input id="time" onChange={(e) => setAppointmentForm((p) => ({ ...p, time: e.target.value }))} required type="time" value={appointmentForm.time} />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} onClick={() => setShowAppointmentModal(false)} type="button">Cancel</button>
                <button className={styles.primaryButton} disabled={busy} type="submit">{busy ? "Saving..." : "Create appointment"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPatientModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowPatientModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add patient</h2>
              <button className={styles.iconButton} onClick={() => setShowPatientModal(false)} type="button">&times;</button>
            </div>
            <form className={styles.form} onSubmit={handleAddPatient}>
              <div className={styles.field}>
                <label htmlFor="patient-name">Full name</label>
                <input id="patient-name" onChange={(e) => setPatientForm((p) => ({ ...p, name: e.target.value }))} required type="text" value={patientForm.name} />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="patient-email">Email</label>
                  <input id="patient-email" onChange={(e) => setPatientForm((p) => ({ ...p, email: e.target.value }))} required type="email" value={patientForm.email} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="patient-phone">Phone</label>
                  <input id="patient-phone" onChange={(e) => setPatientForm((p) => ({ ...p, phone: e.target.value }))} required type="tel" value={patientForm.phone} />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="patient-last-visit">Last visit</label>
                <input id="patient-last-visit" onChange={(e) => setPatientForm((p) => ({ ...p, lastVisit: e.target.value }))} required type="date" value={patientForm.lastVisit} />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} onClick={() => setShowPatientModal(false)} type="button">Cancel</button>
                <button className={styles.primaryButton} disabled={busy} type="submit">{busy ? "Saving..." : "Create patient"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

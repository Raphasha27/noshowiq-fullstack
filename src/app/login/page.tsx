"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import {
  DEMO_CREDENTIALS,
  clearLoginLockState,
  readDemoUser,
  readLoginLockState,
  recordFailedLogin,
  saveDemoUser,
  validateDemoCredentials,
} from "@/lib/demoSession";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "info" | "error" | "success"; text: string }>({
    type: "info",
    text: "This login is for demo access only. Do not enter real patient, clinic, or payment credentials.",
  });
  const [clock, setClock] = useState(Date.now());
  const lockState = readLoginLockState();
  const secondsRemaining = Math.max(0, Math.ceil((lockState.lockedUntil - clock) / 1000));
  const isLocked = lockState.lockedUntil > clock;

  const primaryDemo = useMemo(() => DEMO_CREDENTIALS[0], []);

  useEffect(() => {
    if (readDemoUser()) {
      router.replace("/dashboard");
      return;
    }

    if (!isLocked) {
      return;
    }

    const intervalId = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [isLocked, router]);

  const applyDemoCredentials = () => {
    setEmail(primaryDemo.email);
    setPassword(primaryDemo.password);
    setMessage({
      type: "info",
      text: "Demo credentials loaded. Use these only in this sandboxed preview.",
    });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (isLocked) {
      setMessage({
        type: "error",
        text: `Too many failed demo attempts. Try again in ${secondsRemaining} seconds.`,
      });
      setLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = validateDemoCredentials(email, password);
    if (!user) {
      const nextState = recordFailedLogin();

      setMessage({
        type: "error",
        text:
          nextState.lockedUntil > 0
            ? "Demo access is locked for 60 seconds after repeated failures."
            : `Invalid demo credentials. ${nextState.remainingAttempts} attempt${nextState.remainingAttempts === 1 ? "" : "s"} remaining before lockout.`,
      });
      setLoading(false);
      return;
    }

    clearLoginLockState();
    saveDemoUser(user);
    setMessage({
      type: "success",
      text: `Signed in as ${user.name}. This session is temporary and stored only for the current browser session.`,
    });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.badge}>Healthcare Scheduling Demo</span>
          <div>
            <h1>Reduce no-shows without pretending demo auth is production auth.</h1>
            <p>
              NoShowIQ is running in a demo mode for secure review and QA. Sessions are stored in
              session storage only, failed attempts are throttled, and all data remains mock data.
            </p>
          </div>

          <div className={styles.credentialGrid}>
            {DEMO_CREDENTIALS.map((credential) => (
              <div key={credential.email} className={styles.credentialCard}>
                <h2>{credential.role === "admin" ? "Admin operator" : "Clinician operator"}</h2>
                <div className={styles.credentialRow}>
                  <span>Email</span>
                  <code>{credential.email}</code>
                </div>
                <div className={styles.credentialRow}>
                  <span>Password</span>
                  <code>{credential.password}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>IQ</div>
            <div className={styles.brandText}>
              <span>Demo operator access</span>
              <strong>NoShowIQ</strong>
            </div>
          </div>

          <div
            className={`${styles.notice} ${
              message.type === "error"
                ? styles.error
                : message.type === "success"
                  ? styles.success
                  : styles.info
            }`}
          >
            {message.text}
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.field}>
              <label htmlFor="email">Demo email</label>
              <input
                autoComplete="username"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="doctor@clinic.com"
                type="email"
                value={email}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Demo password</label>
              <input
                autoComplete="current-password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="demo123"
                type="password"
                value={password}
              />
            </div>

            <div className={styles.actions}>
              <button className={styles.primaryButton} disabled={loading || isLocked} type="submit">
                {isLocked ? `Locked for ${secondsRemaining}s` : loading ? "Signing In..." : "Start Demo Session"}
              </button>
              <button className={styles.secondaryButton} disabled={loading} onClick={applyDemoCredentials} type="button">
                Use Admin Demo Credentials
              </button>
            </div>
          </form>

          <p className={styles.helperText}>
            This page does not support password recovery or real user accounts. If you are reviewing
            security, treat every credential shown here as public demo data.
          </p>
        </section>
      </div>
    </main>
  );
}

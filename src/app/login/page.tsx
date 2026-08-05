"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    if (!isLocked) return;
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
      setMessage({ type: "error", text: `Too many failed attempts. Try again in ${secondsRemaining} seconds.` });
      setLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = validateDemoCredentials(email, password);

    if (!user) {
      const nextState = recordFailedLogin();
      setMessage({
        type: "error",
        text: nextState.lockedUntil > 0
          ? "Demo access is locked for 60 seconds after repeated failures."
          : `Invalid demo credentials. ${nextState.remainingAttempts} attempt${nextState.remainingAttempts === 1 ? "" : "s"} remaining before lockout.`,
      });
      setLoading(false);
      return;
    }

    clearLoginLockState();
    saveDemoUser(user);
    setMessage({ type: "success", text: `Signed in as ${user.name}. This session is temporary and stored only for the current browser session.` });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.wrapper}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Healthcare Scheduling Demo
          </div>
          <h1>Reduce no-shows without pretending demo auth is production auth.</h1>
          <p>
            NoShowIQ is running in a demo mode for secure review and QA. Sessions are stored in
            session storage only, failed attempts are throttled, and all data remains mock data.
          </p>
        </motion.header>

        <motion.section
          className={styles.credentials}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className={styles.divider}>
            <span>Demo operator access</span>
          </div>
          <div className={styles.credentialGrid}>
            {DEMO_CREDENTIALS.map((credential, i) => (
              <div
                key={credential.email}
                className={styles.credentialCard}
              >
                <div className={styles.credentialHeader}>
                  <div className={styles.avatar}>{credential.role === "admin" ? "A" : "C"}</div>
                  <h2>{credential.role === "admin" ? "Admin Operator" : "Clinician Operator"}</h2>
                </div>
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
        </motion.section>

        <motion.section
          className={styles.card}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className={styles.cardBrand}>
            <div className={styles.brandMark}>IQ</div>
            <div className={styles.brandText}>
              <span>Demo operator access</span>
              <strong>NoShowIQ</strong>
            </div>
          </div>

          <div className={`${styles.notice} ${message.type === "error" ? styles.error : message.type === "success" ? styles.success : styles.info}`}>
            <svg className={styles.noticeIcon} viewBox="0 0 20 20" fill="currentColor">
              {message.type === "error" ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707-7.293z" clipRule="evenodd" />
              ) : message.type === "success" ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              )}
            </svg>
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
        </motion.section>
      </div>
    </motion.main>
  );
}
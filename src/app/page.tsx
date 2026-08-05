'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const stats = [
  { value: '94.8%', label: 'ML Prediction Accuracy' },
  { value: 'R35K+', label: 'Monthly Revenue Saved' },
  { value: '96.2%', label: 'Average Attendance Rate' },
  { value: '350+', label: 'Private Practices Active' },
];

const features = [
  {
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    title: 'No-Show Probability Index',
    desc: 'Pre-evaluates every booking based on past attendance, age, distance, and booking lead-time to output an exact risk profile.',
  },
  {
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    title: 'Smart Conversational Reminders',
    desc: 'Triggers multi-lingual, personalized WhatsApp/SMS alerts. High-risk patients receive interactive confirm/reschedule prompts.',
  },
  {
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    title: 'Auto-Fill Cancellation Queue',
    desc: 'When a cancellation is predicted or confirmed, the platform automatically alerts waitlisted patients to claim the slot.',
  },
  {
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Revenue Leakage Analytics',
    desc: 'Instantly quantifies lost time and displays saved billing values in real time so administrators can trace ROI.',
  },
  {
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    title: 'Practice Management Integration',
    desc: 'Integrates natively into EHR and billing software, syncing calendar updates without changing existing reception flows.',
  },
  {
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    title: 'Multi-Practitioner Scheduling',
    desc: 'Scales from individual specialist suites to massive private medical centers managing dozens of operating rooms.',
  },
];

const painPoints = [
  {
    title: 'Unpredicted Absenteeism',
    bad: 'No-shows cost private suites 15-20% capacity',
    good: 'AI predicts absences and triggers early rebooking',
    badIcon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    goodIcon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Unfilled Cancellations',
    bad: 'Last-minute cancellations go completely wasted',
    good: 'Waitlist auto-fill recovers slots within 10 minutes',
    badIcon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    goodIcon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  },
  {
    title: 'Manual Confirmation Load',
    bad: 'Receptionists spend 2.5 hours/day cold-calling',
    good: 'Conversational triggers automate 92% of outreach',
    badIcon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    goodIcon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

export default function LandingPage() {
  useEffect(() => {
    // Prevent the browser from automatically restoring the scroll position on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Always start at the top
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand} onClick={(e) => {
          if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}>
          <div className={styles.brandMark}>IQ</div>
          NoShowIQ
        </Link>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#impact" className={styles.navLink}>Revenue Impact</a>
          <Link href="/login" className={styles.loginBtn}>Enter Portal</Link>
        </div>
      </nav>

      <section className={styles.heroSection}>
        <div className={styles.glow} />
        <motion.div className={styles.heroContent} variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeUp} className={styles.badge}>
            <span className={styles.badgeDot} />
            Predictive Intelligence for Private Medical Practices
          </motion.div>

          <motion.h1 variants={fadeUp} className={styles.heroTitle}>
            Stop Lost Revenue from <br />
            <span className={styles.heroTitleAccent}>Patient No-Shows &amp; Cancellations</span>
          </motion.h1>

          <motion.p variants={fadeUp} className={styles.heroDesc}>
            NoShowIQ uses advanced machine learning models to analyze patient history, weather,
            and schedule density. We predict appointment attendance, automate reminders, and
            fill cancellations instantly.
          </motion.p>

          <motion.div variants={fadeUp} className={styles.heroActions}>
            <Link href="/login" className={styles.primaryBtn}>
              Explore Live Trial
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#features" className={styles.secondaryBtn}>
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section id="impact" className={styles.statsSection}>
        <div className={styles.statsInner}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className={styles.statItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className={styles.featuresSection}>
        <div className={styles.featuresInner}>
          <motion.div
            className={styles.featuresHeader}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.featuresTitle}>Designed Specifically for High-Performing Clinics</h2>
            <p className={styles.featuresSub}>Custom-built workflows that protect practitioner hours and secure practice profitability.</p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.problemSection}>
        <div className={styles.problemInner}>
          <motion.div
            className={styles.problemHeader}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.problemTitle}>Stop Letting Idle Slots Drain Your Practice</h2>
            <p className={styles.problemSub}>
              Private specialist suites lose an average of R120,000 annually per doctor to empty
              appointment slots. NoShowIQ acts as an intelligent shield.
            </p>
          </motion.div>

          <div className={styles.problemList}>
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                className={styles.problemRow}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className={styles.problemTitleBlock}>
                  <h3>{p.title}</h3>
                </div>
                <div className={styles.problemBad}>
                  <div className={styles.problemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={p.badIcon} />
                    </svg>
                  </div>
                  <p>{p.bad}</p>
                </div>
                <div className={styles.problemGood}>
                  <div className={styles.problemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={p.goodIcon} />
                    </svg>
                  </div>
                  <p>{p.good}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.ctaTitle}>Protect Your Clinic&apos;s Bottom Line Today</h2>
          <p className={styles.ctaDesc}>
            Set up NoShowIQ in under an hour. Keep your schedules full, your staff happy, and your patients cared for.
          </p>
          <Link href="/login" className={styles.ctaBtn}>
            Explore Live Trial
          </Link>
        </motion.div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>NoShowIQ</span>
            <span className={styles.footerTagline}>The Revenue Protection Engine for Modern Private Clinics</span>
          </div>
          <span className={styles.footerCopy}>
            &copy; 2026 NoShowIQ. Built by Raphasha27 with Next.js, FastAPI &amp; Vercel
          </span>
        </div>
      </footer>
    </main>
  );
}

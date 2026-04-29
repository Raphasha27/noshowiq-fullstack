export type DemoRole = "admin" | "clinician";

export type DemoUser = {
  email: string;
  name: string;
  role: DemoRole;
};

type LoginLockState = {
  attempts: number;
  lockedUntil: number;
};

const STORAGE_KEY = "noshowiq-demo-user";
const LOCK_KEY = "noshowiq-demo-lock";
const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 60_000;

const DEMO_USERS: Record<string, { password: string; name: string; role: DemoRole }> = {
  "admin@noshowiq.com": {
    password: "demo123",
    name: "Dr. Sarah Connor",
    role: "admin",
  },
  "doctor@clinic.com": {
    password: "demo",
    name: "Dr. Alicia Ndlovu",
    role: "clinician",
  },
};

const canUseStorage = () => typeof window !== "undefined";

const readJson = <T>(key: string): T | null => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = sessionStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!canUseStorage()) {
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(value));
};

export const DEMO_CREDENTIALS = Object.entries(DEMO_USERS).map(([email, user]) => ({
  email,
  password: user.password,
  role: user.role,
}));

export const validateDemoCredentials = (email: string, password: string): DemoUser | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const match = DEMO_USERS[normalizedEmail];

  if (!match || match.password !== normalizedPassword) {
    return null;
  }

  return {
    email: normalizedEmail,
    name: match.name,
    role: match.role,
  };
};

export const saveDemoUser = (user: DemoUser) => {
  writeJson(STORAGE_KEY, user);
};

export const readDemoUser = (): DemoUser | null => {
  const parsed = readJson<DemoUser>(STORAGE_KEY);

  if (!parsed || !parsed.email || !parsed.name || !parsed.role) {
    return null;
  }

  return parsed;
};

export const clearDemoUser = () => {
  if (!canUseStorage()) {
    return;
  }

  sessionStorage.removeItem(STORAGE_KEY);
};

export const readLoginLockState = (): LoginLockState => {
  const state = readJson<LoginLockState>(LOCK_KEY);
  const now = Date.now();

  if (!state) {
    return { attempts: 0, lockedUntil: 0 };
  }

  if (state.lockedUntil && state.lockedUntil <= now) {
    clearLoginLockState();
    return { attempts: 0, lockedUntil: 0 };
  }

  return {
    attempts: Number.isFinite(state.attempts) ? state.attempts : 0,
    lockedUntil: Number.isFinite(state.lockedUntil) ? state.lockedUntil : 0,
  };
};

export const clearLoginLockState = () => {
  if (!canUseStorage()) {
    return;
  }

  sessionStorage.removeItem(LOCK_KEY);
};

export const recordFailedLogin = () => {
  const current = readLoginLockState();
  const nextAttempts = current.attempts + 1;

  if (nextAttempts >= MAX_ATTEMPTS) {
    const lockedUntil = Date.now() + LOCKOUT_MS;
    writeJson(LOCK_KEY, { attempts: 0, lockedUntil });
    return { attempts: 0, lockedUntil, remainingAttempts: 0 };
  }

  writeJson(LOCK_KEY, { attempts: nextAttempts, lockedUntil: 0 });
  return {
    attempts: nextAttempts,
    lockedUntil: 0,
    remainingAttempts: MAX_ATTEMPTS - nextAttempts,
  };
};

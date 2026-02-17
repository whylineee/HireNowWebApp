export type UserRole = "employer" | "job_seeker";

export type LocalUser = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
};

export type LocalSession = {
  email: string;
  fullName: string;
  role: UserRole;
  signedInAt: string;
};

const USERS_KEY = "hire_now_users_v1";
const SESSION_KEY = "hire_now_session_v1";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write errors (quota/private mode).
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function listUsers(): LocalUser[] {
  return safeRead<LocalUser[]>(USERS_KEY, []);
}

export function getSession(): LocalSession | null {
  return safeRead<LocalSession | null>(SESSION_KEY, null);
}

export function saveSession(session: LocalSession) {
  safeWrite(SESSION_KEY, session);
}

export function signOut() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage removal errors.
  }
}

type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
};

type AuthResult = {
  ok: boolean;
  message?: string;
  session?: LocalSession;
};

export function signUp(input: SignUpInput): AuthResult {
  const users = listUsers();
  const email = normalizeEmail(input.email);

  if (users.some((user) => normalizeEmail(user.email) === email)) {
    return { ok: false, message: "Account with this email already exists." };
  }

  const createdUser: LocalUser = {
    email,
    password: input.password,
    fullName: input.fullName.trim(),
    role: input.role,
    createdAt: new Date().toISOString(),
  };

  safeWrite(USERS_KEY, [...users, createdUser]);

  const session: LocalSession = {
    email: createdUser.email,
    fullName: createdUser.fullName,
    role: createdUser.role,
    signedInAt: new Date().toISOString(),
  };

  saveSession(session);

  return { ok: true, session };
}

type SignInInput = {
  email: string;
  password: string;
};

export function signIn(input: SignInInput): AuthResult {
  const users = listUsers();
  const email = normalizeEmail(input.email);

  const user = users.find(
    (candidate) =>
      normalizeEmail(candidate.email) === email &&
      candidate.password === input.password,
  );

  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  const session: LocalSession = {
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    signedInAt: new Date().toISOString(),
  };

  saveSession(session);
  return { ok: true, session };
}

type PasswordUpdateResult = {
  ok: boolean;
  message?: string;
};

type ResetPasswordInput = {
  email: string;
  newPassword: string;
};

type ChangePasswordInput = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

function isValidPassword(password: string) {
  return password.trim().length >= 6;
}

export function resetPasswordByEmail(
  input: ResetPasswordInput,
): PasswordUpdateResult {
  const email = normalizeEmail(input.email);
  const newPassword = input.newPassword.trim();

  if (!isValidPassword(newPassword)) {
    return { ok: false, message: "Password should be at least 6 characters." };
  }

  const users = listUsers();
  const userIndex = users.findIndex(
    (candidate) => normalizeEmail(candidate.email) === email,
  );

  if (userIndex === -1) {
    return { ok: false, message: "Account with this email does not exist." };
  }

  const updatedUsers = [...users];
  updatedUsers[userIndex] = {
    ...updatedUsers[userIndex],
    password: newPassword,
  };

  safeWrite(USERS_KEY, updatedUsers);
  return { ok: true };
}

export function changePassword(
  input: ChangePasswordInput,
): PasswordUpdateResult {
  const email = normalizeEmail(input.email);
  const currentPassword = input.currentPassword.trim();
  const newPassword = input.newPassword.trim();
  const users = listUsers();
  const userIndex = users.findIndex(
    (candidate) => normalizeEmail(candidate.email) === email,
  );

  if (userIndex === -1) {
    return { ok: false, message: "Account with this email does not exist." };
  }

  if (users[userIndex].password !== currentPassword) {
    return { ok: false, message: "Current password is incorrect." };
  }

  if (!isValidPassword(newPassword)) {
    return { ok: false, message: "Password should be at least 6 characters." };
  }

  if (newPassword === currentPassword) {
    return {
      ok: false,
      message: "New password must be different from current password.",
    };
  }

  const updatedUsers = [...users];
  updatedUsers[userIndex] = {
    ...updatedUsers[userIndex],
    password: newPassword,
  };
  safeWrite(USERS_KEY, updatedUsers);

  return { ok: true };
}

/** Admins definidos por e-mail no ambiente (ADMIN_EMAILS="a@x.com,b@y.com") ou pela flag no banco. */
export const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export const isEnvAdmin = (email: string) => adminEmails().includes(email.trim().toLowerCase());
export const isAdminUser = (u: { email: string; isAdmin: boolean }) => u.isAdmin || isEnvAdmin(u.email);

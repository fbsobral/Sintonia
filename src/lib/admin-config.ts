/**
 * Admins: a flag `isAdmin` no banco é a única fonte de verdade para dar acesso.
 * ADMIN_EMAILS (ambiente) só PROMOVE contas cujo e-mail está VERIFICADO no Clerk (ver session.ts).
 */
export const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export const isEnvAdmin = (email: string) => adminEmails().includes(email.trim().toLowerCase());
export const isAdminUser = (u: { isAdmin: boolean }) => u.isAdmin;

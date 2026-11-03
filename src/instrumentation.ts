/** Roda uma vez na subida do servidor: avisa (sem derrubar) sobre configuração insegura. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const prod = process.env.NODE_ENV === "production";
  const warn = (m: string) => console.warn(`[segurança] ${m}`);

  if (!process.env.DATABASE_URL) warn("DATABASE_URL ausente.");
  if ((process.env.CRON_SECRET ?? "").length < 24) warn("CRON_SECRET ausente ou curto: use 32+ caracteres aleatórios, senão o envio diário fica desativado.");
  if (prod) {
    if (process.env.CLERK_SECRET_KEY?.startsWith("sk_test_")) warn("Clerk com chaves de TESTE em produção: troque pelas chaves live.");
    if (!process.env.RESEND_API_KEY) warn("RESEND_API_KEY ausente: nenhum e-mail será enviado.");
    if (!process.env.ADMIN_EMAILS) warn("ADMIN_EMAILS ausente: ninguém será promovido a admin.");
    if ((process.env.NEXT_PUBLIC_APP_URL ?? "").includes("localhost")) warn("NEXT_PUBLIC_APP_URL aponta para localhost: links de convite e e-mails sairão errados.");
    if (!(process.env.NEXT_PUBLIC_APP_URL ?? "").startsWith("https://")) warn("NEXT_PUBLIC_APP_URL deveria usar https://.");
  }
}

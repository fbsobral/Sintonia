const MESSAGES: Record<string, string> = {
  limite: "Muitas tentativas em pouco tempo. Aguarde um pouco e tente de novo.",
  confirmacao: "O texto digitado para confirmar não confere.",
  clerk: "Não foi possível excluir a conta agora. Tente novamente em instantes.",
};

/** Aviso de erro vindo de `?erro=` (limite de tentativas, confirmação etc.). */
export function Notice({ erro }: { erro?: string }) {
  const msg = erro ? MESSAGES[erro] : undefined;
  if (!msg) return null;
  return <p role="alert" className="rise rounded-2xl border border-rose/40 bg-rose/10 p-3 text-sm text-rose-100">{msg}</p>;
}

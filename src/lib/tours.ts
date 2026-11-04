import type { IconName } from "@/components/Icon";
import type { Viewer } from "./session";

export const TOUR_IDS = ["welcome", "hoje", "ciclos", "astro", "perfil", "convidar"] as const;
export type TourId = (typeof TOUR_IDS)[number];
export const isTourId = (s: string): s is TourId => (TOUR_IDS as readonly string[]).includes(s);

export type TourStep = {
  icon: IconName;
  title: string;
  body: string;
  /** Pontos curtos, no máximo 3, para escanear no celular. */
  points?: string[];
  /** Atalho opcional para a tela relacionada. */
  cta?: { label: string; href: string };
};
export type TourContent = { label: string; steps: TourStep[] };

/** Textos dos tutoriais, escritos para quem menstrua ("her") e para quem acompanha ("him"). */
export function tourContent(id: TourId, v: Viewer, partnerName: string): TourContent {
  const her = v === "her";
  const ela = her ? "você" : partnerName;
  switch (id) {
    case "welcome":
      return {
        label: "Boas-vindas",
        steps: [
          {
            icon: "heart",
            title: her ? "Bem-vinda ao Sintonia" : "Bem-vindo ao Sintonia",
            body: her
              ? "O app mostra, a cada dia, o que está acontecendo no seu corpo e o que pode ajudar. Seu parceiro pode acompanhar junto, e quem decide o que ele vê é você."
              : `O app mostra, a cada dia, o que está acontecendo com ${partnerName} e como você pode ajudar. Em 1 minuto você vê como usar.`,
          },
          {
            icon: "sun",
            title: "Hoje: o seu dia em uma tela",
            body: her
              ? "Fase do ciclo, previsões, como você pode estar, o que ajuda, o que evitar e frases prontas para pedir o que precisa."
              : "Fase do ciclo, o que costuma acontecer, o que ajuda, o que evitar e como abrir a conversa no tom certo.",
            points: ["Toque nos dias da faixa para ver o passado e o futuro", "A cor mostra a fase de cada dia"],
          },
          {
            icon: "calendar",
            title: "Ciclos: a base das previsões",
            body: `Registre o primeiro dia de cada menstruação. Com 3 registros, o app troca o ritmo informado pela média real ${her ? "dos seus ciclos" : "dos ciclos dela"}.`,
            points: ["Dá para editar ou apagar um registro depois", "O que um registra aparece para o outro"],
          },
          {
            icon: "star",
            title: "Astro: um jeito leve de conversar",
            body: "Mapa e compatibilidade do casal, lidos da sua perspectiva. É uma leitura simbólica, sem base científica, separada do cálculo do ciclo.",
          },
          {
            icon: "lock",
            title: her ? "Você no controle" : "Ela no controle",
            body: her
              ? "Em Perfil você liga ou pausa o compartilhamento quando quiser. As anotações pessoais do check-in nunca são mostradas ao parceiro."
              : "Os dados do ciclo são dela: ela pode pausar o compartilhamento a qualquer momento. Quando isso acontece, você é avisado na tela.",
            points: ["Resumo diário por e-mail, no horário que você escolher", "Em cada tela, o botão ? reabre o guia daquele módulo"],
          },
        ],
      };

    case "hoje":
      return {
        label: "Hoje",
        steps: [
          {
            icon: "sun",
            title: "O anel do ciclo",
            body: `O número no centro é o dia do ciclo de ${ela}. A cor do anel marca a fase e o ponto indica onde estamos agora.`,
            points: ["Menstrual, folicular, ovulatória e lútea", "Mostra a próxima menstruação e o nível de fertilidade", "A janela de TPM aparece quando está próxima"],
          },
          {
            icon: "calendar",
            title: "Viaje no tempo",
            body: "Use as setas ou toque num dia da faixa para ver como foi ou como deve ser. Datas futuras são previsões a partir da média dos ciclos registrados.",
            points: ["“Voltar para hoje” aparece quando você sai do dia atual"],
          },
          her
            ? { icon: "chat", title: "Check-in e sinais", body: "Marque humor, sintomas, fluxo e desejo em poucos toques. Se tiver parceiro conectado, envie um sinal como “preciso de espaço”.", points: ["Sua anotação pessoal fica só com você", "Ele recebe o sinal com uma orientação de como responder"] }
            : { icon: "chat", title: "Sinais e check-in dela", body: `Quando ${partnerName} faz um check-in ou envia um sinal, aparece aqui no topo, com uma sugestão de como responder.`, points: ["Você só vê o que ela deixar liberado", "Anotações pessoais nunca aparecem"] },
          {
            icon: "spark",
            title: her ? "O que pode ajudar você" : "O que ajuda e o que evitar",
            body: her
              ? "Cada momento da fase tem tendências, o porquê fisiológico, dicas do que ajuda, o que evitar e uma frase pronta para pedir apoio."
              : "Cada momento da fase traz o que ela pode estar sentindo, o que costuma ajudar, o que vale evitar e uma frase para abrir a conversa.",
            points: ["Toque em “Por que isso acontece” para a explicação", "São tendências médias: confirme conversando"],
          },
          {
            icon: "moon",
            title: "Céu do dia",
            body: "A Lua do dia e como ela conversa com o ciclo. É uma leitura simbólica, usada como roteiro de conversa, e o ciclo continua sendo biologia.",
          },
        ],
      };

    case "ciclos":
      return {
        label: "Ciclos",
        steps: [
          {
            icon: "calendar",
            title: "O calendário do ciclo",
            body: "Cada dia tem a cor da sua fase, e o ponto branco marca a ovulação estimada. Use as setas para trocar de mês e toque num dia para abrir os detalhes.",
          },
          {
            icon: "drop",
            title: "Registre quando começar",
            body: `Informe o primeiro dia da menstruação de ${ela}. O último dia é opcional, mas permite calcular a duração média.`,
            points: ["Pode ser hoje", "Se ainda está em andamento, deixe o último dia em branco ou informe uma data prevista", "Com 3 registros o app passa a usar a média real"],
          },
          {
            icon: "check",
            title: "Edite quando precisar",
            body: "No Histórico, o lápis edita as datas e o ✕ remove o registro. As previsões se recalculam na hora, para os dois.",
            points: ["O app mostra quem registrou cada ciclo"],
          },
        ],
      };

    case "astro":
      return {
        label: "Astro",
        steps: [
          {
            icon: "star",
            title: "O céu de vocês",
            body: "Três visões: o casal, a outra pessoa e você. Cada mapa mostra signos, planetas e elementos, com textos escritos para a sua perspectiva.",
            points: ["“Nós dois” traz a compatibilidade e os pontos de encontro"],
          },
          {
            icon: "user",
            title: "Quanto mais dados, mais preciso",
            body: "Só com a data de nascimento já dá para ver o signo solar. Com a hora, a Lua e Vênus ficam mais precisas.",
            cta: { label: "Completar meus dados", href: "/perfil#voce" },
          },
          {
            icon: "moon",
            title: "Um repertório, não uma ciência",
            body: "A astrologia aqui é um jeito leve de conversar sobre estilos e preferências. Ela fica separada do cálculo do ciclo e das orientações de saúde.",
          },
        ],
      };

    case "perfil":
      return {
        label: "Perfil",
        steps: [
          {
            icon: "user",
            title: "Casal e dados",
            body: her
              ? "Veja quem está conectado, ajuste seu nome, sua data de nascimento e o ritmo do seu ciclo. Informar a hora de nascimento melhora o mapa astral."
              : `Veja quem está conectado e ajuste os seus dados. Os dados de ${partnerName} (nascimento e ritmo do ciclo) passam a ser editados só por ela depois que ela entra.`,
          },
          her
            ? { icon: "lock", title: "Privacidade", body: "Ligue ou pause o compartilhamento quando quiser. Pausado, ele deixa de ver o ciclo e de receber o resumo diário, mas continua no casal.", points: ["Você também pode remover o acesso dele", "Anotações pessoais nunca são compartilhadas"] }
            : { icon: "lock", title: "Compartilhamento", body: "Quem menstrua controla o que você vê. Se ela pausar, você é avisado na tela e volta a ver tudo quando ela retomar." },
          {
            icon: "mail",
            title: "E-mails sob medida",
            body: "Escolha receber o resumo diário, o horário e o fuso. Dá para ligar avisos de quando o outro registrar algo, e enviar um e-mail de teste.",
          },
          {
            icon: "heart",
            title: "Sair, apagar, rever",
            body: "Você pode sair do casal ou excluir a conta e os dados quando quiser. Aqui também dá para rever todos os tutoriais do app.",
          },
        ],
      };

    case "convidar":
      return {
        label: "Convidar",
        steps: [
          {
            icon: "mail",
            title: her ? "Convide seu parceiro" : `Convide ${partnerName}`,
            body: "Gere um link e envie pelo WhatsApp, por e-mail ou copie. O link vale por 14 dias e quem aceita entra no mesmo casal.",
          },
          {
            icon: "heart",
            title: "O que muda quando entra",
            body: "O que um registra aparece para o outro e as previsões se atualizam para os dois. Cada um recebe o resumo diário na própria perspectiva.",
            points: [her ? "Você decide o que ele vê, e pode pausar" : "Ela decide o que você vê, e pode pausar", "Dá para usar sozinha e convidar depois"],
          },
        ],
      };
  }
}

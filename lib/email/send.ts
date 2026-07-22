type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendResult = { ok: boolean; id?: string; error?: string };

/**
 * Envoi d'e-mail.
 * - Si `RESEND_API_KEY` est défini → envoi réel via l'API Resend (HTTP).
 * - Sinon → transport de développement : l'e-mail est journalisé (non envoyé).
 *
 * Cette abstraction permet de brancher un vrai fournisseur en prod sans
 * toucher au code métier.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendArgs): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "UMY <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(
      `\n📧 [email:dev] destinataire=${to} · objet="${subject}"\n` +
        `   (RESEND_API_KEY absent → e-mail NON envoyé, journalisé uniquement)\n`,
    );
    return { ok: true, id: "dev-logged" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, text }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${body}` };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "erreur inconnue" };
  }
}

"use server";

import { sendEmail } from "@/lib/email/send";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;
export type ContactResult =
  | { ok: true }
  | { ok: false; error?: string; fieldErrors?: ContactFieldErrors };

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendContactMessage(
  input: ContactInput,
): Promise<ContactResult> {
  const errors: ContactFieldErrors = {};
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.name?.trim()) errors.name = "Nom requis";
  if (!input.email?.trim() || !emailRe.test(input.email.trim()))
    errors.email = "E-mail invalide";
  if (!input.message?.trim() || input.message.trim().length < 10)
    errors.message = "Message trop court";
  if (Object.keys(errors).length > 0)
    return { ok: false, error: "Veuillez corriger les champs signalés.", fieldErrors: errors };

  const to = process.env.CONTACT_EMAIL ?? "contact@umy.dev";
  const subject = `[Contact] ${input.subject?.trim() || "Nouveau message"}`;
  const rows = [
    ["Nom", input.name.trim()],
    ["E-mail", input.email.trim()],
    ["Sujet", input.subject?.trim() || "—"],
  ];
  const html = `
    <h2 style="font-family:Georgia,serif;color:#4A141C">Nouveau message — UMY</h2>
    <table style="font-family:Helvetica,Arial,sans-serif;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td style="color:#8A7B72;padding:2px 12px 2px 0">${k}</td><td>${escapeHtml(v)}</td></tr>`).join("")}
    </table>
    <p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(input.message.trim())}</p>`;
  const text = `Nouveau message — UMY\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${input.message.trim()}`;

  const res = await sendEmail({ to, subject, html, text });
  if (!res.ok) {
    console.error("[contact]", res.error);
    return { ok: false, error: "L'envoi a échoué, réessayez plus tard." };
  }
  return { ok: true };
}

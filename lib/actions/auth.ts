"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth/session";

export type SignInResult = { ok: true } | { ok: false; error: string };

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { ok: false, error: "E-mail et mot de passe requis." };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: normalized },
  });

  // Message générique (ne pas révéler si l'e-mail existe)
  const invalid = { ok: false, error: "Identifiants invalides." } as const;
  if (!user) return invalid;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return invalid;

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return { ok: true };
}

export async function signOut(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}

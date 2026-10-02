"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CalendarDays, LogOut } from "lucide-react";
import Container, { PageHeading } from "@/components/ui/Container";
import Button, { buttonStyles } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApiError } from "@/services/api";
import { authService } from "@/services/auth";
import { initials } from "@/utils/format";

function ProfileCard() {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) return null;
  const dirty = name.trim() !== user.name;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);
    if (!name.trim()) {
      setError(t("auth.nameRequired"));
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const updated = await authService.updateUser(user.id, { name: name.trim() });
      setUser({ ...user, name: updated.name });
      setName(updated.name);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("common.errorGeneric"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</h2>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{user.email ?? user.phoneNumber}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {saved && <Alert tone="success">{t("account.profileSaved")}</Alert>}
        <Input
          label={t("common.name")}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          error={error ?? undefined}
          disabled={busy}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t("common.email")} value={user.email ?? t("account.notSet")} readOnly disabled />
          <Input label={t("common.phone")} value={user.phoneNumber ?? t("account.notSet")} readOnly disabled />
        </div>
        <Button type="submit" loading={busy} disabled={!dirty}>
          {busy ? t("common.saving") : t("common.save")}
        </Button>
      </form>
    </section>
  );
}

function PasswordCard() {
  const { t } = useLanguage();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ old?: string; next?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = {
      old: oldPassword ? undefined : t("auth.passwordRequired"),
      next: newPassword.length >= 6 ? undefined : t("auth.passwordMin"),
      confirm: confirm === newPassword ? undefined : t("auth.passwordMismatch"),
    };
    setErrors(nextErrors);
    setFormError(null);
    setDone(false);
    if (Object.values(nextErrors).some(Boolean)) return;

    setBusy(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setDone(true);
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t("common.errorGeneric"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t("account.changePassword")}</h2>
      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
        {done && <Alert tone="success">{t("account.passwordChanged")}</Alert>}
        {formError && <Alert tone="error">{formError}</Alert>}
        <Input
          label={t("account.currentPassword")}
          type="password"
          autoComplete="current-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={errors.old}
          disabled={busy}
        />
        <Input
          label={t("auth.newPassword")}
          type="password"
          autoComplete="new-password"
          hint={t("auth.passwordHint")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.next}
          disabled={busy}
        />
        <Input
          label={t("auth.confirmPassword")}
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          disabled={busy}
        />
        <Button type="submit" loading={busy}>
          {busy ? t("common.saving") : t("account.updatePassword")}
        </Button>
      </form>
    </section>
  );
}

export default function AccountView() {
  const { t } = useLanguage();
  const { signOut } = useAuth();

  return (
    <Container width="2xl" className="py-10">
      <PageHeading
        title={t("account.title")}
        subtitle={t("account.subtitle")}
        action={
          <Link href="/bookings" className={buttonStyles({ variant: "secondary", size: "sm" })}>
            <CalendarDays className="h-4 w-4" />
            {t("nav.myBookings")}
          </Link>
        }
      />
      <div className="mt-8 space-y-6">
        <ProfileCard />
        <PasswordCard />
        <Button variant="secondary" onClick={() => signOut({ redirect: true })} className="w-full sm:w-auto">
          <LogOut className="h-4 w-4" />
          {t("nav.signOut")}
        </Button>
      </div>
    </Container>
  );
}

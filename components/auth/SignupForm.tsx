"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "./AuthCard";
import IdentifierInput, { toIdentifier, type IdentifierMode } from "./IdentifierInput";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApiError } from "@/services/api";
import { authService } from "@/services/auth";
import { safeNext } from "@/utils/format";

type Errors = { name?: string; identifier?: string; password?: string; confirm?: string };

export default function SignupForm() {
  const { t } = useLanguage();
  const { user, ready, signIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));

  const [name, setName] = useState("");
  const [mode, setMode] = useState<IdentifierMode>("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const who = toIdentifier(mode, identifier);
    const nextErrors: Errors = {
      name: name.trim() ? undefined : t("auth.nameRequired"),
      identifier: who ? undefined : t(mode === "email" ? "auth.invalidEmail" : "auth.invalidPhone"),
      password: password.length >= 6 ? undefined : t("auth.passwordMin"),
      confirm: confirm === password ? undefined : t("auth.passwordMismatch"),
    };
    setErrors(nextErrors);
    setFormError(null);
    if (!who || Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      signIn(await authService.signup(name.trim(), who, password));
    } catch (err) {
      if (err instanceof ApiError) {
        // 409 = this email / phone already has an account
        setFormError(err.message);
      } else {
        setFormError(t("common.errorGeneric"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={t("auth.signupTitle")}
      subtitle={t("auth.signupSubtitle")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <Link
            href={next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`}
            className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            {t("auth.signIn")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && <Alert tone="error">{formError}</Alert>}

        <Input
          label={t("common.name")}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={submitting}
        />

        <IdentifierInput
          mode={mode}
          onModeChange={(m) => {
            setMode(m);
            setIdentifier("");
            setErrors((prev) => ({ ...prev, identifier: undefined }));
          }}
          value={identifier}
          onChange={setIdentifier}
          error={errors.identifier}
          disabled={submitting}
        />

        <Input
          label={t("common.password")}
          type="password"
          autoComplete="new-password"
          hint={t("auth.passwordHint")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={submitting}
        />

        <Input
          label={t("auth.confirmPassword")}
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          disabled={submitting}
        />

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? t("auth.creating") : t("auth.createAccount")}
        </Button>
      </form>
    </AuthCard>
  );
}

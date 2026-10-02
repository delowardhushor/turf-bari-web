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
import { CONSOLE_URL } from "@/constants";
import { ApiError } from "@/services/api";
import { authService } from "@/services/auth";
import { safeNext } from "@/utils/format";

export default function LoginForm() {
  const { t } = useLanguage();
  const { user, ready, signIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));

  const [mode, setMode] = useState<IdentifierMode>("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [staff, setStaff] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Signing in (or arriving while already signed in) sends you where you were headed
  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const who = toIdentifier(mode, identifier);
    const nextErrors = {
      identifier: who ? undefined : t(mode === "email" ? "auth.invalidEmail" : "auth.invalidPhone"),
      password: password ? undefined : t("auth.passwordRequired"),
    };
    setErrors(nextErrors);
    setFormError(null);
    setStaff(false);
    if (!who || !password) return;

    setSubmitting(true);
    try {
      const res = await authService.login(who, password);
      // Turf owners and staff work in the owner console, not on the customer site
      if (res.user.role !== "user") {
        setStaff(true);
        return;
      }
      signIn(res);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t("common.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link
            href={next === "/" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`}
            className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            {t("auth.createAccount")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && <Alert tone="error">{formError}</Alert>}
        {staff && (
          <Alert tone="info">
            <p>{t("auth.staffAccount")}</p>
            <a href={CONSOLE_URL} className="mt-1 inline-block font-semibold underline">
              {t("auth.openConsole")}
            </a>
          </Alert>
        )}

        <IdentifierInput
          mode={mode}
          onModeChange={(m) => {
            setMode(m);
            setIdentifier("");
            setErrors({});
          }}
          value={identifier}
          onChange={setIdentifier}
          error={errors.identifier}
          disabled={submitting}
        />

        <div>
          <Input
            label={t("common.password")}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={submitting}
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>
    </AuthCard>
  );
}

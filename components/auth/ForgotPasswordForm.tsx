"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthCard from "./AuthCard";
import IdentifierInput, { toIdentifier, type IdentifierMode } from "./IdentifierInput";
import Button, { buttonStyles } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApiError } from "@/services/api";
import { authService } from "@/services/auth";
import type { Identifier } from "@/types";

type Step = "request" | "reset" | "done";

/** Mirrors the API's wait between OTPs to the same number (OTP_COOLDOWN_SECONDS). */
const RESEND_COOLDOWN_S = 60;

/** Two steps: ask for a code, then set a new password with it. */
export default function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("request");
  const [mode, setMode] = useState<IdentifierMode>("phone");
  const [value, setValue] = useState("");
  const [who, setWho] = useState<Identifier | null>(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; otp?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const requestCode = async (target: Identifier) => {
    setBusy(true);
    setFormError(null);
    try {
      await authService.forgotPassword(target);
      setWho(target);
      setStep("reset");
      setCooldown(RESEND_COOLDOWN_S);
      return true;
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t("common.errorGeneric"));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const onRequest = async (e: FormEvent) => {
    e.preventDefault();
    const target = toIdentifier(mode, value);
    setErrors({
      identifier: target ? undefined : t(mode === "email" ? "auth.invalidEmail" : "auth.invalidPhone"),
    });
    if (target) await requestCode(target);
  };

  const onResend = async () => {
    if (!who) return;
    setNotice(null);
    if (await requestCode(who)) setNotice(t("auth.codeResent"));
  };

  const onReset = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = {
      otp: /^\d{6}$/.test(otp.trim()) ? undefined : t("auth.otpInvalid"),
      password: password.length >= 6 ? undefined : t("auth.passwordMin"),
    };
    setErrors(nextErrors);
    setFormError(null);
    setNotice(null);
    if (!who || nextErrors.otp || nextErrors.password) return;

    setBusy(true);
    try {
      await authService.resetPassword(who, otp.trim(), password);
      setStep("done");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t("common.errorGeneric"));
    } finally {
      setBusy(false);
    }
  };

  const backToLogin = (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("auth.backToLogin")}
    </Link>
  );

  if (step === "done") {
    return (
      <AuthCard title={t("auth.resetDoneTitle")} subtitle={t("auth.resetDoneDesc")}>
        <div className="flex flex-col items-center gap-5 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" aria-hidden />
          <Link href="/login" className={buttonStyles({ size: "lg", className: "w-full" })}>
            {t("auth.signIn")}
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (step === "reset" && who) {
    return (
      <AuthCard
        title={t("auth.codeSentTitle")}
        subtitle={t("auth.codeSentDesc", { identifier: who.email ?? who.phoneNumber ?? "" })}
        footer={backToLogin}
      >
        <form onSubmit={onReset} noValidate className="space-y-5">
          {formError && <Alert tone="error">{formError}</Alert>}
          {notice && <Alert tone="success">{notice}</Alert>}

          <Input
            label={t("auth.otpLabel")}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            error={errors.otp}
            disabled={busy}
          />
          <Input
            label={t("auth.newPassword")}
            type="password"
            autoComplete="new-password"
            hint={t("auth.passwordHint")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={busy}
          />

          <Button type="submit" size="lg" className="w-full" loading={busy}>
            {busy ? t("auth.resetting") : t("auth.resetPassword")}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={onResend}
              disabled={busy || cooldown > 0}
              className="font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50 dark:text-emerald-400"
            >
              {cooldown > 0 ? t("auth.resendIn", { seconds: cooldown }) : t("auth.resendCode")}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setOtp("");
                setPassword("");
                setErrors({});
                setFormError(null);
                setNotice(null);
              }}
              className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {t("auth.changeIdentifier")}
            </button>
          </div>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("auth.forgotTitle")} subtitle={t("auth.forgotSubtitle")} footer={backToLogin}>
      <form onSubmit={onRequest} noValidate className="space-y-5">
        {formError && <Alert tone="error">{formError}</Alert>}
        <IdentifierInput
          mode={mode}
          onModeChange={(m) => {
            setMode(m);
            setValue("");
            setErrors({});
          }}
          value={value}
          onChange={setValue}
          error={errors.identifier}
          disabled={busy}
        />
        <Button type="submit" size="lg" className="w-full" loading={busy}>
          {busy ? t("auth.sending") : t("auth.sendCode")}
        </Button>
      </form>
    </AuthCard>
  );
}

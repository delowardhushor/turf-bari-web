import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AccountView from "@/components/account/AccountView";

export const metadata: Metadata = { title: "My account | TurfBari" };

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountView />
    </RequireAuth>
  );
}

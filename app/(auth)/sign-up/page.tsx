import SignUpClient from "@/components/signupcontext";
import { Suspense } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const callbackUrl =
    (searchParams.callbackUrl as string) ??
    (searchParams.redirect as string) ??
    (searchParams.redirect_uri as string) ??
    null;

  return (
    <Suspense fallback={null}>
      <SignUpClient callbackUrl={callbackUrl} />
    </Suspense>
  );
}

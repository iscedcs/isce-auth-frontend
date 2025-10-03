import SignInClient from "@/components/signincontext";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const callbackUrl =
    (params.callbackUrl as string) ??
    (params.redirect as string) ??
    (params.redirect_uri as string) ??
    null;

  return (
    <Suspense fallback={null}>
      <SignInClient callbackUrl={callbackUrl} />
    </Suspense>
  );
}

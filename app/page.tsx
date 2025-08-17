"use client";
import { redirect } from "next/navigation";
import React from "react";

export default function HomePage() {
  const [isAuth, setIsAuth] = React.useState(false);
  return <div>{!isAuth ? redirect("/sign-in") : redirect("/sign-up")}</div>;
}

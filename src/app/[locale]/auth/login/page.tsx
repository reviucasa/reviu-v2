"use client";
import { LoginForm } from "@/components/forms/LoginForm";
import { LoginLayout } from "@/components/layouts/LoginLayout";
import LoginImg from "public/login.png";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.back();
    }
  }, [router, user]);

  return (
    <>
      <LoginLayout image={LoginImg} imageAlt="Login">
        <LoginForm />
      </LoginLayout>
    </>
  );
}

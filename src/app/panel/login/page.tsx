"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction } from "../actions";

type FormFields = {
  email: string;
  password: string;
};

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

function getInitialForm(): FormFields {
  if (typeof window === "undefined") return { email: "", password: "" };
  const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY);
  return { email: saved ?? "", password: "" };
}

function getInitialRememberMe(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(REMEMBERED_EMAIL_KEY);
}

export default function LoginPage() {
  const [form, setForm] = useState<FormFields>(getInitialForm);
  const [isPending, setIsPending] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(getInitialRememberMe);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    // Save or clear remembered email
    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, form.email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    const formData = new FormData();
    formData.set("email", form.email);
    formData.set("password", form.password);

    const result = await loginAction(null, formData);

    if (result.error) {
      toast.error(result.error);
    }

    setIsPending(false);
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <Camera className="h-8 w-8 text-black" />
          <span className="font-serif text-2xl font-semibold tracking-tight text-black">
            DnovaGallery
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-black">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="border-gray-300"
              required
              value={form.email}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              className="border-gray-300"
              required
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember-me" className="text-sm text-gray-500 cursor-pointer">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            status={isPending ? "loading" : "idle"}
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/panel/sign-up"
              className="text-black font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Back to site */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

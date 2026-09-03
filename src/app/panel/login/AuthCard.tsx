"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction, signUpAction } from "../actions";

interface AuthCardProps {
  initialHasUsers: boolean;
}

type LoginFormFields = {
  email: string;
  password: string;
};

type SignUpFormFields = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

function getInitialRememberedEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "";
}

function getInitialRememberMe(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY));
}

export default function AuthCard({ initialHasUsers }: Readonly<AuthCardProps>) {
  const [hasUsers, setHasUsers] = useState(initialHasUsers);
  const [isPending, setIsPending] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormFields>(() => ({
    email: getInitialRememberedEmail(),
    password: "",
  }));
  const [rememberMe, setRememberMe] = useState<boolean>(getInitialRememberMe);

  // Sign up form state (first-time setup)
  const [signUpForm, setSignUpForm] = useState<SignUpFormFields>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, loginForm.email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    const formData = new FormData();
    formData.set("email", loginForm.email);
    formData.set("password", loginForm.password);

    const result = await loginAction(null, formData);

    if (result?.error) {
      toast.error(result.error);
    }

    setIsPending(false);
  };

  const handleSignUpSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.set("name", signUpForm.name);
    formData.set("email", signUpForm.email);
    formData.set("phone", signUpForm.phone);
    formData.set("password", signUpForm.password);
    formData.set("confirm-password", signUpForm.confirmPassword);

    const result = await signUpAction(null, formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
      setHasUsers(true);
      setLoginForm((prev) => ({ ...prev, email: signUpForm.email }));
    }

    setIsPending(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {!hasUsers && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-3 border border-primary/25">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Initial Admin Setup</span>
              </div>
            )}
            <h1 className="text-3xl font-serif font-bold text-black">
              {hasUsers ? "Welcome back" : "Create admin account"}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {hasUsers
                ? "Sign in to access your panel"
                : "No admin account found. Set up the primary administrator to get started."}
            </p>
          </div>

          {/* Form */}
          {hasUsers ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={loginForm.email}
                  onChange={onLoginChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={loginForm.password}
                  onChange={onLoginChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          ) : (
            /* First-time Admin Registration Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-black text-sm">
                  Full name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={signUpForm.name}
                  onChange={onSignUpChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-black text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={signUpForm.email}
                  onChange={onSignUpChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-black text-sm">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  required
                  value={signUpForm.phone}
                  onChange={onSignUpChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-black text-sm">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={signUpForm.password}
                  onChange={onSignUpChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-black text-sm">
                  Confirm password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  value={signUpForm.confirmPassword}
                  onChange={onSignUpChange}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                disabled={isPending}
              >
                {isPending ? "Creating account..." : "Create admin account"}
              </Button>
            </form>
          )}
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
    </div>
  );
}

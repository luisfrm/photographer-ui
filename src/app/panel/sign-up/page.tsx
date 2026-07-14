"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "../actions";

type FormFields = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const emptyForm: FormFields = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpPage() {
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [isPending, setIsPending] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("email", form.email);
    formData.set("phone", form.phone);
    formData.set("password", form.password);
    formData.set("confirm-password", form.confirmPassword);

    const result = await signUpAction(null, formData);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.success);
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
            Create account
          </h1>
          <p className="text-gray-500 mt-2">
            Get started with your admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black">
              Full name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className="border-gray-300"
              required
              value={form.name}
              onChange={onChange}
            />
          </div>

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
            <Label htmlFor="phone" className="text-black">
              Phone number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="border-gray-300"
              required
              value={form.phone}
              onChange={onChange}
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
              className="border-gray-300"
              required
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-black">
              Confirm password
            </Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              className="border-gray-300"
              required
              value={form.confirmPassword}
              onChange={onChange}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            status={isPending ? "loading" : "idle"}
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/panel/login"
              className="text-black font-medium hover:underline"
            >
              Sign in
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

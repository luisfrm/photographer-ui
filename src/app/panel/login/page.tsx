import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
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

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="border-gray-300"
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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-gray-300"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" hoverScale>
            Sign in
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

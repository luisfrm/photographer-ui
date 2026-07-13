import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
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

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black">
              Full name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="border-gray-300"
            />
          </div>

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
            <Label htmlFor="password" className="text-black">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-black">
              Confirm password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="border-gray-300"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" hoverScale>
            Create account
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

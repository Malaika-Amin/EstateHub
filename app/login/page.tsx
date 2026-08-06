"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-stone px-4">
      <div className="w-full max-w-md bg-white border border-ink/10 p-8 rounded-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brass-dark mb-2">
          Sign In
        </p>
        <h1 className="font-display text-2xl text-ink mb-6">Welcome back</h1>

        {justRegistered && (
          <div className="mb-4 p-3 bg-deep-green/10 text-deep-green text-sm rounded-md">
            Account created. Please sign in.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-stone py-2.5 rounded-full font-medium hover:bg-brass-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-2">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-xs font-mono text-slate">OR</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border border-ink/15 py-2.5 rounded-full font-medium hover:bg-ink/5 transition-colors"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center mt-5 text-slate">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brass-dark font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <LoginForm />
    </Suspense>
  );
}
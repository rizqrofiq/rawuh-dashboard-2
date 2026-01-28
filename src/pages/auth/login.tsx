import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(identifier, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Rawuh</title>
      </Head>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--rawuh-primary)] to-blue-700 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-[var(--rawuh-primary)] font-bold text-xl">
                  R
                </span>
              </div>
              <span className="text-white text-2xl font-bold">Rawuh</span>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4">
              Smart Attendance
              <br />
              Management System
            </h1>
            <p className="text-white/80 text-lg max-w-md">
              Streamline attendance tracking with face recognition technology.
              Fast, secure, and accurate.
            </p>
          </div>

          <div className="relative z-10 flex gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  face
                </span>
              </div>
              <span className="text-white text-sm">Face Recognition</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  speed
                </span>
              </div>
              <span className="text-white text-sm">Real-time Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  security
                </span>
              </div>
              <span className="text-white text-sm">Secure & Reliable</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-[var(--rawuh-background)]">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div className="w-12 h-12 bg-[var(--rawuh-primary)] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-[var(--rawuh-text)] text-2xl font-bold">
                Rawuh
              </span>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--rawuh-border)]">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[var(--rawuh-text)]">
                  Welcome Back
                </h2>
                <p className="text-[var(--rawuh-text-muted)] mt-2">
                  Sign in to access your dashboard
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-[var(--rawuh-error-muted)] border border-[var(--rawuh-error)]/20 rounded-lg">
                  <div className="flex items-center gap-2 text-[var(--rawuh-error)]">
                    <span className="material-symbols-outlined text-lg">
                      error
                    </span>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                    NIM / NIP
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rawuh-text-muted)]">
                      badge
                    </span>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your NIM or NIP"
                      className="w-full h-12 pl-12 pr-4 bg-[var(--rawuh-background)] rounded-xl text-sm text-[var(--rawuh-text)] placeholder:text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)] focus:border-[var(--rawuh-primary)] focus:ring-2 focus:ring-[var(--rawuh-primary)]/20 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--rawuh-text)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rawuh-text-muted)]">
                      lock
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-12 pl-12 pr-12 bg-[var(--rawuh-background)] rounded-xl text-sm text-[var(--rawuh-text)] placeholder:text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)] focus:border-[var(--rawuh-primary)] focus:ring-2 focus:ring-[var(--rawuh-primary)]/20 focus:outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rawuh-text-muted)] hover:text-[var(--rawuh-text)]"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[var(--rawuh-border)] text-[var(--rawuh-primary)] focus:ring-[var(--rawuh-primary)]"
                    />
                    <span className="text-sm text-[var(--rawuh-text-muted)]">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-[var(--rawuh-primary)] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[var(--rawuh-primary)] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-[var(--rawuh-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span className="material-symbols-outlined text-lg">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-[var(--rawuh-background)] rounded-xl">
                <p className="text-xs font-medium text-[var(--rawuh-text-muted)] mb-2">
                  Demo Credentials:
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium text-[var(--rawuh-text)]">
                      Lecturer
                    </p>
                    <p className="text-[var(--rawuh-text-muted)]">
                      NIP: L000001
                    </p>
                    <p className="text-[var(--rawuh-text-muted)]">
                      Pass: lecturer123
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-[var(--rawuh-text-muted)] mt-6">
              © 2025 Rawuh. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

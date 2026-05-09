"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { users } from "@/lib/data/users";
import { LogIn, Shield, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check credentials (fake authentication)
    const user = users.find((u) => u.username === username);

    if (user && password === "password") {
      // In a real app, would set JWT token, session, etc.
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword("password");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <span className="text-xl font-bold text-blue-600">CPS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Continental</h1>
              <p className="text-sm text-blue-100">Pension Services</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Welcome to CPS Back Office
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Comprehensive pension administration system for managing member accounts,
              contributions, and programmed withdrawals.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure & Compliant</h3>
                <p className="text-sm text-blue-100">
                  Role-based access control with complete audit trails
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                <LogIn className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Authorization Workflow</h3>
                <p className="text-sm text-blue-100">
                  Dual-control system with capturer and authorizer roles
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-100">
          © 2025 Continental Pension Services Company Limited. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center space-x-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
              <span className="text-xl font-bold text-white">CPS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Continental</h1>
              <p className="text-sm text-slate-500">Pension Services</p>
            </div>
          </div>

          {/* Login Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your credentials to access the back office system
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              error={error ? " " : undefined}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                error={error ? " " : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-medium text-slate-700">
              Demo Accounts (Password: password)
            </p>
            <div className="space-y-2">
              {users.slice(0, 4).map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user.username)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-blue-600 hover:bg-blue-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user.username} • {user.role}
                    </p>
                  </div>
                  <LogIn className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-slate-500">
            <p>Need help? Contact IT Support</p>
            <p className="mt-1">support@cps.mw • +265 1 770 000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

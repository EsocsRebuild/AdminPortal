import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Web Admin Login · ESOCS Content Studio",
  description: "Sign in to manage church website content, events, and public programmes.",
};

export default function WebAdminLoginPage() {
  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
        {/* Ambient Emerald Background Gradients */}
        <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Header Branding */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 uppercase">
              <Sparkles className="size-3.5 animate-pulse" />
              ESOCS Web Content Studio
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Web Admin Sign In</h1>
            <p className="text-sm font-medium text-slate-200">
              Manage public website events, programmes, and branch media content.
            </p>
          </div>

          <Card className="border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold text-white">Portal Credentials</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-300">
                Enter your Web Administrator credentials to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action="/api/auth/login" method="POST" className="space-y-4">
                <input type="hidden" name="next" value="/admin-web/dashboard" />
                <div className="space-y-1.5">
                  <label
                    htmlFor="web-email"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-100"
                  >
                    <Mail className="size-3.5 text-emerald-400" />
                    Web Admin Email
                  </label>
                  <Input
                    id="web-email"
                    name="email"
                    type="email"
                    placeholder="web.admin@esocs.org"
                    required
                    className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="web-pass"
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-100"
                    >
                      <Lock className="size-3.5 text-emerald-400" />
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="web-pass"
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    required
                    className="border-slate-700 bg-slate-950 font-medium text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
                  />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 py-2.5 font-medium text-white shadow-lg shadow-emerald-950/50 transition-all hover:bg-emerald-500"
                    >
                      Sign In to Web Studio
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                    <p>Authenticates your Web Admin session into the Content Studio</p>
                  </TooltipContent>
                </Tooltip>
              </form>

              <div className="border-t border-slate-800 pt-2 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  Isolated Web Admin Session Cookie (`esocs_web_access`)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-slate-500">
            Need Church & Ordination Portal?{" "}
            <Link href="/login" className="font-medium text-slate-300 underline hover:text-white">
              Go to Main Governance Portal
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

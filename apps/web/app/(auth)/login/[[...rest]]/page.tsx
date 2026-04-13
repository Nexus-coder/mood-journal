"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-up">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-medium tracking-tighter text-neutral-900 leading-tight">
          Welcome back.
        </h1>
        <p className="text-neutral-500 text-sm">
          Sign in to your account to continue journaling.
        </p>
      </div>

      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none border-none p-0 w-full",
            header: "hidden",
            footer: "hidden",
            socialButtonsBlockButton: "rounded-2xl border-neutral-200/80 h-12 text-sm font-medium hover:bg-neutral-50 transition-all",
            formButtonPrimary: "bg-neutral-900 hover:bg-neutral-800 text-white h-12 rounded-2xl text-sm font-medium transition-all shadow-lg shadow-neutral-900/10",
            formFieldInput: "bg-white border-neutral-200/80 rounded-2xl h-12 px-4 text-sm focus:ring-neutral-900 transition-all placeholder:text-neutral-300",
            formFieldLabel: "text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1 mb-2",
            dividerLine: "bg-neutral-100",
            dividerText: "text-[10px] text-neutral-400 font-bold uppercase tracking-widest",
            identityPreviewText: "text-neutral-900 font-medium",
            identityPreviewEditButton: "text-neutral-500 hover:text-neutral-900",
          }
        }}
        routing="path"
        path="/login"
        signUpUrl="/signup"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}

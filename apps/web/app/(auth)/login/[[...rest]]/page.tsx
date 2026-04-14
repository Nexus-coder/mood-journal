import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

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

      <ClerkLoading>
        <div className="w-full space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-[1px] flex-1" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-[1px] flex-1" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
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
      </ClerkLoaded>
    </div>
  );
}

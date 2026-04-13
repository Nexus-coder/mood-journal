"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9 rounded-xl opacity-0">
        <div className="size-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-xl hover:bg-muted transition-colors relative group overflow-hidden"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <div className="relative size-4">
        <Sun className="h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 duration-500 absolute inset-0" />
        <Moon className="h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-500 absolute inset-0 text-primary-foreground dark:text-primary" />
      </div>
    </Button>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import {toast} from "sonner";
import { Snowflake, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { signIn } from "next-auth/react"
import {api} from "@/app/_providers/trpc-provider";
import {AppRoutes} from "@/routes"
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, RegisterSchema } from "@/lib/zod"
import { LoginFormValues, RegisterFormValues } from "@/lib/types"





export default function AuthPage() {

  // HOOKS & STATE
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const router = useRouter()
  const [tab, setTab] = useState<"login" | "register">("login")

  // MUTATIONS
  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      router.push(AppRoutes.auth())
      toast.success("Account created successfully! Please log in.")
      resetRegisterForm()
      setTab("login")
    },
    onError: (error) => {
      setGlobalError(error.message)
    }
  })

  // FORMS
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  })

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  })

  // HANDLERS
  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true)
    setGlobalError("")

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (res?.error) {
        setGlobalError("Invalid email or password")
      } else {
        router.push(AppRoutes.dashboard())
        router.refresh()
      }
    } catch (error) {
      setGlobalError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setGlobalError("")
    registerMutation.mutate(data)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f3ff]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d946ef]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block space-y-6"
          >
            <div className="flex items-center gap-3">
              <Image
                width={32}
                height={32}
                src="/logo.svg"
                alt="SubZero Logo"
                className="w-24 h-24 object-contain neon-text"
              />
              <span className="text-5xl font-bold text-[#00f3ff] neon-text tracking-wide">SUBZERO</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Freeze Your Spending,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#d946ef]">
                Maximize Control
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Track, manage, and optimize all your subscriptions in one futuristic dashboard. Stay ahead of every
              payment with AI-powered insights.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="glass-card border border-[#00f3ff]/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#00f3ff] neon-text">100%</div>
                <div className="text-sm text-slate-500">Secure</div>
              </div>
              <div className="glass-card border border-[#d946ef]/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#d946ef]">AI</div>
                <div className="text-sm text-slate-500">Powered</div>
              </div>
              <div className="glass-card border border-emerald-500/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-400">24/7</div>
                <div className="text-sm text-slate-500">Tracking</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="glass-card border border-[#00f3ff]/30 p-8 backdrop-blur-2xl">
              <Tabs
                value={tab}
                onValueChange={(value) => {
                  setTab(value as "login" | "register")
                  setGlobalError("")
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-[#0a0f1e]/60 border border-[#00f3ff]/20 mb-6">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00f3ff] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-[#02040a] text-slate-400"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00f3ff] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-[#02040a] text-slate-400"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* --- LOGIN FORM --- */}
                <TabsContent value="login">
                  <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white placeholder:text-slate-500 focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                        {...registerLogin("email")}
                      />
                      {loginErrors.email && (
                        <p className="text-red-400 text-xs">{loginErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white placeholder:text-slate-500 focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                        {...registerLogin("password")}
                      />
                      {loginErrors.password && (
                        <p className="text-red-400 text-xs">{loginErrors.password.message}</p>
                      )}
                    </div>

                    {globalError && (
                      <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                        {globalError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] font-semibold hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all"
                    >
                      {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : "Access System"}
                    </Button>
                  </form>
                </TabsContent>

                {/* --- REGISTER FORM --- */}
                <TabsContent value="register">
                  <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white placeholder:text-slate-500 focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                        {...registerRegister("name")}
                      />
                      {registerErrors.name && (
                        <p className="text-red-400 text-xs">{registerErrors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-register" className="text-white">Email</Label>
                      <Input
                        id="email-register"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white placeholder:text-slate-500 focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                        {...registerRegister("email")}
                      />
                      {registerErrors.email && (
                        <p className="text-red-400 text-xs">{registerErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-register" className="text-white">Password</Label>
                      <Input
                        id="password-register"
                        type="password"
                        placeholder="••••••••"
                        className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white placeholder:text-slate-500 focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                        {...registerRegister("password")}
                      />
                      {registerErrors.password && (
                        <p className="text-red-400 text-xs">{registerErrors.password.message}</p>
                      )}
                    </div>

                    {globalError && (
                      <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                        {globalError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] font-semibold hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all"
                    >
                      {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Mobile branding */}
            <div className="lg:hidden mt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Snowflake className="w-8 h-8 text-[#00f3ff]" />
                <span className="text-2xl font-bold text-[#00f3ff] neon-text">SUBZERO</span>
              </div>
              <p className="text-slate-500 text-sm">Secure • AI-Powered • 24/7 Tracking</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
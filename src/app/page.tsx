import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Snowflake, Sparkles, TrendingDown, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#02040a]">
      {/* Navigation */}
      <nav className="border-b border-[#1e293b] backdrop-blur-xl bg-[#050b1a]/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="w-8 h-8 text-[#00f3ff]" />
            <span className="text-2xl font-bold tracking-wide text-[#00f3ff] neon-text">SUBZERO</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/faq" className="text-slate-400 hover:text-[#00f3ff] transition-colors">
              FAQ
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-[#00f3ff] transition-colors">
              Terms
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] font-semibold hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f3ff]/30 bg-[#0a0f1e]/60 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-[#00f3ff]" />
              <span className="text-sm text-[#00f3ff] tracking-wide uppercase">AI-Powered Tracking</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">Freeze</span> <span className="text-[#00f3ff] neon-text">Unnecessary</span>{" "}
            <span className="text-white">Spending.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Track every subscription, analyze spending patterns with AI, and take control of your recurring expenses.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] font-bold text-lg px-8 py-6 hover:shadow-[0_0_30px_rgba(0,243,255,0.8)] transition-all"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card border border-[#00f3ff]/20 p-8 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] transition-all group">
            <div className="w-14 h-14 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f3ff]/20 transition-colors">
              <Snowflake className="w-8 h-8 text-[#00f3ff]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Track Everything</h3>
            <p className="text-slate-400 leading-relaxed">
              Never lose track of a subscription again. Manage all your recurring payments in one beautiful dashboard.
            </p>
          </Card>

          <Card className="glass-card border border-[#d946ef]/20 p-8 hover:shadow-[0_0_25px_rgba(217,70,239,0.3)] transition-all group">
            <div className="w-14 h-14 rounded-xl bg-[#d946ef]/10 flex items-center justify-center mb-6 group-hover:bg-[#d946ef]/20 transition-colors">
              <Sparkles className="w-8 h-8 text-[#d946ef]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">AI Analysis</h3>
            <p className="text-slate-400 leading-relaxed">
              Smart auto-categorization and price detection. Just enter the name, we'll handle the rest.
            </p>
          </Card>

          <Card className="glass-card border border-[#00f3ff]/20 p-8 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] transition-all group">
            <div className="w-14 h-14 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f3ff]/20 transition-colors">
              <TrendingDown className="w-8 h-8 text-[#00f3ff]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Save Money</h3>
            <p className="text-slate-400 leading-relaxed">
              Identify unused subscriptions and reduce unnecessary spending. Your wallet will thank you.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-8 mt-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Snowflake className="w-6 h-6 text-[#00f3ff]" />
            <span className="text-lg font-bold text-[#00f3ff]">SUBZERO</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/faq" className="hover:text-[#00f3ff] transition-colors">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-[#00f3ff] transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

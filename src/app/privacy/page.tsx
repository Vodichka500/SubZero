"use client"

import { Card } from "@/components/ui/card"
import { Shield, Lock, Eye, Key, Server, CheckCircle, UserCheck } from "lucide-react"
import { motion } from "framer-motion"
import PageHeader from "@/components/features/landing/page-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#02040a]">
      {/* Navigation */}
      <PageHeader/>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Secure{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00f3ff]">
                & Private
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Your financial data is protected with military-grade encryption and industry-leading security practices.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* UPDATED: Hashed Passwords */}
            <Card className="glass-card border border-emerald-500/20 p-6 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Hashed Passwords</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We never store your actual passwords. All credentials are cryptographically hashed and salted, making them impossible to reverse-engineer.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card border border-[#00f3ff]/20 p-6 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#00f3ff]/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-[#00f3ff]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Zero-Knowledge Architecture</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We never store your payment credentials. All sensitive data is encrypted locally before being sent
                    to our servers.
                  </p>
                </div>
              </div>
            </Card>

            {/* UPDATED: Login + Pass without email */}
            <Card className="glass-card border border-[#d946ef]/20 p-6 hover:shadow-[0_0_25px_rgba(217,70,239,0.3)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#d946ef]/10 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-[#d946ef]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">No Email Required</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Start using the platform instantly with just a login and password. No email confirmation is needed, ensuring your complete anonymity.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card border border-blue-500/20 p-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Server className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure Infrastructure</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Hosted on enterprise-grade cloud infrastructure with 99.9% uptime SLA and automated backups.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Compliance Section - Includes Regular Audits */}
          <Card className="glass-card border border-[#00f3ff]/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
              Compliance & Certifications
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                SubZero is committed to maintaining the highest standards of data protection and privacy. We comply with
                major international regulations:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">GDPR Compliant:</strong> Full compliance with European data
                    protection regulations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">SOC 2 Type II:</strong> Audited security controls and data handling
                    practices
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">PCI DSS:</strong> Payment card industry data security standards
                  </span>
                </li>
                {/* Regular Audits - Highlighted */}
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Regular Audits:</strong> Frequent security audits and infrastructure checks.
                  </span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Privacy Guarantee - Never Sell Data */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Card className="glass-card border border-[#d946ef]/20 p-6">
              <p className="text-slate-300 text-lg leading-relaxed">
                <Lock className="w-5 h-5 inline-block text-emerald-400 mr-2" />
                We will <strong className="text-white">never sell</strong> your data to third parties. Your privacy is
                our top priority, and your trust is what keeps SubZero frozen solid.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}
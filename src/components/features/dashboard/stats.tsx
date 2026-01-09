import React from 'react';

import {Card} from "@/components/ui/card";
import {DollarSign, TrendingUp} from "lucide-react";

import {MONTHS} from "@/lib/constants";

interface StatsProps {
  totalMonthlySpend: number;
  totalYearlySpend: number;
}

const Stats = ( { totalMonthlySpend, totalYearlySpend }: StatsProps) => {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card border border-[#00f3ff]/30 p-6 hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all bg-transparent">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-[#00f3ff]" />
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                Expenses in {MONTHS[new Date().getMonth()]}
              </p>
              <p className="text-4xl font-bold text-[#00f3ff] neon-text">${totalMonthlySpend.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card border border-[#d946ef]/30 p-6 hover:shadow-[0_0_25px_rgba(217,70,239,0.4)] transition-all bg-transparent">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#d946ef]/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#d946ef]" />
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Yearly Projection</p>
              <p className="text-4xl font-bold text-[#d946ef]">${totalYearlySpend.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
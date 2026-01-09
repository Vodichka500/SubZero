import React from 'react';
import Link from "next/link";
import {AppRoutes} from "@/routes";
import {ArrowLeft, Snowflake} from "lucide-react";
import {Button} from "@/components/ui/button";

const PageHeader = () => {
  return (
    <nav className="border-b border-[#1e293b] backdrop-blur-xl bg-[#050b1a]/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={AppRoutes.landing()} className="flex items-center gap-2">
          <Snowflake className="w-8 h-8 text-[#00f3ff]" />
          <span className="text-2xl font-bold tracking-wide text-[#00f3ff] neon-text">SUBZERO</span>
        </Link>
        <Link href={AppRoutes.landing()}>
          <Button variant="ghost" className="text-slate-400 hover:text-[#00f3ff]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default PageHeader;
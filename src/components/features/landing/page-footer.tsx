import React from 'react';

import {Button} from "@/components/ui/button";

import Link from "next/link";
import {AppRoutes} from "@/routes";

const PageFooter = () => {
  return (
    <div className="mt-12 pt-8 border-t border-[#1e293b]">
      <Link href={AppRoutes.auth()}>
        <Button className="bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] font-semibold hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]">
          Get Started with SubZero
        </Button>
      </Link>
    </div>
  );
};

export default PageFooter;
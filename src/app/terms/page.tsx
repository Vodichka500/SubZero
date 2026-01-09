import { format } from "date-fns"
import {trpc} from "@/server/trpc-server";
import PageHeader from "@/components/features/landing/page-header";
import PageFooter from "@/components/features/landing/page-footer";

export const dynamic = "force-dynamic"

export default async function TermsPage() {

  // QUERIES
  const terms = await trpc.terms.getActualTerms();

  return (
    <div className="min-h-screen bg-[#02040a]">
      {/* Navigation */}
      <PageHeader/>

      {/* Terms Content */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {terms.title}
        </h1>

        <p className="text-slate-500 mb-12">
          Last updated: {format(terms.updatedAt, "MMMM d, yyyy")}
        </p>

        <div
          className="
            space-y-8 text-slate-400 leading-relaxed
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-4 [&_h2]:mt-8
            [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:ml-4 [&_ul]:mb-4
            [&_li]:text-slate-400
            [&_a]:text-[#00f3ff] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#00f3ff]/80
          "
          dangerouslySetInnerHTML={{ __html: terms.content }}
        />

        <PageFooter/>
      </div>
    </div>
  )
}
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PageHeader from "@/components/features/landing/page-header";
import PageFooter from "@/components/features/landing/page-footer";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#02040a]">
      {/* Navigation */}
      <PageHeader/>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-400 mb-12 text-lg">Everything you need to know about SubZero.</p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="item-1"
            className="glass-card border border-[#00f3ff]/20 rounded-lg px-6 data-[state=open]:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
          >
            <AccordionTrigger className="text-white hover:text-[#00f3ff] text-lg font-semibold">
              Why should I use SubZero?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              SubZero helps you take control of your recurring expenses by tracking all your subscriptions in one place.
              With AI-powered categorization and smart insights, you can identify unnecessary spending and save money
              effortlessly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="glass-card border border-[#00f3ff]/20 rounded-lg px-6 data-[state=open]:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
          >
            <AccordionTrigger className="text-white hover:text-[#00f3ff] text-lg font-semibold">
              Is SubZero secure?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              Absolutely. We use industry-standard encryption to protect your data. Your subscription information is
              stored securely, and we never share your data with third parties. Your financial privacy is our top
              priority.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="glass-card border border-[#00f3ff]/20 rounded-lg px-6 data-[state=open]:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
          >
            <AccordionTrigger className="text-white hover:text-[#00f3ff] text-lg font-semibold">
              How does the AI auto-fill work?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              Our AI recognizes popular subscription services and automatically fills in details like price, category,
              and icon. Simply type the name of your subscription, and our system will handle the rest. You can always
              manually adjust any details.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="glass-card border border-[#00f3ff]/20 rounded-lg px-6 data-[state=open]:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
          >
            <AccordionTrigger className="text-white hover:text-[#00f3ff] text-lg font-semibold">
              Can I track multiple currencies?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              No, at this time SubZero only supports tracking subscriptions in a single currency - USD. We plan to add multi-currency support in future updates based on user feedback.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="glass-card border border-[#00f3ff]/20 rounded-lg px-6 data-[state=open]:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
          >
            <AccordionTrigger className="text-white hover:text-[#00f3ff] text-lg font-semibold">
              What does &#34;Freeze&#34; mean?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              &#34;Freezing&#34; a subscription marks it as inactive or paused without deleting it. This is perfect for seasonal
              subscriptions or services you plan to resume later. Frozen subscriptions don&#39;t count toward your spending
              totals.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <PageFooter/>
      </div>
    </div>
  )
}

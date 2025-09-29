// src/app/(main)/page.tsx
import HeroSection from '@/components/landing/HeroSection'
import AdTypeShowcase from '@/components/landing/AdTypeShowcase'
import PricingSection from '@/components/landing/PricingSection'
import PaymentMethodsSection from '@/components/landing/PaymentMethodsSection'
import PurchaseFlowSection from '@/components/landing/PurchaseFlowSection'
import CTASection from '@/components/landing/CTASection'
import AnalyticsShowcaseSection from '@/components/landing/AnalyticsShowcaseSection'

const TopPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Hero Section - Server Component */}
            <HeroSection />
            
            {/* Main Content */}
            <main className="relative">
                {/* Ad Type Showcase */}
                <section className="py-20 px-4 bg-black/20">
                    <AdTypeShowcase />
                </section>
                
                {/* Analytics Showcase */}
                <AnalyticsShowcaseSection />
                
                {/* Pricing Section */}
                <section className="py-16 px-4 bg-black/20">
                    <PricingSection />
                </section>
                
                {/* Payment Methods */}
                <section className="py-16 px-4">
                    <PaymentMethodsSection />
                </section>
                
                {/* Purchase Flow */}
                <section className="py-16 px-4 bg-black/20">
                    <PurchaseFlowSection />
                </section>
                
                {/* CTA Section */}
                <section className="py-20 px-4">
                    <CTASection />
                </section>
            </main>
        </div>
    )
}
export default TopPage
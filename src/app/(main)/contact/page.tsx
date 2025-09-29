import ContactForm from "@/components/contact/ContactForm"

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 pt-20 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                            お問い合わせ
                        </h1>
                        <p className="text-xl text-gray-300">
                            ご不明な点やサポートが必要でしたら、お気軽にお問い合わせください
                        </p>
                    </div>
                    
                    {/* Contact Form */}
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}
export default ContactPage
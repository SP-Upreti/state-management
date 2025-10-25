import Navbar from "../components/navigation/navbar";
import Footer from "../components/footer/footer";

export default function PoliciesPage() {
    const policies = [
        {
            id: 1,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Privacy Policy",
            description: "Your privacy is important to us",
            sections: [
                {
                    heading: "Information We Collect",
                    content: "We collect information you provide directly to us, such as your name, email address, postal address, phone number, and payment information when you create an account, place an order, or contact us."
                },
                {
                    heading: "How We Use Your Information",
                    content: "We use the information we collect to process your orders, communicate with you, improve our services, and comply with legal obligations. We never sell your personal information to third parties."
                },
                {
                    heading: "Data Security",
                    content: "We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology."
                }
            ]
        },
        {
            id: 2,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            title: "Return & Refund Policy",
            description: "Easy returns within 30 days",
            sections: [
                {
                    heading: "Return Window",
                    content: "You may return most new, unopened items within 30 days of delivery for a full refund. Items must be in their original condition and packaging."
                },
                {
                    heading: "Refund Process",
                    content: "Once we receive your return, we will inspect it and notify you of the status. If approved, your refund will be processed within 5-7 business days to your original payment method."
                },
                {
                    heading: "Non-Returnable Items",
                    content: "Certain items cannot be returned, including perishable goods, custom products, personal care items, and sale items unless they are defective or damaged."
                }
            ]
        },
        {
            id: 3,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
            ),
            title: "Shipping Policy",
            description: "Fast and reliable delivery",
            sections: [
                {
                    heading: "Delivery Time",
                    content: "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) and overnight shipping options are available at checkout."
                },
                {
                    heading: "Shipping Costs",
                    content: "Shipping costs are calculated based on the weight of your order and your location. Free standard shipping is available for orders over $50."
                },
                {
                    heading: "International Shipping",
                    content: "We ship to select international destinations. Delivery times vary by location and may be subject to customs delays. Customers are responsible for any customs duties or taxes."
                }
            ]
        },
        {
            id: 4,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            title: "Payment Policy",
            description: "Secure payment options",
            sections: [
                {
                    heading: "Accepted Payment Methods",
                    content: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other secure payment methods. All transactions are encrypted and secure."
                },
                {
                    heading: "Payment Processing",
                    content: "Payment is processed at the time of order placement. You will receive an email confirmation once your payment has been successfully processed."
                },
                {
                    heading: "Payment Security",
                    content: "We use industry-standard encryption and security protocols to protect your payment information. We do not store your credit card details on our servers."
                }
            ]
        },
        {
            id: 5,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Terms of Service",
            description: "Rules and guidelines for using our platform",
            sections: [
                {
                    heading: "Account Responsibility",
                    content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
                },
                {
                    heading: "Prohibited Activities",
                    content: "You may not use our service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction when using our service."
                },
                {
                    heading: "Intellectual Property",
                    content: "All content on this website, including text, graphics, logos, and images, is the property of our company and protected by copyright laws."
                }
            ]
        },
        {
            id: 6,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "Warranty Policy",
            description: "Product quality guarantee",
            sections: [
                {
                    heading: "Product Warranty",
                    content: "Most products come with a manufacturer's warranty. Warranty periods vary by product. Please check individual product pages for specific warranty information."
                },
                {
                    heading: "Warranty Claims",
                    content: "To make a warranty claim, contact our customer service with your order number and a description of the issue. We will guide you through the warranty claim process."
                },
                {
                    heading: "Warranty Limitations",
                    content: "Warranties do not cover damage caused by misuse, accidents, or normal wear and tear. Extended warranty options may be available for certain products."
                }
            ]
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Policies</h1>
                        <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                            We believe in transparency. Read our policies to understand how we protect your rights and ensure a great shopping experience.
                        </p>
                    </div>
                </div>

                {/* Policies Grid */}
                <div className="max-w-screen-xl mx-auto px-4 py-12">
                    <div className="grid gap-8">
                        {policies.map((policy) => (
                            <div
                                key={policy.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                            >
                                {/* Policy Header */}
                                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-3 rounded-lg shadow-md text-pink-600">
                                            {policy.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {policy.title}
                                            </h2>
                                            <p className="text-gray-600 mt-1">
                                                {policy.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Policy Content */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {policy.sections.map((section, idx) => (
                                            <div key={idx}>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                    {section.heading}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {section.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="px-6 pb-6">
                                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                        Last updated: {new Date().toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">Have Questions About Our Policies?</h3>
                        <p className="mb-6 opacity-90">
                            Our customer support team is here to help you understand our policies better.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

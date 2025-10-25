import { useState, FormEvent } from "react";
import Navbar from "../components/navigation/navbar";
import Footer from "../components/footer/footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            
            // Clear success message after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: "Visit Us",
            details: ["123 E-Commerce Street", "Shopping District", "New York, NY 10001"],
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: "Call Us",
            details: ["+1 (555) 123-4567", "+1 (555) 987-6543", "Mon-Fri: 9AM - 6PM"],
            color: "from-green-500 to-green-600"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Email Us",
            details: ["support@ecommerce.com", "sales@ecommerce.com", "info@ecommerce.com"],
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Business Hours",
            details: ["Monday - Friday: 9AM - 8PM", "Saturday: 10AM - 6PM", "Sunday: Closed"],
            color: "from-pink-500 to-pink-600"
        }
    ];

    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 days delivery."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for most items. Products must be in original condition."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to select international destinations. Shipping times and costs vary by location."
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
                            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                                Have a question or feedback? We'd love to hear from you. Our team is here to help!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Info Cards */}
                <div className="max-w-screen-xl mx-auto px-4 -mt-8 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className={`bg-gradient-to-r ${info.color} p-4 text-white`}>
                                    <div className="flex items-center justify-center">
                                        {info.icon}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                                        {info.title}
                                    </h3>
                                    <div className="space-y-1 text-center">
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-gray-600 text-sm">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-screen-xl mx-auto px-4 pb-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-pink-100 p-3 rounded-lg">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
                                        <p className="text-gray-600">Fill out the form below and we'll get back to you soon</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="order">Order Support</option>
                                            <option value="product">Product Question</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    {submitStatus === "success" && (
                                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                            <p className="font-medium">Thank you for contacting us!</p>
                                            <p className="text-sm">We'll get back to you within 24 hours.</p>
                                        </div>
                                    )}

                                    {submitStatus === "error" && (
                                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                            <p className="font-medium">Something went wrong!</p>
                                            <p className="text-sm">Please try again later.</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Quick Support */}
                            <div className="bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                    <h3 className="text-xl font-bold">Quick Support</h3>
                                </div>
                                <p className="mb-4 opacity-90">
                                    Need immediate assistance? Our support team is available to help you right away.
                                </p>
                                <button className="w-full bg-white text-pink-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                    Start Live Chat
                                </button>
                            </div>

                            {/* FAQs */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                {faq.question}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="/policies"
                                    className="block text-center mt-4 text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                                >
                                    View All Policies →
                                </a>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gray-200 h-48 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-sm">Map Location</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

"use client";

import Image from "next/image";
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white py-10 px-6 text-center">
                <h1 className="text-4xl md:text-3xl font-bold mb-4">
                    Inventory Management App
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto">
                    Inventory Management App is a modern inventory management solution designed to help businesses track, organize, and optimize their stock efficiently.
                </p>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
                        <p className="text-gray-600">
                            Monitor your inventory in real-time across multiple locations and warehouses.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
                        <p className="text-gray-600">
                            Generate insightful reports on stock movement, sales trends, and low-stock alerts.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2">Multi-User Access</h3>
                        <p className="text-gray-600">
                            Assign roles and permissions to your team for better collaboration and security.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="w-full">
                    <Image
                        src="/dashboard.png"
                        alt="Inventory Dashboard"
                        width={400}
                        height={300}
                        className="rounded-xl shadow-lg"
                    />
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Why Choose Inventory Management App?</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Save time by automating inventory tasks</li>
                        <li>Reduce errors and stock discrepancies</li>
                        <li>Boost efficiency and streamline operations</li>
                        <li>Accessible anywhere, anytime</li>
                    </ul>
                </div>
            </div>

            {/* Team Section */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <h3 className="mt-4 font-semibold">Alice Johnson</h3>
                        <p className="text-gray-600">Product Manager</p>
                    </div>
                    <div className="text-center">
                        <h3 className="mt-4 font-semibold">Christopher Kabwe</h3>
                        <p className="text-gray-600">Lead Developer</p>
                    </div>
                    <div className="text-center">
                        <h3 className="mt-4 font-semibold">Maria Banda</h3>
                        <p className="text-gray-600">UX/UI Designer</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-900 text-white py-16 px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-md mb-8 max-w-xl mx-auto">
                    Start managing your inventory efficiently with Inventory Management App today.
                </p>

                {/* Buttons container */}
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <a
                        href="/sign-up"
                        className="bg-transparent text-white border border-white font-semibold px-8 py-4 rounded-full shadow hover:shadow-lg transition"
                    >
                        Sign Up Now
                    </a>
                    <a
                        href="/sign-in"
                        className="bg-transparent border border-white text-white font-semibold px-8 py-4 rounded-full shadow hover:shadow-lg transition"
                    >
                        Already have an account? Sign In
                    </a>
                </div>
            </section>
        </div>
    );
}

import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";


export const metadata = {
    title: "About Us",
};

export default async function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
            <div className="absolute top-5 right-5 z-50">
                <ThemeToggle />
            </div>
            {/* Hero Section */}
            <section className="text-white">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 mb-5 text-center">
                    <h1 className="w-full text-3xl xl:text-4xl font-bold py-2">
                        Biz360° Business Management
                    </h1>
                    <p className="text-purple-400 p-2 text-center text-lg font-medium">
                        Your Business. One Platform. Full Control.
                    </p>
                </div>
                <div className="max-w-7xl mx-auto bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                    <p className="text-gray-700 dark:text-gray-300 text-lg xl:text-xl max-w-5xl mx-auto">
                        Biz360° is your all-in-one business operating system. Manage sales,
                        inventory, finance, and HR seamlessly while gaining real-time insights
                        and full operational visibility — everything your business
                        needs in one platform.
                    </p>
                    {/* Hero CTA Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/sign-up"
                            className="bg-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow hover:-translate-y-1 hover:bg-purple-700 transition-transform duration-200"
                        >
                            Get Started Free
                        </Link>

                        <Link
                            href="/sign-in"
                            className="bg-gray-100 border border-purple-500 text-purple-400 font-semibold px-8 py-3 rounded-full hover:bg-purple-500 hover:text-white transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section className="py-5 px-5">
                <div className=" max-w-7xl mx-auto">
                    <h2 className="text-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg text-3xl font-bold text-center mb-5">
                        Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Sales Features */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">
                                Sales Features
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Track orders across multiple channels</li>
                                <li>Automate invoicing and billing</li>
                                <li>Monitor customer purchase history</li>
                                <li>Set pricing rules and discounts</li>
                                <li>Generate sales reports in real-time</li>
                            </ul>
                        </div>

                        {/* Inventory Features */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">
                                Inventory Features
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Track stock levels in multiple locations</li>
                                <li>Receive low-stock alerts automatically</li>
                                <li>Manage product variants and SKUs</li>
                                <li>Scan barcodes for faster updates</li>
                                <li>Audit inventory with detailed logs</li>
                            </ul>
                        </div>

                        {/* Human Resource Features */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">
                                Human Resource Features
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Manage employee profiles and roles</li>
                                <li>Track attendance and leave requests</li>
                                <li>Assign permissions and access levels</li>
                                <li>Monitor team performance metrics</li>
                                <li>Generate payroll reports</li>
                            </ul>
                        </div>

                        {/* Accounting Features */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">
                                Accounting Features
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Track income and expenses</li>
                                <li>Generate profit & loss statements</li>
                                <li>Reconcile accounts automatically</li>
                                <li>Monitor cash flow in real-time</li>
                                <li>Export financial statements to PDF/Excel</li>
                            </ul>
                        </div>

                        {/* Finance Features */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">
                                Finance Features
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Budget planning and tracking</li>
                                <li>Forecast revenue and expenses</li>
                                <li>Monitor profit margins per product</li>
                                <li>Integrate with bank accounts</li>
                                <li>Generate financial dashboards and KPIs</li>
                            </ul>
                        </div>

                        {/* Production Features */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">
                                Production Features
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Plan and schedule production tasks</li>
                                <li>Track raw material usage</li>
                                <li>Monitor production progress in real-time</li>
                                <li>Manage machinery and resource allocation</li>
                                <li>Generate production efficiency reports</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-5 px-5">
                <div className=" max-w-7xl mx-auto">
                    <h2 className="text-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg text-3xl font-bold text-center mb-5">
                        Busniness Analyticts
                    </h2>
                    <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-5 justify-center">
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Sales Dashboard</h2>
                            <Image
                                src="/dashboard.png"
                                alt="Inventory Dashboard"
                                width={500}
                                height={500}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Inventory Dashboard</h2>
                            <Image
                                src="/dashboard.png"
                                alt="Inventory Dashboard"
                                width={500}
                                height={500}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Human Resource Dashboard</h2>
                            <Image
                                src="/dashboard.png"
                                alt="Inventory Dashboard"
                                width={500}
                                height={500}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Accounting Dashboard</h2>
                            <Image
                                src="/dashboard.png"
                                alt="Inventory Dashboard"
                                width={500}
                                height={500}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Finance Dashboard</h2>
                            <Image
                                src="/dashboard.png"
                                alt="Inventory Dashboard"
                                width={500}
                                height={500}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Production Dashboard</h2>
                            <Image
                                src="/dashboard.png"
                                alt="Inventory Dashboard"
                                width={500}
                                height={500}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 px-5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg text-3xl font-bold text-center mb-5">
                        About Us
                    </h2>
                    <div className=" grid grid-cols-1 xl:grid-cols-3 gap-5">
                        {/* Why Biz360 */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Why Choose Biz360°?</h2>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Manage your entire business in one platform</li>
                                <li>Save time by automating workflows</li>
                                <li>Reduce errors and improve operational efficiency</li>
                                <li>Access insights anytime, anywhere</li>
                                <li>24/7 Support</li>
                            </ul>
                        </div>
                        {/* Mission & Vision Section */}
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Our Mission</h2>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                To empower growing businesses with a unified platform that streamlines operations,
                                enhances collaboration, and delivers actionable insights for smarter decision-making.
                            </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                            <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Our Vision</h2>
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                To become the leading all-in-one business operating system that transforms how companies
                                manage sales, inventory, finance, and human resources—enabling growth, efficiency, and innovation worldwide.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 px-5">
                <div className="max-w-7xl mx-auto">
                    {/* Team Section */}
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Our Team</h2>
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap- m-5">
                            <div className="text-left">
                                <h3 className="mt-4 font-semibold">Alice Johnson</h3>
                                <p className="text-gray-700 dark:text-gray-300">Product Manager</p>
                                <p className="text-gray-700 dark:text-gray-300">alicejohnson@biz360.com</p>
                                <p className="text-gray-700 dark:text-gray-300">+260978370871</p>
                            </div>
                            <div className="text-left">
                                <h3 className="mt-4 font-semibold">Christopher Kabwe</h3>
                                <p className="text-gray-700 dark:text-gray-300">Lead Developer</p>
                                <p className="text-gray-700 dark:text-gray-300">christopherkabwe@biz360.com</p>
                                <p className="text-gray-700 dark:text-gray-300">+260978370871</p>
                            </div>
                            <div className="text-left">
                                <h3 className="mt-4 font-semibold">Chloe Bwalya</h3>
                                <p className="text-gray-700 dark:text-gray-300">UX/UI Designer</p>
                                <p className="text-gray-700 dark:text-gray-300">chloeBwalya@biz360.com</p>
                                <p className="text-gray-700 dark:text-gray-300">+260978370871</p>
                            </div>
                            <div className="text-left">
                                <h3 className="mt-4 font-semibold">Michaela Pratt</h3>
                                <p className="text-gray-700 dark:text-gray-300">UX/UI Designer</p>
                                <p className="text-gray-700 dark:text-gray-300">michaelapratt@biz360.com</p>
                                <p className="text-gray-700 dark:text-gray-300">+260978370871</p>
                            </div>
                        </div>
                    </div>
                    {/* Contact Us Section */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 mt-5 mb-5 hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg font-semibold mb-2">Contact Us</h2>
                        <p className="text-gray-700 dark:text-gray-300 text-center mb-5">
                            Do you have any questions or want to learn more about Biz360°? Reach out to our team, and we will be happy to get back to you promptly.
                        </p>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 m-5" >
                            {/* Email */}
                            <div className="text-center border rounded-lg border-gray-300 px-5 py-5">
                                <p className="font-semibold mb-2">Email</p>
                                <p className="text-gray-700 dark:text-gray-300">support@biz360.com</p>
                            </div>

                            {/* Phone */}
                            <div className="text-center border rounded-lg border-gray-300 px-5 py-5">
                                <p className="font-semibold mb-2">Phone</p>
                                <p className="text-gray-700 dark:text-gray-300">+260 978 370 871</p>
                            </div>

                            {/* Address */}
                            <div className="text-center border rounded-lg border-gray-300 px-5 py-5">
                                <p className="font-semibold mb-2">Address</p>
                                <p className="text-gray-700 dark:text-gray-300">123 Business St., Lusaka, Zambia</p>
                            </div>
                        </div>
                        {/* Optional Contact Form */}
                        <div >
                            <form className="gap-5">
                                <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 p-5">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="py-5 px-5 w-full h-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 hover:border-purple-600 hover:shadow-sm transition"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="py-5 px-5 w-full h-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 hover:border-purple-600 hover:shadow-sm transition"
                                    />
                                    <textarea
                                        placeholder="Your Message"
                                        className="py-5 px-5 w-full h-30 col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 hover:border-purple-600 hover:shadow-sm transition"
                                        rows={5}
                                    ></textarea>

                                </div>
                                <div className="col-span-full flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-purple-600 text-white px-2 py-2 mr-5 rounded-lg font-semibold hover:bg-purple-700 transition"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section >
            {/* Call to Action */}
            < section className="py-5 px-5" >
                <div className="py-5 px-5 bg-gray-100 dark:bg-gray-800 text-center max-w-7xl mx-auto rounded-lg hover:shadow-lg transition-shadow duration-200 ">
                    <h2 className="text-3xl xl:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        Ready to Get Started?
                    </h2>
                    <p className="text-md mb-5 text-center mx-auto text-gray-700 dark:text-gray-300">
                        Start managing your entire business—sales, inventory, finance, and people—with Biz360° today.
                    </p>

                    {/* Buttons container */}
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <a
                            href="/sign-up"
                            className="bg-purple-600 text-white text-center font-semibold px-8 py-4 rounded-full shadow hover:bg-purple-700 transition-transform duration-200"
                        >
                            Sign Up Now
                        </a>

                        <a
                            href="/sign-in"
                            className="bg-purple-500/10 text-purple-600 dark:bg-purple-700/20 dark:text-purple-300 border border-purple-500 dark:border-purple-500 font-semibold px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white transition"
                        >
                            Already have an account? Sign In
                        </a>
                    </div>
                </div>
            </section >
            <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-8 mt-10">
                <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <h3 className="text-white font-semibold mb-2">Biz360°</h3>
                        <p className="text-sm">
                            An all-in-one business operating system for growing companies.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Product</h4>
                        <ul className="space-y-1 text-sm">
                            <li>Sales</li>
                            <li>Inventory</li>
                            <li>Finance</li>
                            <li>HR</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Legal</h4>
                        <ul className="space-y-1 text-sm">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Contact</li>
                        </ul>
                    </div>

                </div>

                <p className="text-center text-xs mt-6 text-white">
                    © {new Date().getFullYear()} Biz360°. All rights reserved.
                </p>
            </footer>
        </div >
    );
}

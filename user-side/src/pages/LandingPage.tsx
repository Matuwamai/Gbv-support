import { FaHandsHelping } from "react-icons/fa";
import banner from "../assets/gvb.webp"
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <header className="bg-purple-600 text-white py-20 text-center flex flex-col items-center">
                <div className="mt-6 space-x-4">
                    <button className="bg-white text-purple-600 px-6 py-3 text-lg rounded-sm text-xl font-semibold" onClick={() => window.location.href = '/signup'}>
                        Get Started
                    </button>
                    <button className="bg-white text-purple-600 px-6 py-3 text-lg rounded-sm text-xl font-semibold" onClick={() => window.location.href = '/login'}>
                        Login
                    </button>
                </div>
                <FaHandsHelping className="text-6xl mb-4" />
                <div className="container mx-auto px-6 md:px-12">
                    <h1 className="text-4xl md:text-6xl font-bold">Gender Based Violence</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Join us in the fight against gender-based violence. Share experiences, find  and create change.
                    </p>

                </div>
            </header>
            <section
                className="relative py-32 px-6 md:px-12 text-center bg-gray-300 bg-cover bg-center min-h-[80vh]"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 container mx-auto text-white">
                    <h2 className="text-3xl md:text-4xl text-gray-300 font-semibold">About Us</h2>
                    <p className="mt-4 text-lg md:text-xl font-semibold text-gray-300 max-w-3xl mx-auto">
                        GBV Support is designed to provide a safe space where individuals can share their experiences,
                        seek help, and connect with supportive communities. Our mission is to empower victims and raise awareness
                        to combat gender-based violence through real stories, resources, and direct connections to relevant authorities.
                    </p>
                </div>
            </section>
            <section className="py-16 px-6 md:px-12 bg-gray-200">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold text-purple-600">What We Offer</h2>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white shadow-lg rounded-xl">
                            <h3 className="text-2xl font-bold text-purple-600">Community Support</h3>
                            <p className="mt-3 text-gray-700">
                                Connect with others, share stories, and build a support network with like-minded individuals.
                            </p>
                        </div>
                        <div className="p-6 bg-white shadow-md rounded-xl">
                            <h3 className="text-2xl font-bold text-purple-600">Emergency Assistance</h3>
                            <p className="mt-3 text-gray-900">
                                Directly contact authorities, shelters, and legal aid services for immediate support.
                            </p>
                        </div>
                        <div className="p-6 bg-white shadow-lg rounded-xl">
                            <h3 className="text-2xl font-bold text-purple-600">Create Awareness</h3>
                            <p className="mt-3 text-gray-900">
                                Spread knowledge and educate communities on gender-based violence through stories, campaigns, and advocacy.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
            <section className="py-16 bg-purple-600 text-white text-center">
                <h2 className="text-3xl md:text-4xl font-semibold">Join the Movement</h2>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                    Stand with us in making a difference. Register today to be part of a supportive and proactive community.
                </p>
                <div className="mt-6  rounded-sm text-xl font-semibold">
                    <button className="bg-secondary px-6 py-3 text-lg" onClick={() => window.location.href = '/signup'}>
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
}

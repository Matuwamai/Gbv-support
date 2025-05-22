import { FaHandsHelping, FaUsers, FaPhoneAlt, FaBullhorn } from "react-icons/fa";
import banner from "../assets/gvb.webp";
import supportImg from "../assets/emergency-call.jpg"; // Add this image to your assets
import emergencyImg from "../assets/emergency-call-vector.webp";   // Add this image to your assets
import awarenessImg from "../assets/emergency-call.jpg";   // Add this image to your assets
import AwarenessEducationPage from "./AwarenessEducationPage"; // Import the AwarenessEducationPage component
import EducationalSection from "../components/EducationSection"; // Import the EducationalSection component

export default function LandingPage() {
    return (
      <div className='min-h-screen bg-gradient-to-b from-purple-100 via-gray-100 to-white text-gray-900'>
        {/* Hero Section */}
        <header className='relative bg-purple-700 text-white py-24 flex flex-col items-center justify-center overflow-hidden'>
          <img
            src={banner}
            alt='Gender Based Violence Awareness'
            className='absolute inset-0 w-full h-full object-cover opacity-30'
          />
          <div className='relative z-10 flex flex-col items-center'>
            <FaHandsHelping className='text-7xl mb-6 drop-shadow-lg' />
            <h1 className='text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg'>
              End Gender Based Violence
            </h1>
            <p className='mt-2 text-xl md:text-2xl max-w-2xl text-center font-medium drop-shadow'>
              A safe space to share, seek help, and empower each other.
              Together, we can make a difference.
            </p>
            <div className='mt-8 flex gap-4'>
              <button
                className='bg-white text-purple-700 px-8 py-3 rounded-full text-xl font-bold shadow-md hover:bg-purple-100 transition'
                onClick={() => (window.location.href = "/signup")}>
                Get Started
              </button>
              <button
                className='bg-purple-900 text-white px-8 py-3 rounded-full text-xl font-bold shadow-md hover:bg-purple-800 transition'
                onClick={() => (window.location.href = "/login")}>
                Login
              </button>
            </div>
          </div>
        </header>

        {/* About Section */}
        <section className='py-20 px-6 md:px-12 bg-white text-center'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-4xl md:text-5xl font-bold text-purple-700 mb-6'>
              About Us
            </h2>
            <p className='text-lg md:text-xl text-gray-700 mb-8'>
              <span className='font-semibold text-purple-700'>GBV Support</span>{" "}
              is dedicated to providing a safe, supportive, and empowering
              environment for survivors and allies. We connect individuals to
              resources, foster community, and raise awareness to combat
              gender-based violence in all its forms.
            </p>
            <img
              src={supportImg}
              alt='Support Group'
              className='rounded-xl shadow-lg mx-auto w-full max-w-2xl'
            />
          </div>
        </section>

        {/* What We Offer */}
        <section className='py-20 px-6 md:px-12 bg-gray-100'>
          <div className='container mx-auto text-center'>
            <h2 className='text-4xl md:text-5xl font-bold text-purple-700 mb-10'>
              What We Offer
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
              {/* Community Support */}
              <div className='bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center'>
                <FaUsers className='text-5xl text-purple-600 mb-4' />
                <img
                  src={supportImg}
                  alt='Community Support'
                  className='w-32 h-32 object-cover rounded-full mb-4 shadow'
                />
                <h3 className='text-2xl font-bold text-purple-700 mb-2'>
                  Community Support
                </h3>
                <p className='text-gray-700'>
                  Connect with others, share your story, and find strength in a
                  compassionate community that listens and cares.
                </p>
              </div>
              {/* Emergency Assistance */}
              <div className='bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center'>
                <FaPhoneAlt className='text-5xl text-red-500 mb-4' />
                <img
                  src={emergencyImg}
                  alt='Emergency Assistance'
                  className='w-32 h-32 object-cover rounded-full mb-4 shadow'
                />
                <h3 className='text-2xl font-bold text-red-500 mb-2'>
                  Emergency Assistance
                </h3>
                <p className='text-gray-700'>
                  Access immediate help: contact authorities, shelters, and
                  legal aid services 24/7 for urgent support.
                </p>
              </div>
              {/* Awareness & Advocacy */}
              <div className='bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center'>
                <FaBullhorn className='text-5xl text-yellow-500 mb-4' />
                <img
                  src={awarenessImg}
                  alt='Awareness'
                  className='w-32 h-32 object-cover rounded-full mb-4 shadow'
                />
                <h3 className='text-2xl font-bold text-yellow-600 mb-2'>
                  Create Awareness
                </h3>
                <p className='text-gray-700'>
                  Learn, share, and advocate. Help us educate communities and
                  drive change through campaigns and real stories.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className='py-20 bg-gradient-to-r from-purple-700 to-purple-500 text-white text-center'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4'>
            Join the Movement
          </h2>
          <p className='mt-2 text-lg md:text-2xl max-w-3xl mx-auto mb-8'>
            Stand with survivors. Be part of a proactive, supportive community.
            Register today and help us end gender-based violence.
          </p>
          <button
            className='bg-white text-purple-700 px-10 py-4 rounded-full text-2xl font-bold shadow-lg hover:bg-purple-100 transition'
            onClick={() => (window.location.href = "/signup")}>
            Get Started
          </button>
        </section>
        <EducationalSection />
        <AwarenessEducationPage />
      </div>
    );
}

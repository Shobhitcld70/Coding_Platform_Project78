import { Link } from 'react-router-dom';
import { Code2, Users, Trophy, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Coders to Collaborate and Conquer Challenges!
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Join VIT Bhopal's premier coding community platform
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Join Now
              </Link>
              <Link
                to="/learn-more"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Code2 className="h-8 w-8" />}
              title="Share Code"
              description="Upload and showcase your coding solutions with peers"
              link="/code-sharing"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Discussions"
              description="Engage in meaningful coding discussions and problem-solving"
              link="/discussions"
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Leaderboard"
              description="Compete and earn recognition for your contributions"
              link="/leaderboard"
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Learn"
              description="Access resources and learn from the community"
              link="/learn-more"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="VIT Code Hub helped me improve my coding skills and connect with like-minded peers."
              author="Priya Sharma"
              role="Computer Science, 3rd Year"
            />
            <TestimonialCard
              quote="The platform's collaborative environment made learning Data Structures much easier."
              author="Rahul Verma"
              role="Information Technology, 2nd Year"
            />
            <TestimonialCard
              quote="I found great mentors and friends through the discussion forums."
              author="Aisha Patel"
              role="Computer Science, 4th Year"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <Link to={link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"{quote}"</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  );
}
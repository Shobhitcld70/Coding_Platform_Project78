import { Code2, Users, Trophy, BookOpen, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LearnMorePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn, Share, and Grow Together
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover all the features that make VIT Code Hub the perfect platform for coding enthusiasts
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FeatureCard
              icon={<MessageSquare className="h-12 w-12 text-blue-600" />}
              title="Interactive Discussions"
              description="Engage in meaningful discussions about programming concepts, debug issues together, and share knowledge with peers."
            />
            <FeatureCard
              icon={<Code2 className="h-12 w-12 text-blue-600" />}
              title="Code Sharing"
              description="Share your code snippets, get feedback from the community, and learn from others' implementations."
            />
            <FeatureCard
              icon={<Trophy className="h-12 w-12 text-blue-600" />}
              title="Recognition System"
              description="Earn points and badges for your contributions. Climb the leaderboard and showcase your expertise."
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 text-blue-600" />}
              title="Community Support"
              description="Connect with fellow students, find mentors, and build a network of like-minded programmers."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create an Account"
              description="Sign up with your email or GitHub account to join the community."
            />
            <StepCard
              number="2"
              title="Start Participating"
              description="Ask questions, share code, or help others with their programming challenges."
            />
            <StepCard
              number="3"
              title="Grow Together"
              description="Earn recognition, build your portfolio, and improve your coding skills."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Join the Community?</h2>
          <Link
            to="/signup"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
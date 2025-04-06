import { Heart, Users, MessageSquare, Shield, AlertTriangle, Award } from 'lucide-react';

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Code of Conduct</h1>
            
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Our Pledge</h2>
                </div>
                <p className="text-gray-600">
                  In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Expected Behavior</h2>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Be respectful and inclusive of differing viewpoints and experiences</li>
                  <li>Give and gracefully accept constructive feedback</li>
                  <li>Focus on what is best for the community</li>
                  <li>Show empathy towards other community members</li>
                  <li>Use welcoming and inclusive language</li>
                  <li>Be collaborative and supportive</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Unacceptable Behavior</h2>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Harassment of any participants in any form</li>
                  <li>Deliberate intimidation, stalking, or following</li>
                  <li>Violent threats or language directed against another person</li>
                  <li>Discriminatory jokes and language</li>
                  <li>Posting sexually explicit or violent material</li>
                  <li>Posting (or threatening to post) other people's personally identifying information</li>
                  <li>Personal insults, especially those using racist or sexist terms</li>
                  <li>Unwelcome sexual attention</li>
                  <li>Advocating for, or encouraging, any of the above behavior</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Communication Guidelines</h2>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Use clear and professional language</li>
                  <li>Be patient with new members</li>
                  <li>Stay on topic in discussions</li>
                  <li>Accept different opinions and perspectives</li>
                  <li>Think twice before posting</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Reporting Guidelines</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>
                    If you experience or witness unacceptable behavior, or have any other concerns, please report it by contacting the administrators. All reports will be handled with discretion.
                  </p>
                  <p>
                    In your report please include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your contact information</li>
                    <li>Names (real, nicknames, or pseudonyms) of any individuals involved</li>
                    <li>Description of the behavior</li>
                    <li>Additional context or evidence if available</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Enforcement</h2>
                </div>
                <p className="text-gray-600">
                  Violations of this Code of Conduct may result in temporary or permanent restrictions from the VIT Code Hub community. Enforcement decisions will be made by the administration team and will be final.
                </p>
              </section>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">Last Updated: March 15, 2024</p>
                <p className="text-sm text-gray-500 mt-2">
                  This Code of Conduct is adapted from the Contributor Covenant, version 2.0.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
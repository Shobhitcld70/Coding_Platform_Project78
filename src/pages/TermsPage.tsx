import { Scale, Shield, Users, AlertTriangle, FileText, Trash2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Acceptance of Terms</h2>
                </div>
                <p className="text-gray-600">
                  By accessing and using VIT Code Hub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">User Accounts</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>When creating an account on VIT Code Hub, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized access</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Content Guidelines</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>When sharing content on VIT Code Hub, you must:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Respect intellectual property rights</li>
                    <li>Only share code you have the right to distribute</li>
                    <li>Provide appropriate attribution when required</li>
                    <li>Not share malicious code or harmful content</li>
                    <li>Not plagiarize or misrepresent others' work</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Intellectual Property</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>
                    By posting content on VIT Code Hub, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly display, and distribute your content on our platform. You retain all ownership rights to your content.
                  </p>
                  <p>
                    You are responsible for ensuring that you have the necessary rights to share any content you post on the platform.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Prohibited Activities</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>The following activities are strictly prohibited:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Harassment or bullying of other users</li>
                    <li>Posting inappropriate or offensive content</li>
                    <li>Attempting to gain unauthorized access</li>
                    <li>Interfering with platform functionality</li>
                    <li>Creating multiple accounts for deceptive purposes</li>
                    <li>Sharing malware or malicious code</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Termination</h2>
                </div>
                <p className="text-gray-600">
                  We reserve the right to terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
                </p>
              </section>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">Last Updated: March 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
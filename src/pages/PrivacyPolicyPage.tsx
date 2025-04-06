import { Shield, Lock, Eye, UserCheck, Database, Bell } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We collect information that you provide directly to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Create an account</li>
                  <li>Share code snippets</li>
                  <li>Participate in discussions</li>
                  <li>Upload profile information</li>
                  <li>Interact with other users</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">How We Protect Your Data</h2>
                </div>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage practices</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Data Usage</h2>
                </div>
                <p className="text-gray-600">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-4">
                  <li>Provide and improve our services</li>
                  <li>Personalize your experience</li>
                  <li>Communicate with you about updates and features</li>
                  <li>Ensure platform security and prevent abuse</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
                </div>
                <p className="text-gray-600">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Data Retention</h2>
                </div>
                <p className="text-gray-600">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. When we no longer need to use your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Updates to This Policy</h2>
                </div>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date below.
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
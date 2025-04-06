import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { checkSupabaseConnection } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DiscussionsPage from './pages/DiscussionsPage';
import CodeSharingPage from './pages/CodeSharingPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LearnMorePage from './pages/LearnMorePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CodeOfConductPage from './pages/CodeOfConductPage';
import AIAssistant from './components/ai/AIAssistant';

function App() {
  const initialize = useAuthStore(state => state.initialize);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check Supabase connection
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          setConnectionError(true);
          return;
        }

        // Initialize auth
        await initialize();
      } catch (error) {
        console.error('Error initializing app:', error);
        setConnectionError(true);
      }
    };

    initializeApp();
  }, [initialize]);

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
          <p className="text-gray-600 mb-4">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/discussions" element={<DiscussionsPage />} />
            <Route path="/code-sharing" element={<CodeSharingPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/code-of-conduct" element={<CodeOfConductPage />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;
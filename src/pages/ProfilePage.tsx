import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, Save, AlertCircle, Github, Twitter, Linkedin } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import UserPointsCard from '../components/profile/UserPointsCard';

interface Profile {
  full_name: string;
  email: string;
  avatar_url: string | null;
}

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ProfilePage() {
  const { user, initialize, linkSocialAccount, unlinkSocialAccount } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    avatar_url: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState({
    github: false,
    twitter: false,
    linkedin: false
  });
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'points'>('profile');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // First try to fetch the existing profile
        let { data, error } = await supabase
          .from('users')
          .select('full_name, email, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          // If profile doesn't exist, create one
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  full_name: user.user_metadata?.full_name || '',
                }
              ])
              .select()
              .single();

            if (insertError) throw insertError;
            data = newProfile;
          } else {
            throw error;
          }
        }

        if (data) {
          setProfile(data);
        }

        // Check linked accounts
        setLinkedAccounts({
          github: Boolean(user.app_metadata?.provider === 'github' || user.app_metadata?.providers?.includes('github')),
          twitter: Boolean(user.app_metadata?.provider === 'twitter' || user.app_metadata?.providers?.includes('twitter')),
          linkedin: Boolean(user.app_metadata?.provider === 'linkedin' || user.app_metadata?.providers?.includes('linkedin'))
        });
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Reset states
    setError(null);
    setSuccessMessage(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsSaving(true);

    try {
      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from(AVATAR_BUCKET)
            .remove([oldFileName]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(fileName);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update auth metadata with new avatar URL
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (metadataError) throw metadataError;

      // Refresh the auth store to update the UI
      await initialize();

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      setSuccessMessage('Profile picture updated successfully');
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: profile.full_name }
      });

      if (updateError) throw updateError;

      // Refresh the auth store to update the UI
      await initialize();

      setSuccessMessage('Profile updated successfully');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkAccount = async (provider: 'github' | 'twitter' | 'linkedin') => {
    try {
      await linkSocialAccount(provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUnlinkAccount = async (provider: 'github' | 'twitter' | 'linkedin') => {
    if (!unlinkPassword) {
      setError('Please enter your password to unlink account');
      return;
    }

    try {
      await unlinkSocialAccount(provider, unlinkPassword);
      setLinkedAccounts(prev => ({ ...prev, [provider]: false }));
      setUnlinkPassword('');
      setShowUnlinkConfirm(null);
      navigate('/signin'); // Redirect to sign in page after unlinking
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <img
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`}
                alt={profile.full_name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
              >
                <Camera className="h-4 w-4" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('points')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'points'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Points & Achievements
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}

        {activeTab === 'profile' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Github className="h-6 w-6" />
                        <span className="font-medium">GitHub</span>
                      </div>
                      {linkedAccounts.github ? (
                        showUnlinkConfirm === 'github' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              placeholder="Enter password"
                              value={unlinkPassword}
                              onChange={(e) => setUnlinkPassword(e.target.value)}
                              className="px-3 py-1 border rounded"
                            />
                            <button
                              onClick={() => handleUnlinkAccount('github')}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setShowUnlinkConfirm(null);
                                setUnlinkPassword('');
                              }}
                              className="text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowUnlinkConfirm('github')}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Unlink
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleLinkAccount('github')}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Connect
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Twitter className="h-6 w-6" />
                        <span className="font-medium">Twitter</span>
                      </div>
                      {linkedAccounts.twitter ? (
                        showUnlinkConfirm === 'twitter' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              placeholder="Enter password"
                              value={unlinkPassword}
                              onChange={(e) => setUnlinkPassword(e.target.value)}
                              className="px-3 py-1 border rounded"
                            />
                            <button
                              onClick={() => handleUnlinkAccount('twitter')}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setShowUnlinkConfirm(null);
                                setUnlinkPassword('');
                              }}
                              className="text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowUnlinkConfirm('twitter')}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Unlink
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleLinkAccount('twitter')}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Connect
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Linkedin className="h-6 w-6" />
                        <span className="font-medium">LinkedIn</span>
                      </div>
                      {linkedAccounts.linkedin ? (
                        showUnlinkConfirm === 'linkedin' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              placeholder="Enter password"
                              value={unlinkPassword}
                              onChange={(e) => setUnlinkPassword(e.target.value)}
                              className="px-3 py-1 border rounded"
                            />
                            <button
                              onClick={() => handleUnlinkAccount('linkedin')}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setShowUnlinkConfirm(null);
                                setUnlinkPassword('');
                              }}
                              className="text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowUnlinkConfirm('linkedin')}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Unlink
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleLinkAccount('linkedin')}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          user && <UserPointsCard userId={user.id} />
        )}
      </div>
    </div>
  );
}
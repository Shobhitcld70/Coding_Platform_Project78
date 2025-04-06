import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, Code, MessageSquare, Loader2, AlertCircle, ChevronUp, ChevronDown, Copy, Check } from 'lucide-react';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useAuthStore } from '../stores/authStore';
import type { LeaderboardUser } from '../types';

export default function LeaderboardPage() {
  const { users, loading, error, fetchLeaderboard } = useLeaderboardStore();
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (users.length > 0) {
      setTopUsers(users.slice(0, 3));
    }
  }, [users]);

  const toggleUserDetails = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const formatActionType = (actionType: string): string => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Error Loading Leaderboard</h2>
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => fetchLeaderboard()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Leaderboard</h1>
          <p className="text-gray-600">Top contributors in the VIT Code Hub community</p>
        </div>

        {/* Top 3 Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {topUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition ${
                user.rank === 1 ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="relative inline-block">
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`}
                  alt={user.full_name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                {user.rank === 1 && (
                  <Trophy className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400" />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">{user.full_name}</h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-3xl font-bold text-blue-600">{user.points}</p>
                <p className="text-gray-500">points</p>
              </div>
              <p className="text-sm text-gray-500 mb-3">Level {user.level}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {user.badges && user.badges.slice(0, 3).map((badge) => (
                  <span
                    key={badge.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-1"
                    title={badge.description}
                  >
                    <Award className="h-4 w-4" />
                    {badge.name}
                  </span>
                ))}
                {user.badges && user.badges.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    +{user.badges.length - 3} more
                  </span>
                )}
              </div>
              <div className="flex justify-center gap-4 text-gray-600">
                <div className="flex items-center gap-1" title="Code Snippets">
                  <Code className="h-4 w-4" />
                  <span>{user.snippets_count}</span>
                </div>
                <div className="flex items-center gap-1" title="Comments">
                  <MessageSquare className="h-4 w-4" />
                  <span>{user.comments_count}</span>
                </div>
                <div className="flex items-center gap-1" title="Badges">
                  <Award className="h-4 w-4" />
                  <span>{user.badges_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Contributors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contributions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badges
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((leaderboardUser) => (
                  <React.Fragment key={leaderboardUser.id}>
                    <tr 
                      className={`${
                        user && leaderboardUser.id === user.id ? 'bg-blue-50' : ''
                      } hover:bg-gray-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {leaderboardUser.rank <= 3 ? (
                            <div className={`
                              flex items-center justify-center w-8 h-8 rounded-full 
                              ${leaderboardUser.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
                                leaderboardUser.rank === 2 ? 'bg-gray-100 text-gray-600' : 
                                'bg-amber-100 text-amber-600'}
                            `}>
                              {leaderboardUser.rank}
                            </div>
                          ) : (
                            <div className="text-gray-900 font-medium">#{leaderboardUser.rank}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={leaderboardUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(leaderboardUser.full_name)}&background=random`}
                            alt={leaderboardUser.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {leaderboardUser.full_name}
                              {user && leaderboardUser.id === user.id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">Level {leaderboardUser.level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{leaderboardUser.points} points</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1" title="Code Snippets">
                            <Code className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{leaderboardUser.snippets_count}</span>
                          </div>
                          <div className="flex items-center gap-1" title="Comments">
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{leaderboardUser.comments_count}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {leaderboardUser.badges && leaderboardUser.badges.slice(0, 3).map((badge) => (
                            <div 
                              key={badge.id} 
                              className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"
                              title={badge.name}
                            >
                              <img 
                                src={badge.image_url} 
                                alt={badge.name} 
                                className="w-4 h-4"
                              />
                            </div>
                          ))}
                          {leaderboardUser.badges && leaderboardUser.badges.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600" title="More badges">
                              +{leaderboardUser.badges.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleUserDetails(leaderboardUser.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedUser === leaderboardUser.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedUser === leaderboardUser.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-2">All Badges</h3>
                              <div className="flex flex-wrap gap-2">
                                {leaderboardUser.badges && leaderboardUser.badges.length > 0 ? (
                                  leaderboardUser.badges.map((badge) => (
                                    <div
                                      key={badge.id}
                                      className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm"
                                    >
                                      <img 
                                        src={badge.image_url} 
                                        alt={badge.name} 
                                        className="w-5 h-5"
                                      />
                                      <span className="text-sm font-medium">{badge.name}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">No badges earned yet</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-2">Progress</h3>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Level {leaderboardUser.level}</span>
                                    <span>Level {leaderboardUser.level + 1}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-blue-600 h-2.5 rounded-full" 
                                      style={{ width: `${leaderboardUser.points % 100}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {leaderboardUser.points % 100}/100 points to next level
                                  </p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Code className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {leaderboardUser.snippets_count} code snippets shared
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {leaderboardUser.comments_count} comments
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How Points Work Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">How Points Work</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Code Sharing</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between">
                    <span>Share a code snippet</span>
                    <span className="font-medium">+20 points</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Code quality bonus</span>
                    <span className="font-medium">up to +30 points</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Receive a like on your code</span>
                    <span className="font-medium">+5 points</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Community Participation</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between">
                    <span>Post a comment</span>
                    <span className="font-medium">+5 points</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Receive a like on your comment</span>
                    <span className="font-medium">+2 points</span>
                  </li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Badges & Levels</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between">
                    <span>Level up</span>
                    <span className="font-medium">every 100 points</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Earn badges</span>
                    <span className="font-medium">based on achievements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
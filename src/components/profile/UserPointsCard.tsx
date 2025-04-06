import { useState, useEffect } from 'react';
import { Trophy, Award, Star, ArrowUp, ArrowDown, Clock, Code, MessageSquare, ThumbsUp, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useLeaderboardStore } from '../../stores/leaderboardStore';
import type { Badge, PointTransaction } from '../../types';

interface UserPointsCardProps {
  userId: string;
}

export default function UserPointsCard({ userId }: UserPointsCardProps) {
  const { 
    userPoints, 
    userLevel, 
    userBadges, 
    userTransactions,
    loading, 
    error,
    fetchUserStats,
    fetchUserTransactions
  } = useLeaderboardStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'history'>('overview');

  useEffect(() => {
    fetchUserStats(userId);
    fetchUserTransactions(userId);
  }, [userId, fetchUserStats, fetchUserTransactions]);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'code_snippet_created':
        return <Code className="h-4 w-4 text-blue-500" />;
      case 'code_snippet_liked':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'comment_created':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'comment_liked':
        return <ThumbsUp className="h-4 w-4 text-pink-500" />;
      case 'badge_earned':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'level_up':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'code_quality_bonus':
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatActionType = (actionType: string): string => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Error Loading User Stats</h2>
        </div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => {
            fetchUserStats(userId);
            fetchUserTransactions(userId);
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Points & Achievements</h2>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-bold">Level {userLevel}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Points</span>
                  <span className="text-2xl font-bold text-blue-600">{userPoints}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${userPoints % 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Level {userLevel}</span>
                  <span>{userPoints % 100}/100 to Level {userLevel + 1}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Code Sharing</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Share code</span>
                      <span className="font-medium text-green-600">+20 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quality bonus</span>
                      <span className="font-medium text-green-600">+30 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Receive like</span>
                      <span className="font-medium text-green-600">+5 pts</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Community</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Comment</span>
                      <span className="font-medium text-green-600">+5 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Receive like</span>
                      <span className="font-medium text-green-600">+2 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Earn badge</span>
                      <span className="font-medium text-green-600">+50 pts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Badges Earned</h3>
              {userBadges && userBadges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {userBadges.slice(0, 4).map((badge: Badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No badges earned yet</p>
                  <p className="text-sm text-gray-400 mt-1">Keep contributing to earn badges!</p>
                </div>
              )}
              {userBadges && userBadges.length > 4 && (
                <button
                  onClick={() => setActiveTab('badges')}
                  className="mt-4 text-blue-600 text-sm hover:text-blue-800"
                >
                  View all badges
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'badges'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Badges
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Points History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                {userTransactions && userTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {userTransactions.slice(0, 5).map((transaction: PointTransaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getActionIcon(transaction.action_type)}
                          <span>{formatActionType(transaction.action_type)}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          <span className="font-medium">{transaction.amount > 0 ? '+' : ''}{transaction.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400 mt-1">Your recent point transactions will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <h3 className="text-lg font-medium mb-4">All Badges</h3>
              {userBadges && userBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userBadges.map((badge: Badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Award className="h-7 w-7 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-sm text-gray-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No badges earned yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Badges are awarded for various achievements like sharing code, receiving likes, and more.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Points History</h3>
              {userTransactions && userTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userTransactions.map(transaction => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getActionIcon(transaction.action_type)}
                              <span className="text-sm text-gray-900">
                                {formatActionType(transaction.action_type)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={`flex items-center gap-1 text-sm ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              <span className="font-medium">{transaction.amount > 0 ? '+' : ''}{transaction.amount}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm text-gray-500">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No point activity yet</p>
                  <p className="text-sm mt-2">Start contributing to earn points!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
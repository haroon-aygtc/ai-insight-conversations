import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityLog as ActivityLogType, authService } from '@/services/auth';
import { formatDistanceToNow } from 'date-fns';
import { Search, Filter, Download, RefreshCw, Eye, AlertCircle, Monitor, Smartphone } from 'lucide-react';

export const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await authService.getActivityLogs();
      setLogs(response.logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <Monitor className="h-4 w-4" />;
      case 'logout':
        return <Eye className="h-4 w-4" />;
      case 'register':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'logout':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'register':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'password_change':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'profile_update':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || log.action.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Activity Log
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value="all">All Activities</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="register">Register</option>
              <option value="password_change">Password Change</option>
              <option value="profile_update">Profile Update</option>
            </select>
          </div>

          {/* Activity List */}
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || filterType !== 'all' ? 'No activities match your filters' : 'No activity logs available'}
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${getActionBadgeColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <time className="text-xs text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </time>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {log.details}
                    </p>
                    {log.ip_address && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          IP: {log.ip_address}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination could be added here */}
          {filteredLogs.length > 0 && (
            <div className="flex justify-center pt-4">
              <p className="text-sm text-gray-500">
                Showing {filteredLogs.length} of {logs.length} activities
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

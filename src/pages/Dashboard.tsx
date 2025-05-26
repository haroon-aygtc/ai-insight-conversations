
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, BrainCircuit, ArrowUp, Play, Plus } from 'lucide-react';

// Mock data for charts
const messagesData = [
  { name: 'Mon', value: 420 },
  { name: 'Tue', value: 380 },
  { name: 'Wed', value: 510 },
  { name: 'Thu', value: 470 },
  { name: 'Fri', value: 590 },
  { name: 'Sat', value: 350 },
  { name: 'Sun', value: 320 },
];

const usersData = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 49 },
  { name: 'Thu', value: 63 },
  { name: 'Fri', value: 71 },
  { name: 'Sat', value: 39 },
  { name: 'Sun', value: 36 },
];

const activityData = [
  { id: 1, user: 'Ahmed M.', action: 'Updated AI model settings', time: '12 min ago' },
  { id: 2, user: 'Sarah K.', action: 'Uploaded new knowledge base document', time: '34 min ago' },
  { id: 3, user: 'Omar T.', action: 'Modified response templates', time: '1 hour ago' },
  { id: 4, user: 'Leila A.', action: 'Changed branding settings', time: '2 hours ago' },
  { id: 5, user: 'Khalid Z.', action: 'Added new user account', time: '3 hours ago' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your AI chat system and recent activities.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Play className="mr-2 h-4 w-4" />
            View Live Chat
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Configuration
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">8,942</div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">2,845</div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">8%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">95.2%</div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <BrainCircuit className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">2.1%</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Messages Processed</CardTitle>
            <CardDescription>
              Last 7 days of AI message processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={messagesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>
              User registrations over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--primary)' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest system changes and admin actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityData.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="bg-primary/10 text-primary rounded-full p-2 mr-4">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.user}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.action}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

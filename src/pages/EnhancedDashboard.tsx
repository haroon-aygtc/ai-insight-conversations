
import React from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  MessageSquare, 
  Users, 
  BrainCircuit, 
  ArrowUp, 
  ArrowDown,
  Play, 
  Plus, 
  TrendingUp,
  Activity,
  Globe,
  Zap
} from 'lucide-react';
import { motion } from "framer-motion";

// Enhanced mock data
const messagesData = [
  { name: 'Mon', value: 420, growth: 12 },
  { name: 'Tue', value: 380, growth: -8 },
  { name: 'Wed', value: 510, growth: 34 },
  { name: 'Thu', value: 470, growth: -8 },
  { name: 'Fri', value: 590, growth: 26 },
  { name: 'Sat', value: 350, growth: -41 },
  { name: 'Sun', value: 320, growth: -9 },
];

const usersData = [
  { name: 'Mon', value: 45, satisfaction: 4.2 },
  { name: 'Tue', value: 52, satisfaction: 4.5 },
  { name: 'Wed', value: 49, satisfaction: 4.1 },
  { name: 'Thu', value: 63, satisfaction: 4.7 },
  { name: 'Fri', value: 71, satisfaction: 4.8 },
  { name: 'Sat', value: 39, satisfaction: 4.3 },
  { name: 'Sun', value: 36, satisfaction: 4.0 },
];

const pieData = [
  { name: 'Support', value: 40, color: '#0ea5e9' },
  { name: 'Sales', value: 30, color: '#10b981' },
  { name: 'General', value: 20, color: '#f59e0b' },
  { name: 'Technical', value: 10, color: '#ef4444' },
];

const stats = [
  {
    title: "Total Conversations",
    value: "8,942",
    change: "+12%",
    trend: "up",
    icon: MessageSquare,
    description: "from last month",
    color: "blue"
  },
  {
    title: "Active Users",
    value: "2,845",
    change: "+8%",
    trend: "up", 
    icon: Users,
    description: "from last month",
    color: "green"
  },
  {
    title: "AI Performance",
    value: "95.2%",
    change: "+2.1%",
    trend: "up",
    icon: BrainCircuit,
    description: "accuracy rate",
    color: "purple"
  },
  {
    title: "Response Time",
    value: "1.2s",
    change: "-15%",
    trend: "down",
    icon: Zap,
    description: "average response",
    color: "orange"
  }
];

const EnhancedDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor your AI chat system performance and user engagement
          </p>
        </div>
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EnhancedButton variant="outline" leftIcon={<Activity size={16} />}>
            View Live Chat
          </EnhancedButton>
          <EnhancedButton variant="premium" leftIcon={<Plus size={16} />}>
            New Widget
          </EnhancedButton>
        </motion.div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, staggerChildren: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <EnhancedCard variant="elevated" hover className="group">
              <EnhancedCardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="space-y-1">
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        {stat.trend === "up" ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`font-medium ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-muted-foreground">{stat.description}</span>
                      </div>
                    </div>
                  </div>
                  <motion.div 
                    className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </motion.div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2"
        >
          <EnhancedCard variant="gradient" className="h-full">
            <EnhancedCardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <EnhancedCardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Message Analytics
                  </EnhancedCardTitle>
                  <EnhancedCardDescription>
                    Weekly message processing and engagement trends
                  </EnhancedCardDescription>
                </div>
                <EnhancedButton variant="ghost" size="sm">
                  View Details
                </EnhancedButton>
              </div>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={messagesData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#gradient)"
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--primary)/0.6)" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <EnhancedCard variant="glass" className="h-full">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Chat Categories
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Distribution of conversation types
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
      </div>

      {/* Users Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <EnhancedCard variant="bordered">
          <EnhancedCardHeader>
            <EnhancedCardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Engagement
            </EnhancedCardTitle>
            <EnhancedCardDescription>
              New user registrations and satisfaction scores
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      </motion.div>
    </div>
  );
};

export default EnhancedDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
import { 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  Search, 
  TrendingUp,
  Award,
  Clock,
  Target,
  CheckCircle,
  Calendar,
  Zap,
  DollarSign,
  Users,
  FileText,
  ArrowRight,
  Bookmark,
  Bell
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [savedScholarships, setSavedScholarships] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(25);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { title: "FAFSA Priority Deadline", date: "2025-03-01", daysLeft: 90 },
    { title: "Common App Deadline", date: "2025-01-15", daysLeft: 45 },
    { title: "Merit Scholarship", date: "2025-02-01", daysLeft: 62 }
  ]);
  const [quickStats, setQuickStats] = useState({
    scholarshipsFound: 0,
    totalAidAvailable: 0,
    applicationsStarted: 0,
    collegesSaved: 0
  });

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch saved scholarships count
      const { count } = await supabase
        .from('saved_scholarships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setSavedScholarships(count || 0);
      
      // Calculate profile completion
      const completionScore = calculateProfileCompletion();
      setProfileCompletion(completionScore);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const calculateProfileCompletion = () => {
    let score = 25; // Base score for having an account
    if (user?.user_metadata?.full_name) score += 15;
    if (user?.user_metadata?.gpa) score += 15;
    if (user?.user_metadata?.major) score += 15;
    if (user?.user_metadata?.state) score += 15;
    if (user?.user_metadata?.graduation_year) score += 15;
    return score;
  };

  const quickActions = [
    {
      title: "AI Scholarship Finder",
      description: "Get personalized matches",
      icon: Search,
      color: "from-blue-500 to-blue-600",
      link: "/ai-finder",
      badge: "Smart Match"
    },
    {
      title: "Cost Calculator",
      description: "Estimate your expenses",
      icon: Calculator,
      color: "from-green-500 to-green-600",
      link: "/cost-calculator",
      badge: "Free Tool"
    },
    {
      title: "Browse Scholarships",
      description: "Explore 400+ opportunities",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      link: "/scholarships",
      badge: "Updated"
    },
    {
      title: "College Database",
      description: "Research & compare colleges",
      icon: GraduationCap,
      color: "from-orange-500 to-orange-600",
      link: "/colleges",
      badge: "Popular"
    }
  ];

  const progressTasks = [
    { id: 1, title: "Complete your profile", completed: profileCompletion >= 75, link: "/dashboard" },
    { id: 2, title: "Submit FAFSA application", completed: false, link: "/fafsa" },
    { id: 3, title: "Save 5 scholarships", completed: savedScholarships >= 5, link: "/scholarships" },
    { id: 4, title: "Compare 3 colleges", completed: false, link: "/colleges" },
    { id: 5, title: "Calculate education costs", completed: false, link: "/cost-calculator" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity }} />

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                Welcome back, {user?.user_metadata?.full_name || 'Student'}! 👋
              </h1>
              <p className="text-xl text-gray-400">
                Continue your journey to college success
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>

          {/* Profile Completion Alert */}
          {profileCompletion < 75 && (
            <Card className="bg-yellow-500/10 border-yellow-400/30 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-semibold">Complete your profile to unlock more features</p>
                    <p className="text-gray-400 text-sm">{profileCompletion}% complete</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-500/20">
                  Complete Now
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {[
            { icon: Award, label: "Scholarships Saved", value: savedScholarships, color: "blue" },
            { icon: DollarSign, label: "Potential Aid", value: 125, prefix: "$", suffix: "K", color: "green" },
            { icon: FileText, label: "Applications", value: quickStats.applicationsStarted, color: "purple" },
            { icon: Target, label: "Profile Complete", value: profileCompletion, suffix: "%", color: "orange" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-4`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                  </div>
                  <div className={`text-3xl font-black text-${stat.color}-400 mb-1`}>
                    <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link to={action.link}>
                        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all group cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <Badge className="bg-white/10 text-white border-0">{action.badge}</Badge>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                            <div className="flex items-center text-blue-400 text-sm font-medium">
                              Start now <ArrowRight className="h-4 w-4 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Progress Checklist */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">Overall Progress</span>
                      <span className="text-blue-400 font-bold">
                        {progressTasks.filter(t => t.completed).length}/{progressTasks.length}
                      </span>
                    </div>
                    <Progress 
                      value={(progressTasks.filter(t => t.completed).length / progressTasks.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-3">
                    {progressTasks.map((task) => (
                      <Link key={task.id} to={task.link}>
                        <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          task.completed 
                            ? 'bg-green-500/10 border border-green-400/30' 
                            : 'bg-white/5 border border-white/10 hover:border-white/20'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              task.completed 
                                ? 'bg-green-500' 
                                : 'bg-white/10 border-2 border-white/20'
                            }`}>
                              {task.completed && <CheckCircle className="h-4 w-4 text-white" />}
                            </div>
                            <span className={task.completed ? 'text-green-400 line-through' : 'text-white'}>
                              {task.title}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Deadlines */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Upcoming Deadlines</h2>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-sm">{deadline.title}</h4>
                          <p className="text-gray-400 text-xs mb-1">{deadline.date}</p>
                          <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-xs">
                            {deadline.daysLeft} days left
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/timeline">
                    <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border-0">
                      View Full Timeline
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Quick Resources */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Resources</h2>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardContent className="p-6 space-y-3">
                  {[
                    { title: "FAFSA Guide", icon: FileText, link: "/fafsa" },
                    { title: "Success Stories", icon: Users, link: "/success-stories" },
                    { title: "Blog & Tips", icon: BookOpen, link: "/blog" }
                  ].map((resource, index) => (
                    <Link key={index} to={resource.link}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                        <div className="flex items-center space-x-3">
                          <resource.icon className="h-5 w-5 text-blue-400" />
                          <span className="text-white font-medium">{resource.title}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
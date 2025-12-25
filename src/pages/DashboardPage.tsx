import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
import { 
  GraduationCap, Calculator, Search, Award, Clock, Target,
  CheckCircle, Calendar, Zap, DollarSign, Users, FileText, ArrowRight,
  Bell, X, Check, Star, Heart, School, ExternalLink, MapPin
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedScholarships, setSavedScholarships] = useState<any[]>([]);
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(25);
  const [showNotifications, setShowNotifications] = useState(false);
  const [progressTasks, setProgressTasks] = useState([
    { id: 1, title: "Complete your profile", completed: false, link: "/profile" },
    { id: 2, title: "Submit FAFSA application", completed: false, link: "/fafsa" },
    { id: 3, title: "Save 5 scholarships", completed: false, link: "/scholarships" },
    { id: 4, title: "Compare 3 colleges", completed: false, link: "/colleges" },
    { id: 5, title: "Calculate education costs", completed: false, link: "/cost-calculator" }
  ]);

  const [upcomingDeadlines] = useState([
    { id: 1, title: "FAFSA Priority Deadline", date: "2025-03-01", daysLeft: 90, priority: "high" },
    { id: 2, title: "Common App Deadline", date: "2025-01-15", daysLeft: 45, priority: "high" },
    { id: 3, title: "Merit Scholarship", date: "2025-02-01", daysLeft: 62, priority: "medium" }
  ]);

  useEffect(() => {
    fetchUserData();
    loadSavedTasks();
  }, [user]);

  const loadSavedTasks = () => {
    const saved = localStorage.getItem('dashboardTasks');
    if (saved) {
      setProgressTasks(JSON.parse(saved));
    }
  };

  const saveTasks = (tasks: any[]) => {
    localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
    setProgressTasks(tasks);
  };

  const toggleTask = (taskId: number) => {
    const updated = progressTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updated);
  };

  const fetchUserData = async () => {
    try {
      // Load scholarships from localStorage
      const savedScholarshipsData = localStorage.getItem('savedScholarships');
      if (savedScholarshipsData) {
        const scholarships = JSON.parse(savedScholarshipsData);
        setSavedScholarships(scholarships);
        console.log('✅ Loaded scholarships from localStorage:', scholarships.length);
      }

      // Load saved colleges from localStorage
      const savedCollegeIds = localStorage.getItem('savedColleges');
      if (savedCollegeIds) {
        const collegeIds = JSON.parse(savedCollegeIds);
        if (collegeIds.length > 0) {
          const { data: collegeData, error: collegeError } = await supabase
            .from('colleges_database_2025_10_06_01_15')
            .select('*')
            .in('id', collegeIds);
          
          if (!collegeError && collegeData) {
            setSavedColleges(collegeData);
          }
        }
      }
      
      const completionScore = calculateProfileCompletion();
      setProfileCompletion(completionScore);
      
      const updatedTasks = [...progressTasks];
      if (completionScore >= 75) updatedTasks[0].completed = true;
      
      if (savedScholarshipsData) {
        const scholarships = JSON.parse(savedScholarshipsData);
        if (scholarships.length >= 5) updatedTasks[2].completed = true;
      }
      
      if (savedCollegeIds) {
        const collegeIds = JSON.parse(savedCollegeIds);
        if (collegeIds.length >= 3) updatedTasks[3].completed = true;
      }
      
      saveTasks(updatedTasks);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const calculateProfileCompletion = () => {
    let score = 25;
    if (user?.user_metadata?.full_name) score += 15;
    if (user?.user_metadata?.gpa) score += 15;
    if (user?.user_metadata?.major) score += 15;
    if (user?.user_metadata?.state) score += 15;
    if (user?.user_metadata?.graduation_year) score += 15;
    return score;
  };

  const removeScholarship = (scholarshipName: string, scholarshipProvider: string) => {
    const saved = localStorage.getItem('savedScholarships');
    if (saved) {
      const scholarships = JSON.parse(saved);
      // Remove by name and provider match
      const updated = scholarships.filter((s: any) => 
        !(s.name === scholarshipName && s.provider === scholarshipProvider)
      );
      localStorage.setItem('savedScholarships', JSON.stringify(updated));
      setSavedScholarships(updated);
    }
  };

  const removeCollege = (collegeId: number) => {
    const saved = localStorage.getItem('savedColleges');
    if (saved) {
      const ids = JSON.parse(saved);
      const updated = ids.filter((id: number) => id !== collegeId);
      localStorage.setItem('savedColleges', JSON.stringify(updated));
      setSavedColleges(prev => prev.filter((c: any) => c.id !== collegeId));
    }
  };

  // Calculate total scholarship value properly
  const totalScholarshipValue = savedScholarships.reduce((sum, s: any) => {
    const amount = Number(s.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Format large numbers nicely
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value}`;
    }
  };

  const quickActions = [
    {
      title: "AI Scholarship Finder",
      description: "Get personalized matches",
      icon: Search,
      gradient: "from-blue-500 to-blue-600",
      link: "/ai-finder",
      badge: "Smart Match"
    },
    {
      title: "Cost Calculator",
      description: "Estimate your expenses",
      icon: Calculator,
      gradient: "from-green-500 to-green-600",
      link: "/cost-calculator",
      badge: "Free Tool"
    },
    {
      title: "Browse Scholarships",
      description: "Explore 400+ opportunities",
      icon: Award,
      gradient: "from-purple-500 to-purple-600",
      link: "/scholarships",
      badge: "Updated"
    },
    {
      title: "College Database",
      description: "Research & compare colleges",
      icon: GraduationCap,
      gradient: "from-orange-500 to-orange-600",
      link: "/colleges",
      badge: "Popular"
    }
  ];

  const completedTasksCount = progressTasks.filter(t => t.completed).length;
  const progressPercentage = (completedTasksCount / progressTasks.length) * 100;

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <motion.div 
          className="mb-8 pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                Welcome back, {user?.user_metadata?.full_name || 'Student'}! 👋
              </h1>
              <p className="text-xl text-gray-700">
                Continue your journey to college success
              </p>
            </div>
            <div className="relative">
              <Button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-blue-900 hover:bg-blue-500 text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge className="ml-2 bg-red-500 text-white">3</Badge>
              </Button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-14 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        { title: "New scholarship matches", time: "2 hours ago", type: "success" },
                        { title: "FAFSA deadline approaching", time: "1 day ago", type: "warning" },
                        { title: "Profile completion reminder", time: "2 days ago", type: "info" }
                      ].map((notif, i) => (
                        <div key={i} className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.type === 'success' ? 'bg-green-500' : 
                              notif.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium text-sm">{notif.title}</p>
                              <p className="text-gray-600 text-xs mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {profileCompletion < 75 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-yellow-50 border-yellow-300">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-gray-900 font-semibold">Complete your profile to unlock more features</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={profileCompletion} className="h-2 w-32" />
                        <span className="text-gray-700 text-sm font-medium">{profileCompletion}%</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-yellow-600 hover:bg-yellow-500 text-white"
                    onClick={() => navigate('/profile')}
                  >
                    Complete Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

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
            { icon: Award, label: "Scholarships Saved", value: savedScholarships.length, color: "blue", bgColor: "bg-blue-100" },
            { 
              icon: DollarSign, 
              label: "Potential Aid", 
              value: totalScholarshipValue, 
              color: "green", 
              bgColor: "bg-green-100",
              isFormatted: true 
            },
            { icon: School, label: "Colleges Saved", value: savedColleges.length, color: "purple", bgColor: "bg-purple-100" },
            { icon: Target, label: "Profile Complete", value: profileCompletion, suffix: "%", color: "orange", bgColor: "bg-orange-100" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-white border-gray-200 hover:border-blue-400 transition-all shadow-lg">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    {stat.isFormatted ? (
                      formatCurrency(stat.value)
                    ) : (
                      <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {savedScholarships.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
                    Saved Scholarships ({savedScholarships.length})
                  </h2>
                  <Link to="/scholarships?saved=true">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-900">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {savedScholarships.map((scholarship: any, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white border-gray-200 hover:border-pink-400 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1">{scholarship.name || scholarship.scholarship_name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{scholarship.provider}</p>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="font-bold text-blue-900">
                                  ${scholarship.amount?.toLocaleString() || 'Varies'}
                                </span>
                                <span className="text-gray-600 flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {scholarship.deadline}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {scholarship.url && (
                                <Button size="sm" variant="outline" asChild className="border-gray-300">
                                  <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeScholarship(scholarship.name, scholarship.provider)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {savedColleges.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <School className="h-6 w-6 text-blue-600" />
                    Saved Colleges ({savedColleges.length})
                  </h2>
                  <Link to="/colleges">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-900">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {savedColleges.slice(0, 4).map((college: any, index) => (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white border-gray-200 hover:border-blue-400 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1 text-sm">{college.name}</h3>
                              <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {college.location}
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                {college.admission_rate && (
                                  <Badge variant="outline" className="border-blue-300 text-blue-900">
                                    {college.admission_rate}% acceptance
                                  </Badge>
                                )}
                                {college.tuition_out_state && (
                                  <span className="text-gray-600">
                                    ${(college.tuition_out_state / 1000).toFixed(0)}K
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => removeCollege(college.id)}
                              className="text-gray-500 hover:text-red-600 shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
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
                        <Card className="bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all group cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <Badge className="bg-blue-100 text-blue-900 border-0">{action.badge}</Badge>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                            <div className="flex items-center text-blue-900 text-sm font-medium">
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

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
                <Badge className="bg-blue-900 text-white">
                  {completedTasksCount}/{progressTasks.length} Complete
                </Badge>
              </div>
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900 font-semibold">Overall Progress</span>
                      <span className="text-blue-900 font-bold text-lg">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    {progressTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: task.id * 0.1 }}
                      >
                        <div className={`flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer ${
                          task.completed 
                            ? 'bg-green-50 border-2 border-green-300' 
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                        }`}>
                          <div className="flex items-center space-x-3 flex-1">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                task.completed 
                                  ? 'bg-green-500' 
                                  : 'bg-white border-2 border-gray-300 hover:border-blue-500'
                              }`}
                            >
                              <AnimatePresence>
                                {task.completed && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                  >
                                    <Check className="h-4 w-4 text-white" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>
                            <span className={`font-medium ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                              {task.title}
                            </span>
                          </div>
                          <Link to={task.link}>
                            <Button variant="ghost" size="sm" className="text-blue-900 hover:bg-blue-50">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline) => (
                      <motion.div 
                        key={deadline.id} 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
                      >
                        <Calendar className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          deadline.priority === 'high' ? 'text-red-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="text-gray-900 font-semibold text-sm">{deadline.title}</h4>
                          <p className="text-gray-600 text-xs mb-2">{deadline.date}</p>
                          <Badge className={`text-xs ${
                            deadline.daysLeft < 30 
                              ? 'bg-red-100 text-red-900 border-red-300' 
                              : deadline.daysLeft < 60 
                              ? 'bg-orange-100 text-orange-900 border-orange-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {deadline.daysLeft} days left
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Link to="/timeline">
                    <Button className="w-full mt-4 bg-blue-900 hover:bg-blue-500 text-white">
                      View Full Timeline
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6 space-y-2">
                  {[
                    { title: "FAFSA Guide", icon: FileText, link: "/fafsa", color: "text-blue-600" },
                    { title: "Success Stories", icon: Users, link: "/success-stories", color: "text-green-600" },
                    { title: "Blog & Tips", icon: CheckCircle, link: "/blog", color: "text-purple-600" }
                  ].map((resource, index) => (
                    <Link key={index} to={resource.link}>
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all border border-gray-200 hover:border-blue-300"
                      >
                        <div className="flex items-center space-x-3">
                          <resource.icon className={`h-5 w-5 ${resource.color}`} />
                          <span className="text-gray-900 font-medium">{resource.title}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-600" />
                      </motion.div>
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
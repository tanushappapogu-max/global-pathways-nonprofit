import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
import { 
  Calendar, Clock, CheckCircle, AlertCircle, BookOpen, FileText,
  DollarSign, GraduationCap, Target, Award, Bell, Filter, Heart
} from 'lucide-react';

interface SavedScholarship {
  id: string;
  scholarship_name: string;
  provider: string;
  amount: number;
  deadline: string;
  description?: string;
  url?: string;
}

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  type: 'deadline' | 'application' | 'financial' | 'decision' | 'scholarship';
  status: 'completed' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
  daysLeft: number;
  actionUrl: string;
  amount?: number;
  provider?: string;
}

export const TimelinePage = () => {
  const [filter, setFilter] = useState('all');
  const [completedEvents, setCompletedEvents] = useState<number[]>([1, 2, 3]);
  const [scholarshipDeadlines, setScholarshipDeadlines] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const staticEvents: TimelineEvent[] = [
    {
      id: 1,
      title: "FAFSA Opens",
      date: "2024-10-01",
      description: "Federal Student Aid application becomes available for 2025-2026 academic year",
      type: "deadline",
      status: "completed",
      priority: "high",
      daysLeft: -43,
      actionUrl: "/fafsa"
    },
    {
      id: 2,
      title: "Early College Applications Due",
      date: "2024-11-01",
      description: "Early Decision and Early Action application deadlines for most colleges",
      type: "application",
      status: "completed",
      priority: "high",
      daysLeft: -12,
      actionUrl: "/colleges"
    },
    {
      id: 3,
      title: "CSS Profile Deadline",
      date: "2024-11-15",
      description: "CSS Profile deadline for early decision applicants",
      type: "financial",
      status: "completed",
      priority: "medium",
      daysLeft: 2,
      actionUrl: "/fafsa"
    },
    {
      id: 4,
      title: "Regular Decision Applications",
      date: "2025-01-01",
      description: "Most regular decision college application deadlines",
      type: "application",
      status: "upcoming",
      priority: "high",
      daysLeft: 49,
      actionUrl: "/colleges"
    },
    {
      id: 5,
      title: "State Aid Priority Deadlines",
      date: "2025-03-01",
      description: "Priority deadlines for state financial aid programs",
      type: "financial",
      status: "upcoming",
      priority: "high",
      daysLeft: 108,
      actionUrl: "/scholarships"
    },
    {
      id: 6,
      title: "College Decision Day",
      date: "2025-05-01",
      description: "National deadline to commit to a college",
      type: "decision",
      status: "upcoming",
      priority: "high",
      daysLeft: 169,
      actionUrl: "/colleges"
    },
    {
      id: 7,
      title: "Final FAFSA Deadline",
      date: "2025-06-30",
      description: "Federal deadline for FAFSA submission",
      type: "deadline",
      status: "upcoming",
      priority: "medium",
      daysLeft: 229,
      actionUrl: "/fafsa"
    }
  ];

  useEffect(() => {
    fetchScholarshipDeadlines();
  }, []);

  const fetchScholarshipDeadlines = async () => {
    try {
      // Get saved scholarship IDs from localStorage
      const savedIds = localStorage.getItem('savedScholarshipIds');
      
      if (savedIds) {
        const parsedIds = JSON.parse(savedIds);
        
        // Fetch scholarship details from Supabase
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .in('id', parsedIds.map((id: string) => id.split('-')[0]))
          .gte('deadline', new Date().toISOString().split('T')[0])
          .order('deadline', { ascending: true })
          .limit(20);

        if (!error && data) {
          const scholarshipEvents: TimelineEvent[] = data.map((scholarship, index) => {
            const deadline = new Date(scholarship.deadline);
            const today = new Date();
            const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            return {
              id: 1000 + index,
              title: scholarship.name,
              date: scholarship.deadline,
              description: scholarship.description || `Scholarship from ${scholarship.provider}`,
              type: 'scholarship',
              status: 'upcoming' as const,
              priority: daysLeft < 30 ? 'high' as const : daysLeft < 60 ? 'medium' as const : 'low' as const,
              daysLeft,
              actionUrl: scholarship.application_url || '/scholarships',
              amount: scholarship.amount,
              provider: scholarship.provider
            };
          });
          
          setScholarshipDeadlines(scholarshipEvents);
        }
      }
    } catch (error) {
      console.error('Error fetching scholarship deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (eventId: number) => {
    setCompletedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Combine and sort all events
  const allEvents = [...staticEvents, ...scholarshipDeadlines].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const filteredEvents = filter === 'all' 
    ? allEvents 
    : allEvents.filter(e => e.type === filter);

  const stats = {
    total: allEvents.length,
    completed: completedEvents.length,
    upcoming: allEvents.filter(e => e.status === 'upcoming').length,
    scholarships: scholarshipDeadlines.length
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return Clock;
      case 'application': return FileText;
      case 'financial': return DollarSign;
      case 'decision': return Target;
      case 'scholarship': return Award;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'from-red-500 to-red-600';
      case 'application': return 'from-blue-500 to-blue-600';
      case 'financial': return 'from-green-500 to-green-600';
      case 'decision': return 'from-purple-500 to-purple-600';
      case 'scholarship': return 'from-pink-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 pt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <Calendar className="w-5 h-5 mr-2" />
            College Timeline
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="block text-gray-900 mb-4">Application</span>
            <span className="block text-gray-900">Timeline</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Stay on track with important deadlines and scholarship opportunities
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Events", value: stats.total, icon: Calendar, color: "blue" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "green" },
            { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "orange" },
            { label: "Scholarships", value: stats.scholarships, icon: Heart, color: "pink" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border border-gray-200 text-center shadow-lg hover:border-blue-400 transition-all">
                <CardContent className="pt-6">
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600 mx-auto mb-3`} />
                  <div className={`text-4xl font-black text-${stat.color}-900 mb-1`}>
                    <CountUp end={stat.value} />
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'deadline', 'application', 'financial', 'decision', 'scholarship'].map((filterType) => (
            <Button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`${
                filter === filterType
                  ? 'bg-blue-900 hover:bg-blue-800'
                  : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
              } capitalize`}
              size="sm"
            >
              {filterType === 'scholarship' ? `${filterType}s` : filterType}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading your timeline...</p>
          </div>
        ) : (
          <>
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              <div className="space-y-8">
                {filteredEvents.map((event, index) => {
                  const Icon = getTypeIcon(event.type);
                  const isCompleted = completedEvents.includes(event.id);
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative flex items-start"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute left-6 md:left-10 w-6 h-6 rounded-full bg-gradient-to-br ${getTypeColor(event.type)} border-4 border-blue-50 z-10 flex items-center justify-center`}>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      
                      {/* Content */}
                      <div className="ml-16 md:ml-24 w-full">
                        <Card className={`bg-white border-l-4 transition-all hover:shadow-xl hover:border-blue-400 ${
                          event.priority === 'high' ? 'border-l-red-500' : 
                          event.priority === 'medium' ? 'border-l-yellow-500' : 
                          'border-l-green-500'
                        } ${isCompleted ? 'opacity-60' : ''} shadow-lg`}>
                          <CardHeader>
                            <div className="flex items-start justify-between flex-wrap gap-4">
                              <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(event.type)} shadow-lg`}>
                                  <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl text-gray-900 mb-2">{event.title}</CardTitle>
                                  {event.provider && (
                                    <p className="text-sm text-gray-600 mb-2">{event.provider}</p>
                                  )}
                                  <div className="flex items-center flex-wrap space-x-4 text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    {event.daysLeft > 0 && (
                                      <Badge className={`${
                                        event.daysLeft < 14 ? 'bg-red-100 text-red-900 border-red-300' :
                                        event.daysLeft < 30 ? 'bg-orange-100 text-orange-900 border-orange-300' :
                                        'bg-blue-100 text-blue-900 border-blue-300'
                                      }`}>
                                        {event.daysLeft} days left
                                      </Badge>
                                    )}
                                    {event.daysLeft <= 0 && event.status === 'completed' && (
                                      <Badge className="bg-gray-100 text-gray-900 border-gray-300">
                                        Past
                                      </Badge>
                                    )}
                                    <Badge className={`${
                                      event.priority === 'high' ? 'bg-red-100 text-red-900 border-red-300' : 
                                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-900 border-yellow-300' : 
                                      'bg-green-100 text-green-900 border-green-300'
                                    }`}>
                                      {event.priority} priority
                                    </Badge>
                                    {event.amount && (
                                      <Badge className="bg-green-100 text-green-900 border-green-300">
                                        ${event.amount.toLocaleString()}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-6">{event.description}</p>
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`event-${event.id}`}
                                  checked={isCompleted}
                                  onCheckedChange={() => toggleComplete(event.id)}
                                  className="border-gray-300"
                                />
                                <label htmlFor={`event-${event.id}`} className="text-sm text-gray-600 cursor-pointer">
                                  Mark as {isCompleted ? 'incomplete' : 'complete'}
                                </label>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 text-gray-900 hover:bg-gray-100"
                                >
                                  <Bell className="h-4 w-4 mr-2" />
                                  Remind Me
                                </Button>
                                <Button 
                                  size="sm"
                                  className="bg-blue-900 hover:bg-blue-800 text-white"
                                  asChild
                                >
                                  <a href={event.actionUrl}>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    {event.type === 'scholarship' ? 'View Details' : 'Learn More'}
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-900 to-purple-600 text-white shadow-2xl border-0">
                <CardContent className="p-12 text-center">
                  <GraduationCap className="h-20 w-20 mx-auto mb-6" />
                  <h2 className="text-4xl font-black mb-4">Stay Organized & On Track</h2>
                  <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                    Save scholarships to automatically track their deadlines on your timeline
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                      <Calendar className="mr-2 h-5 w-5" />
                      Export Calendar
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg font-semibold" asChild>
                      <a href="/scholarships">
                        <Award className="mr-2 h-5 w-5" />
                        Find Scholarships
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
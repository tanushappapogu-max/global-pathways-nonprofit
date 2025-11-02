import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CountUp } from '@/components/animations/CountUp';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  FileText,
  DollarSign,
  GraduationCap,
  Target,
  Award,
  Bell,
  Filter
} from 'lucide-react';

export const TimelinePage = () => {
  const [filter, setFilter] = useState('all');
  const [completedEvents, setCompletedEvents] = useState<number[]>([1, 2, 3]);

  const timelineEvents = [
    {
      id: 1,
      title: "FAFSA Opens",
      date: "October 1, 2024",
      description: "Federal Student Aid application becomes available for 2025-2026 academic year",
      type: "deadline",
      status: "completed",
      priority: "high",
      daysLeft: -30,
      actionUrl: "/fafsa"
    },
    {
      id: 2,
      title: "Early College Applications Due",
      date: "November 1, 2024",
      description: "Early Decision and Early Action application deadlines for most colleges",
      type: "application",
      status: "completed",
      priority: "high",
      daysLeft: 0,
      actionUrl: "/colleges"
    },
    {
      id: 3,
      title: "CSS Profile Deadline",
      date: "November 15, 2024",
      description: "CSS Profile deadline for early decision applicants",
      type: "financial",
      status: "completed",
      priority: "medium",
      daysLeft: 14,
      actionUrl: "/fafsa"
    },
    {
      id: 4,
      title: "Regular Decision Applications",
      date: "January 1, 2025",
      description: "Most regular decision college application deadlines",
      type: "application",
      status: "upcoming",
      priority: "high",
      daysLeft: 61,
      actionUrl: "/colleges"
    },
    {
      id: 5,
      title: "State Aid Priority Deadlines",
      date: "March 1, 2025",
      description: "Priority deadlines for state financial aid programs",
      type: "financial",
      status: "upcoming",
      priority: "high",
      daysLeft: 120,
      actionUrl: "/scholarships"
    },
    {
      id: 6,
      title: "College Decision Day",
      date: "May 1, 2025",
      description: "National deadline to commit to a college",
      type: "decision",
      status: "upcoming",
      priority: "high",
      daysLeft: 181,
      actionUrl: "/colleges"
    },
    {
      id: 7,
      title: "Final FAFSA Deadline",
      date: "June 30, 2025",
      description: "Federal deadline for FAFSA submission",
      type: "deadline",
      status: "upcoming",
      priority: "medium",
      daysLeft: 241,
      actionUrl: "/fafsa"
    }
  ];

  const toggleComplete = (eventId: number) => {
    setCompletedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredEvents = filter === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.type === filter);

  const stats = {
    total: timelineEvents.length,
    completed: completedEvents.length,
    upcoming: timelineEvents.filter(e => e.status === 'upcoming').length,
    high: timelineEvents.filter(e => e.priority === 'high').length
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return Clock;
      case 'application': return FileText;
      case 'financial': return DollarSign;
      case 'decision': return Target;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'from-red-500 to-red-600';
      case 'application': return 'from-blue-500 to-blue-600';
      case 'financial': return 'from-green-500 to-green-600';
      case 'decision': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-8 py-3 text-base font-medium">
            <Calendar className="w-5 h-5 mr-2" />
            College Timeline
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">Application</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Timeline</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Stay on track with important deadlines and milestones
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Events", value: stats.total, icon: Calendar, color: "blue" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "green" },
            { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "orange" },
            { label: "High Priority", value: stats.high, icon: AlertCircle, color: "red" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center">
                <CardContent className="pt-6">
                  <stat.icon className={`h-8 w-8 text-${stat.color}-400 mx-auto mb-3`} />
                  <div className={`text-4xl font-black text-${stat.color}-400 mb-1`}>
                    <CountUp end={stat.value} />
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'deadline', 'application', 'financial', 'decision'].map((filterType) => (
            <Button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`${
                filter === filterType
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              } text-white border-0 capitalize`}
              size="sm"
            >
              {filterType}
            </Button>
          ))}
        </div>

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
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 md:left-10 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-slate-950 z-10 flex items-center justify-center">
                    {isCompleted && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                  
                  {/* Content */}
                  <div className="ml-16 md:ml-24 w-full">
                    <Card className={`bg-white/5 backdrop-blur-xl border-l-4 transition-all hover:border-white/30 ${
                      event.priority === 'high' ? 'border-l-red-500' : 
                      event.priority === 'medium' ? 'border-l-yellow-500' : 
                      'border-l-green-500'
                    } ${isCompleted ? 'opacity-60' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(event.type)} shadow-lg`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white mb-2">{event.title}</CardTitle>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-400 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {event.date}
                                </span>
                                {event.daysLeft > 0 && (
                                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                                    {event.daysLeft} days left
                                  </Badge>
                                )}
                                <Badge className={`${
                                  event.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-400/30' : 
                                  event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' : 
                                  'bg-green-500/20 text-green-300 border-green-400/30'
                                }`}>
                                  {event.priority} priority
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-6">{event.description}</p>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`event-${event.id}`}
                              checked={isCompleted}
                              onCheckedChange={() => toggleComplete(event.id)}
                              className="border-white/20"
                            />
                            <label htmlFor={`event-${event.id}`} className="text-sm text-gray-400 cursor-pointer">
                              Mark as {isCompleted ? 'incomplete' : 'complete'}
                            </label>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              Remind Me
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              asChild
                            >
                              <a href={event.actionUrl}>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Learn More
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
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-0">
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-20 w-20 mx-auto mb-6" />
              <h2 className="text-4xl font-black mb-4">Stay Organized & On Track</h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Download our timeline checklist and never miss an important deadline
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  <Calendar className="mr-2 h-5 w-5" />
                  Export Calendar
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold" asChild>
                  <a href="/scholarships">
                    <Award className="mr-2 h-5 w-5" />
                    Find Scholarships
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
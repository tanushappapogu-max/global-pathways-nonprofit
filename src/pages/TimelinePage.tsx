import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Award
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';

export const TimelinePage = () => {
  const timelineEvents = [
    {
      id: 1,
      title: "FAFSA Opens",
      date: "October 1, 2024",
      description: "Federal Student Aid application becomes available for 2025-2026 academic year",
      type: "deadline",
      status: "completed",
      priority: "high"
    },
    {
      id: 2,
      title: "Early College Applications Due",
      date: "November 1, 2024",
      description: "Early Decision and Early Action application deadlines for most colleges",
      type: "application",
      status: "completed",
      priority: "high"
    },
    {
      id: 3,
      title: "CSS Profile Deadline",
      date: "November 15, 2024",
      description: "CSS Profile deadline for early decision applicants",
      type: "financial",
      status: "completed",
      priority: "medium"
    },
    {
      id: 4,
      title: "Regular Decision Applications",
      date: "January 1, 2025",
      description: "Most regular decision college application deadlines",
      type: "application",
      status: "upcoming",
      priority: "high"
    },
    {
      id: 5,
      title: "State Aid Priority Deadlines",
      date: "March 1, 2025",
      description: "Priority deadlines for state financial aid programs",
      type: "financial",
      status: "upcoming",
      priority: "high"
    },
    {
      id: 6,
      title: "College Decision Day",
      date: "May 1, 2025",
      description: "National deadline to commit to a college",
      type: "decision",
      status: "upcoming",
      priority: "high"
    },
    {
      id: 7,
      title: "Final FAFSA Deadline",
      date: "June 30, 2025",
      description: "Federal deadline for FAFSA submission",
      type: "deadline",
      status: "upcoming",
      priority: "medium"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="h-5 w-5" />;
      case 'application': return <FileText className="h-5 w-5" />;
      case 'financial': return <DollarSign className="h-5 w-5" />;
      case 'decision': return <Target className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            College Timeline
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="College Application Timeline" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay on track with important deadlines and milestones for your college journey
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full border-4 ${
                  event.status === 'completed' ? 'bg-green-500 border-green-500' :
                  event.status === 'upcoming' ? 'bg-blue-500 border-blue-500' :
                  'bg-gray-500 border-gray-500'
                } z-10`}></div>
                
                {/* Content */}
                <div className="ml-16 w-full">
                  <Card className={`bg-white/90 backdrop-blur-sm shadow-lg border-l-4 ${getPriorityColor(event.priority)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            event.type === 'deadline' ? 'bg-red-100 text-red-600' :
                            event.type === 'application' ? 'bg-blue-100 text-blue-600' :
                            event.type === 'financial' ? 'bg-green-100 text-green-600' :
                            event.type === 'decision' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getTypeIcon(event.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <CardDescription className="text-gray-600 font-medium">
                              {event.date}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {event.status === 'upcoming' && <Clock className="h-3 w-3 mr-1" />}
                          {event.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${
                          event.priority === 'high' ? 'border-red-500 text-red-700' :
                          event.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                          'border-green-500 text-green-700'
                        }`}>
                          {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (event.type === 'financial') {
                              window.open('/fafsa', '_blank');
                            } else if (event.type === 'application') {
                              window.open('/colleges', '_blank');
                            } else {
                              alert('More information coming soon!');
                            }
                          }}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
            <CardContent className="p-12">
              <GraduationCap className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                <ShinyText text="Stay Organized" className="text-white" />
              </h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Don't miss important deadlines. Set up reminders and stay on track with your college application journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  onClick={() => alert('Reminder feature coming soon!')}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Set Reminders
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                  asChild
                >
                  <a href="/scholarships">
                    <Award className="mr-2 h-5 w-5" />
                    Find Scholarships
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  Search, 
  TrendingUp,
  Award,
  Clock,
  Target
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';


export const DashboardPage = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "AI Scholarship Finder",
      description: "Get personalized scholarship recommendations",
      icon: Search,
      color: "from-blue-500 to-blue-600",
      link: "/ai-finder"
    },
    {
      title: "Cost Calculator",
      description: "Calculate your education costs",
      icon: Calculator,
      color: "from-green-500 to-green-600",
      link: "/cost-calculator"
    },
    {
      title: "Browse Scholarships",
      description: "Explore available scholarships",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      link: "/scholarships"
    },
    {
      title: "College Database",
      description: "Research colleges and universities",
      icon: GraduationCap,
      color: "from-orange-500 to-orange-600",
      link: "/colleges"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome back, <ShinyText text={user?.user_metadata?.full_name || 'Student'} />!
          </h1>
          <p className="text-xl text-gray-600">
            Continue your journey to U.S. higher education success
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card key={index} className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-4">
                      {action.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600"
                      asChild
                    >
                      <Link to={action.link}>Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Applications Started</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Scholarships Found</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
                <p className="text-3xl font-bold text-purple-600">25%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600 mb-6">Start exploring scholarships and colleges to see your activity here.</p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                <Link to="/ai-finder">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
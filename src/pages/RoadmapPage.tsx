import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Target, 
  Globe, 
  Bot, 
  Users, 
  GraduationCap,
  MessageCircle,
  Smartphone,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Lightbulb,
  Heart,
  Building,
  Map
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';

import { CountUp } from '@/components/animations/CountUp';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  quarter: string;
  year: number;
  features: string[];
  impact: string;
  icon: React.ReactNode;
}

export const RoadmapPage: React.FC = () => {
  const roadmapItems: RoadmapItem[] = [
    {
      id: '1',
      title: 'Platform Foundation',
      description: 'Core platform with FAFSA guidance, college database, and user accounts',
      status: 'completed',
      quarter: 'Q3',
      year: 2024,
      features: [
        'User registration and authentication',
        'Comprehensive college database',
        'FAFSA step-by-step guide',
        'Basic scholarship search',
        'Multilingual support (5 languages)'
      ],
      impact: '1,000+ students helped in first month',
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      id: '2',
      title: 'Enhanced Features & Analytics',
      description: 'Advanced tools, counselor portal, and impact tracking',
      status: 'completed',
      quarter: 'Q4',
      year: 2024,
      features: [
        'College cost calculator',
        'Counselor portal with student tracking',
        'Success stories and testimonials',
        'Impact metrics dashboard',
        'Partnership program launch'
      ],
      impact: '5,000+ students reached, 50+ partner schools',
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      id: '3',
      title: 'AI-Powered Assistance',
      description: 'Intelligent chatbot and personalized recommendations',
      status: 'in-progress',
      quarter: 'Q1',
      year: 2025,
      features: [
        'AI chatbot for FAFSA questions',
        'Personalized scholarship matching',
        'Smart deadline reminders',
        'Automated progress tracking',
        'Intelligent college recommendations'
      ],
      impact: 'Expected: 50% reduction in completion time',
      icon: <Bot className="h-6 w-6" />
    },
    {
      id: '4',
      title: 'Mobile App & Notifications',
      description: 'Native mobile apps with push notifications and offline access',
      status: 'planned',
      quarter: 'Q2',
      year: 2025,
      features: [
        'iOS and Android native apps',
        'Push notifications for deadlines',
        'Offline access to guides',
        'Document photo capture',
        'Voice-to-text for forms'
      ],
      impact: 'Expected: 80% mobile user engagement',
      icon: <Smartphone className="h-6 w-6" />
    },
    {
      id: '5',
      title: 'Global Expansion',
      description: 'Support for students applying to universities worldwide',
      status: 'planned',
      quarter: 'Q3',
      year: 2025,
      features: [
        'UK university application guide',
        'Canadian college resources',
        'Australian university support',
        'European study abroad programs',
        'Additional language support (10+ languages)'
      ],
      impact: 'Expected: 25,000+ international students',
      icon: <Globe className="h-6 w-6" />
    },
    {
      id: '6',
      title: 'Mentorship Network',
      description: 'Connect students with college mentors and alumni',
      status: 'planned',
      quarter: 'Q4',
      year: 2025,
      features: [
        'Peer mentorship matching',
        'Alumni mentor network',
        'Virtual mentorship sessions',
        'Group study sessions',
        'Career guidance integration'
      ],
      impact: 'Expected: 1,000+ mentor-student pairs',
      icon: <Users className="h-6 w-6" />
    },
    {
      id: '7',
      title: 'Advanced Analytics & Insights',
      description: 'Predictive analytics and success probability modeling',
      status: 'planned',
      quarter: 'Q1',
      year: 2026,
      features: [
        'Admission probability calculator',
        'Financial aid prediction models',
        'Success outcome tracking',
        'Institutional analytics for schools',
        'Policy impact research'
      ],
      impact: 'Expected: 90% accuracy in predictions',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      id: '8',
      title: 'Enterprise & Government Partnerships',
      description: 'Large-scale institutional adoption and policy integration',
      status: 'planned',
      quarter: 'Q2',
      year: 2026,
      features: [
        'State education department partnerships',
        'Federal agency collaboration',
        'Enterprise school district licenses',
        'Policy research and advocacy',
        'International education partnerships'
      ],
      impact: 'Expected: 1M+ students reached annually',
      icon: <Building className="h-6 w-6" />
    }
  ];

  const visionGoals = [
    {
      title: '100,000 Students Helped',
      description: 'Reach 100,000 students worldwide by 2026',
      progress: 2.8,
      icon: <GraduationCap className="h-8 w-8 text-blue-600" />
    },
    {
      title: '$100M in Aid Unlocked',
      description: 'Help students access $100 million in financial aid',
      progress: 2.1,
      icon: <Award className="h-8 w-8 text-green-600" />
    },
    {
      title: '1,000 Partner Schools',
      description: 'Partner with 1,000 high schools and organizations',
      progress: 5.0,
      icon: <Building className="h-8 w-8 text-purple-600" />
    },
    {
      title: '50 Countries Served',
      description: 'Expand support to students in 50+ countries',
      progress: 10.0,
      icon: <Globe className="h-8 w-8 text-orange-600" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'planned':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Map className="w-4 h-4 mr-2" />
            Product Roadmap
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Our Roadmap" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what's coming next for Global Pathways as we continue to innovate and expand our impact
          </p>
        </div>

        {/* Vision Goals */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              <ShinyText text="Our 2026 Vision" />
            </h2>
            <p className="text-lg text-gray-600">
              Ambitious goals that drive our mission forward
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visionGoals.map((goal, index) => (
              
                <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4">{goal.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                    <div className="space-y-2">
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-gray-500">
                        <CountUp end={goal.progress} suffix="%" /> Complete
                      </p>
                    </div>
                  </CardContent>
                </Card>
              
            ))}
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              <ShinyText text="Development Timeline" />
            </h2>
            <p className="text-lg text-gray-600">
              Our planned features and milestones from 2024 to 2026
            </p>
          </div>

          <div className="space-y-8">
            {roadmapItems.map((item, index) => (
              
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${
                          item.status === 'completed' ? 'bg-green-100' :
                          item.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <div className={`${
                            item.status === 'completed' ? 'text-green-600' :
                            item.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {item.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CardTitle className="text-xl">{item.title}</CardTitle>
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                            </Badge>
                          </div>
                          <CardDescription className="text-base mb-3">
                            {item.description}
                          </CardDescription>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {item.quarter} {item.year}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Expected Impact</h4>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-800">{item.impact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
              <CardContent className="p-12">
                <Rocket className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  <ShinyText text="Join Our Journey" className="text-white" />
                </h2>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                  Be part of our mission to democratize access to higher education. Your feedback and support help shape our roadmap.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    <Heart className="mr-2 h-5 w-5" />
                    Support Our Mission
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Share Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          
        </section>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  GraduationCap, 
  Globe, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  Users, 
  BookOpen, 
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  Target,
  TrendingUp,
  Award,
  Search,
  Calculator
} from 'lucide-react';

// Import ReactBits animations
import { ShinyText } from '@/components/animations/ShinyText';
import { Magnetic } from '@/components/animations/Magnetic';
import { CountUp } from '@/components/animations/CountUp';
import { AnimatedThreads } from '@/components/animations/AnimatedThreads';

const Index = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [heroContent, setHeroContent] = useState(null);
  const [statsContent, setStatsContent] = useState(null);
  const [featuresContent, setFeaturesContent] = useState(null);
  const [globalSettings, setGlobalSettings] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchHomepageContent();
    fetchGlobalSettings();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      // Fetch hero content
      const { data: heroData } = await supabase
        .from('homepage_content_2025_10_14_03_00')
        .select('*')
        .eq('section_name', 'hero')
        .eq('subsection_name', 'main_content')
        .single();

      if (heroData) setHeroContent(heroData.content);

      // Fetch stats content
      const { data: statsData } = await supabase
        .from('homepage_content_2025_10_14_03_00')
        .select('*')
        .eq('section_name', 'stats')
        .eq('subsection_name', 'numbers')
        .single();

      if (statsData) setStatsContent(statsData.content);

      // Fetch features content
      const { data: featuresData } = await supabase
        .from('homepage_content_2025_10_14_03_00')
        .select('*')
        .eq('section_name', 'features')
        .eq('subsection_name', 'main_features')
        .single();

      if (featuresData) setFeaturesContent(featuresData.content);
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    }
  };

  const fetchGlobalSettings = async () => {
    try {
      const { data } = await supabase
        .from('website_global_settings_2025_10_14_03_00')
        .select('*');

      if (data) {
        const settings = {};
        data.forEach(setting => {
          if (!settings[setting.setting_category]) {
            settings[setting.setting_category] = {};
          }
          settings[setting.setting_category][setting.setting_name] = setting.setting_value;
        });
        setGlobalSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching global settings:', error);
    }
  };

  // Default fallback content
  const defaultHero = {
    title: "Your Path to U.S. Higher Education",
    subtitle: "Comprehensive guidance for international and underprivileged students with AI-powered scholarship matching and real-time updates.",
    primary_button: { text: "Try AI Scholarship Finder", link: "/auto-scholarships" },
    secondary_button: { text: "Browse Scholarships", link: "/scholarships" }
  };

  const defaultStats = {
    stats: [
      { number: 100, label: "Scholarships Available", suffix: "+", color: "text-blue-600" },
      { number: 0, label: "Partner Universities", suffix: "+", color: "text-green-600" },
      { number: 95, label: "Success Rate", suffix: "%", color: "text-purple-600" },
      { number: 24, label: "AI Support", suffix: "/7", color: "text-orange-600" }
    ]
  };

  const defaultFeatures = {
    title: "Powerful Tools for Your Success",
    subtitle: "Everything you need to navigate the complex world of U.S. college admissions",
    features: [
      {
        title: "AI Scholarship Finder",
        description: "Get personalized scholarship recommendations using advanced AI matching algorithms.",
        icon: "Search",
        color: "from-blue-500 to-blue-600",
        link: "/auto-scholarships"
      },
      {
        title: "Cost Calculator",
        description: "Calculate your total education costs with our comprehensive financial planning tool.",
        icon: "Calculator",
        color: "from-green-500 to-green-600",
        link: "/cost-calculator"
      },
      {
        title: "College Database",
        description: "Explore thousands of colleges with detailed information and comparison tools.",
        icon: "GraduationCap",
        color: "from-purple-500 to-purple-600",
        link: "/colleges"
      }
    ]
  };

  const hero = heroContent || defaultHero;
  const stats = statsContent || defaultStats;
  const features = featuresContent || defaultFeatures;

  const getIconComponent = (iconName) => {
    const icons = {
      Search,
      Calculator,
      GraduationCap,
      Award,
      TrendingUp,
      Clock,
      Users
    };
    return icons[iconName] || Search;
  };

  const backgroundGradient = globalSettings?.colors?.background_gradients?.hero_gradient || "from-blue-50 via-white to-purple-50";

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br ${backgroundGradient} relative`}>
      {/* Animated Background Threads */}
      <AnimatedThreads />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 float-animation"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 float-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 float-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className={`${isVisible ? 'slide-in-up' : 'opacity-0'}`}>
            <Magnetic>
              <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium pulse-animation">
                <Sparkles className="w-4 h-4 mr-2 sparkle-animation" />
                AI-Powered College Guidance
              </Badge>
            </Magnetic>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block mb-2">Your Path to</span>
              <ShinyText 
                text={hero.title || "U.S. Higher Education"}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
              />
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              {hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Magnetic strength={0.2}>
                <Link to={hero.primary_button?.link || "/auto-scholarships"}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Search className="mr-2 h-5 w-5" />
                    {hero.primary_button?.text || "Try AI Scholarship Finder"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link to={hero.secondary_button?.link || "/scholarships"}>
                  <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {hero.secondary_button?.text || "Browse Scholarships"}
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.stats?.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon) || Award;
              return (
                <Magnetic key={index} strength={0.1}>
                  <div className="text-center interactive-card bg-white rounded-2xl p-6 shadow-lg">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 pulse-animation`}>
                      <IconComponent className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      <CountUp 
                        end={stat.number} 
                        suffix={stat.suffix} 
                        prefix={stat.prefix}
                      />
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </Magnetic>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.features?.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <Magnetic key={index} strength={0.15}>
                  <Link to={feature.link} className="group">
                    <Card className="interactive-card h-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl">
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 pulse-animation`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          <ShinyText text={feature.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <CardDescription className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                        <div className="mt-4 flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </Magnetic>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
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
  Calculator,
  CheckCircle,
  Rocket
} from 'lucide-react';

import { ShinyText } from '@/components/animations/ShinyText';
import { Magnetic } from '@/components/animations/Magnetic';
import { CountUp } from '@/components/animations/CountUp';

const Index = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [heroContent, setHeroContent] = useState(null);
  const [statsContent, setStatsContent] = useState(null);
  const [featuresContent, setFeaturesContent] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const { data: heroData } = await supabase
        .from('homepage_content_2025_10_14_03_00')
        .select('*')
        .eq('section_name', 'hero')
        .eq('subsection_name', 'main_content')
        .single();

      if (heroData) setHeroContent(heroData.content);

      const { data: statsData } = await supabase
        .from('homepage_content_2025_10_14_03_00')
        .select('*')
        .eq('section_name', 'stats')
        .eq('subsection_name', 'numbers')
        .single();

      if (statsData) setStatsContent(statsData.content);

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

  const defaultHero = {
    title: "Your Path to U.S. Higher Education",
    subtitle: "Comprehensive guidance for international and underprivileged students with AI-powered scholarship matching and real-time updates.",
    primary_button: { text: "Try AI Scholarship Finder", link: "/auto-scholarships" },
    secondary_button: { text: "Browse Scholarships", link: "/scholarships" }
  };

  const defaultStats = {
    stats: [
      { number: 500, label: "Students Helped", suffix: "+", color: "text-blue-600", icon: "Users" },
      { number: 2.5, label: "Million in Aid Found", prefix: "$", suffix: "M", color: "text-green-600", icon: "DollarSign" },
      { number: 95, label: "Success Rate", suffix: "%", color: "text-purple-600", icon: "TrendingUp" },
      { number: 1000, label: "Scholarships Available", suffix: "+", color: "text-orange-600", icon: "Award" }
    ]
  };

  const defaultFeatures = {
    features: [
      {
        title: "AI Scholarship Finder",
        description: "Get personalized scholarship recommendations using advanced AI matching algorithms and real-time web search.",
        icon: "Search",
        color: "from-blue-500 to-blue-600",
        link: "/auto-scholarships"
      },
      {
        title: "Cost Calculator",
        description: "Calculate your total education costs with our comprehensive financial planning tool tailored to your profile.",
        icon: "Calculator",
        color: "from-green-500 to-green-600",
        link: "/cost-calculator"
      },
      {
        title: "College Database",
        description: "Explore thousands of colleges with detailed information, comparison tools, and acceptance predictions.",
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
      Search, Calculator, GraduationCap, Award, TrendingUp, Clock, Users, DollarSign, Target
    };
    return icons[iconName] || Search;
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-100 relative overflow-visible">
      <div className="absolute inset-0 bg-white/50"></div>
      
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-3 text-base font-medium">
              <Rocket className="w-5 h-5 mr-2" />
              AI-Powered College Guidance Platform
            </Badge>
            
            <motion.h1 
              className="text-7xl md:text-8xl font-black mb-8 leading-normal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="block mb-4 text-gray-900">
                Your Path to
              </span>
              <span className="block bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 bg-clip-text text-transparent">
                U.S. Higher Education
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {hero.subtitle}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link to="/auto-scholarships">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Try AI Scholarship Finder
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link to="/scholarships">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-7 text-xl font-bold transition-all duration-300">
                  <BookOpen className="mr-3 h-6 w-6" />
                  Browse Scholarships
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="flex flex-wrap justify-center gap-8 text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>501(c)(3) Nonprofit (pending)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>AI-Powered Matching</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {stats.stats?.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-5xl font-black text-gray-900 mb-3">
                    <CountUp end={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <div className="text-gray-700 text-lg font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-black text-gray-900 mb-6">
              Powerful Tools for Your Success
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to navigate the complex world of U.S. college admissions
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {features.features?.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link to={feature.link}>
                    <Card className="h-full bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
                      <CardHeader className="text-center pb-6">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <CardDescription className="text-gray-700 leading-relaxed text-lg mb-6">
                          {feature.description}
                        </CardDescription>
                        <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700 text-lg">
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-black text-gray-900 mb-8">
              Ready to Start Your Journey?
            </h2>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Join thousands of students who have found their path to U.S. higher education
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-8 text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Rocket className="mr-3 h-7 w-7 group-hover:translate-y-[-4px] transition-transform" />
                Get Started Free
                <Sparkles className="ml-3 h-7 w-7 group-hover:rotate-180 transition-transform duration-500" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
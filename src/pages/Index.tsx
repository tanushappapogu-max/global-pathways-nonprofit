import React, { useState, useEffect } from 'react';
import { GraduationCap, Globe, DollarSign, Users, BookOpen, ArrowRight, Sparkles, Star, Award, Search, Calculator, CheckCircle, Rocket, TrendingUp, Target, Zap, Heart, Shield, Clock } from 'lucide-react';

const ShinyText = ({ children, className = "" }) => {
  return (
    <span className={`inline-block animate-shimmer bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

const CountUp = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [end]);
  
  return <span>{prefix}{count}{suffix}</span>;
};

const Index = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const stats = [
    { number: 500, label: "Students Helped", suffix: "+", icon: Users },
    { number: 2.5, label: "Million in Aid Found", prefix: "$", suffix: "M", icon: DollarSign },
    { number: 95, label: "Success Rate", suffix: "%", icon: TrendingUp },
    { number: 1000, label: "Scholarships Available", suffix: "+", icon: Award }
  ];

  const features = [
    {
      title: "AI Scholarship Finder",
      description: "Get personalized scholarship recommendations using advanced AI matching algorithms and real-time web search.",
      icon: Search,
      badge: "Most Popular"
    },
    {
      title: "Cost Calculator",
      description: "Calculate your total education costs with our comprehensive financial planning tool tailored to your profile.",
      icon: Calculator,
      badge: "Essential"
    },
    {
      title: "College Database",
      description: "Explore thousands of colleges with detailed information, comparison tools, and acceptance predictions.",
      icon: GraduationCap,
      badge: "Comprehensive"
    }
  ];

  const benefits = [
    { icon: Shield, text: "501(c)(3) Nonprofit (pending)" },
    { icon: Heart, text: "100% Free" },
    { icon: Sparkles, text: "AI-Powered Matching" }
  ];

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-300 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-blue-900 text-white rounded-full font-semibold shadow-lg border-0">
              <Rocket className="w-5 h-5" />
              <span>AI-Powered College Guidance Platform</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
              <span className="block mb-4 text-gray-900">
                Your Path to
              </span>
              <span className="block text-gray-900">
                U.S. Higher Education
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Comprehensive guidance for international and underprivileged students with AI-powered scholarship matching and real-time updates.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button className="group px-10 py-7 bg-blue-900 text-white rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="flex items-center justify-center gap-3">
                  <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                  Try AI Scholarship Finder
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              
              <button className="group px-10 py-7 bg-white border-2 border-blue-900 text-blue-900 rounded-xl text-xl font-bold shadow-lg hover:bg-blue-900 hover:text-white transition-all duration-300">
                <span className="flex items-center justify-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Browse Scholarships
                </span>
              </button>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-700">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black text-gray-900 mb-6">
              Powerful Tools for Your Success
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to navigate the complex world of U.S. college admissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <div className="text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold text-lg group-hover:text-blue-700">
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-blue-900 flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-5xl font-black text-gray-900 mb-3">
                      <CountUp end={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
                    </div>
                    <div className="text-gray-700 text-lg font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-16 shadow-xl border border-gray-200">
            <h2 className="text-6xl font-black text-gray-900 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Join thousands of students who have found their path to U.S. higher education
            </p>
            
            <button className="group px-12 py-8 bg-blue-900 text-white rounded-xl text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="flex items-center justify-center gap-3">
                <Rocket className="w-7 h-7 group-hover:-translate-y-1 transition-transform" />
                Get Started Free
                <Sparkles className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
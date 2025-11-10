import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CountUp } from '@/components/animations/CountUp';
import { 
  GraduationCap, 
  Users, 
  Award, 
  TrendingUp, 
  Target, 
  Eye, 
  Lightbulb, 
  Shield, 
  ArrowRight,
  Mail,
  Linkedin,
  Heart,
  Rocket
} from 'lucide-react';

const AboutPage = () => {
  const { user } = useAuth();
  const [aboutContent, setAboutContent] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
    fetchTeamMembers();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us_content_2025_10_14_03_00')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error fetching about content:', error);
        return;
      }

      const contentMap = {};
      data.forEach(item => {
        if (!contentMap[item.section_name]) {
          contentMap[item.section_name] = {};
        }
        contentMap[item.section_name][item.subsection_name] = item.content;
      });

      setAboutContent(contentMap);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members_2025_10_14_03_00')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error fetching team members:', error);
        return;
      }

      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      target: Target,
      eye: Eye,
      'universal-access': Users,
      lightbulb: Lightbulb,
      'shield-check': Shield,
      'trending-up': TrendingUp,
      heart: Heart,
      rocket: Rocket
    };
    return icons[iconName] || Target;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading about page...</p>
        </div>
      </div>
    );
  }

  const hero = aboutContent.hero?.main_content || {
    title: "About Global Pathways",
    subtitle: "Empowering Students Worldwide",
    description: "We are dedicated to breaking down barriers and creating opportunities for students to access higher education."
  };

  const mission = aboutContent.mission?.our_mission || {
    title: "Our Mission",
    content: "To democratize access to U.S. higher education by providing free, comprehensive resources and guidance to students worldwide."
  };

  const vision = aboutContent.vision?.our_vision || {
    title: "Our Vision", 
    content: "A world where every student, regardless of background or circumstance, has the knowledge and tools to pursue higher education."
  };

  const values = aboutContent.values?.core_values || {
    title: "Our Core Values",
    values: []
  };

  const story = aboutContent.story?.our_story || {
    title: "Our Story",
    content: "Global Pathways was founded with a simple belief: that financial barriers should never stand between talented students and their educational dreams.",
    timeline: []
  };

  const impact = aboutContent.impact?.our_impact || {
    title: "Our Impact",
    stats: []
  };

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity }} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
              <GraduationCap className="w-5 h-5 mr-2" />
              About Us
            </Badge>
            
            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
              <span className="block bg-black bg-clip-text text-transparent mb-4">
                {hero.title.split(' ')[0]}
              </span>
              <span className="block bg-black bg-clip-text text-transparent">
                {hero.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl mb-8 text-gray-900 font-semibold">
              {hero.subtitle}
            </p>
            
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-700">
              {hero.description}
            </p>

            {hero.cta_button && (
              <div className="mt-12">
                <Button 
                  size="lg" 
                  className="bg-blue-900 hover:to-purple-700 text-white px-10 py-6 text-lg font-semibold"
                >
                  {hero.cta_button.text || "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full bg-white  border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-900 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-black mb-4">
                    {mission.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-center text-lg">
                    {mission.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full bg-white border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-900 to-blue-900 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-black mb-4">
                    {vision.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-center text-lg">
                    {vision.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {values.values && values.values.length > 0 && (
        <section className="py-16 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                {values.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="text-center bg-white border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {value.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Impact Statistics */}
      {impact.stats && impact.stats.length > 0 && (
        <section className="py-16 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                {impact.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impact.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center bg-white border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300">
                    <CardContent className="pt-8 pb-8">
                      <div className="text-5xl font-black text-blue-900 mb-3">
                        <CountUp 
                          end={stat.number} 
                          suffix={stat.suffix}
                          prefix={stat.prefix}
                        />
                      </div>
                      <div className="text-xl font-bold text-gray-900 mb-2">
                        {stat.label}
                      </div>
                      <div className="text-sm text-gray-700">
                        {stat.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Story */}
      <section className="py-16 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              {story.title}
            </h2>
          </div>

          <Card className="bg-white border-white/10 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-700">
                {story.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>

              {story.timeline && story.timeline.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Journey</h3>
                  <div className="space-y-6">
                    {story.timeline.map((milestone, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-6"
                      >
                        <div className="flex-shrink-0 w-20 h-20 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                          {milestone.year}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {milestone.milestone}
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Members */}
      {teamMembers.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="block bg-black bg-clip-text text-transparent mb-4">Meet Our</span>
                <span className="block bg-black bg-clip-text text-transparent">Team</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                The passionate people behind Global Pathways, dedicated to your success
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="text-center bg-white border-white/10 shadow-2xl hover:border-blue-400/50 transition-all duration-300 group h-full">
                    <CardHeader className="pb-4">
                      <div className="w-32 h-32 rounded-full bg-blue-900 flex items-center justify-center mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {member.image_url ? (
                          <img 
                            src={member.image_url.startsWith('http') ? member.image_url : `${supabase.supabaseUrl}/storage/v1/object/public/team-images/${member.image_url}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${member.image_url ? 'hidden' : 'flex'}`}>
                          <Users className="h-16 w-16 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-black mb-2">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-blue-900 font-medium text-base">
                        {member.position}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 text-sm mb-6 leading-relaxed line-clamp-4">
                        {member.bio}
                      </p>
                      <div className="flex justify-center space-x-3">
                        {member.email && (
                          <Button variant="ghost" size="sm" className="text-gray-900 hover:bg-blue-400" asChild>
                            <a href={`mailto:${member.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {member.linkedin_url && (
                          <Button variant="ghost" size="sm" className="text-gray-900 hover:bg-white/10 hover:text-blue-500" asChild>
                            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Team Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { end: teamMembers.length, suffix: "+", label: "Team Members" },
                { end: 50, suffix: "+", label: "Years Combined Experience" },
                { end: 15, suffix: "+", label: "Countries Represented" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                >
                  <Card className="text-center bg-white border-white/10 shadow-2xl">
                    <CardContent className="pt-8 pb-8">
                      <div className="text-5xl font-black text-blue-900 mb-3">
                        <CountUp end={stat.end} suffix={stat.suffix} />
                      </div>
                      <div className="text-gray-700 text-lg">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
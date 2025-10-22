import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  ExternalLink
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';
import { Magnetic } from '@/components/animations/Magnetic';
import { CountUp } from '@/components/animations/CountUp';

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
      'trending-up': TrendingUp
    };
    return icons[iconName] || Target;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about page...</p>
        </div>
      </div>
    );
  }

  const hero = aboutContent.hero?.main_content || {
    title: "About Global Pathways",
    subtitle: "Empowering Students Worldwide",
    description: "We are dedicated to breaking down barriers and creating opportunities for students."
  };

  const mission = aboutContent.mission?.our_mission || {
    title: "Our Mission",
    content: "To democratize access to U.S. higher education."
  };

  const vision = aboutContent.vision?.our_vision || {
    title: "Our Vision", 
    content: "A world where education is accessible to all."
  };

  const values = aboutContent.values?.core_values || {
    title: "Our Core Values",
    values: []
  };

  const story = aboutContent.story?.our_story || {
    title: "Our Story",
    content: "Global Pathways was founded to help students achieve their dreams.",
    timeline: []
  };

  const impact = aboutContent.impact?.our_impact || {
    title: "Our Impact",
    stats: []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto">
          <Magnetic>
            <Badge className="mb-6 bg-white/20 text-white border-0 px-6 py-2 text-sm font-medium">
              <GraduationCap className="w-4 h-4 mr-2" />
              About Us
            </Badge>
          </Magnetic>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <ShinyText text={hero.title} className="text-white" />
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {hero.subtitle}
          </p>
          
          <p className="text-lg max-w-3xl mx-auto leading-relaxed opacity-80">
            {hero.description}
          </p>

          {hero.cta_button && (
            <div className="mt-8">
              <Magnetic>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  {hero.cta_button.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Magnetic>
            </div>
          )}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Magnetic>
              <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4`}>
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    <ShinyText text={mission.title} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {mission.content}
                  </p>
                </CardContent>
              </Card>
            </Magnetic>

            <Magnetic>
              <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4`}>
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    <ShinyText text={vision.title} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {vision.content}
                  </p>
                </CardContent>
              </Card>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {values.values && values.values.length > 0 && (
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <ShinyText text={values.title} />
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <Magnetic key={index}>
                    <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg font-bold">
                          {value.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Magnetic>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Impact Statistics */}
      {impact.stats && impact.stats.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <ShinyText text={impact.title} />
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impact.stats.map((stat, index) => (
                <Magnetic key={index}>
                  <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      <CountUp 
                        end={stat.number} 
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                      />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.description}
                    </div>
                  </div>
                </Magnetic>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Story */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <ShinyText text={story.title} />
            </h2>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none text-gray-600">
                {story.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {story.timeline && story.timeline.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Journey</h3>
                  <div className="space-y-4">
                    {story.timeline.map((milestone, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {milestone.year}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {milestone.milestone}
                          </h4>
                          <p className="text-gray-600">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Members - Full Width Bottom Section */}
      {teamMembers.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <ShinyText text="Meet Our Team" className="text-white" />
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                The passionate people behind Global Pathways, dedicated to your success
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Magnetic key={member.id}>
                  <Card className="text-center bg-white/10 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/20 group">
                    <CardHeader className="pb-4">
                      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        {member.image_url ? (
                          <img 
                            src={member.image_url.startsWith('http') ? member.image_url : `${supabase.supabaseUrl}/storage/v1/object/public/team-images/${member.image_url}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to default icon if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${member.image_url ? 'hidden' : 'flex'}`}>
                          <Users className="h-16 w-16 text-white/80" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-white mb-2">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-blue-200 font-medium text-base">
                        {member.position}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-white/90 text-sm mb-6 leading-relaxed line-clamp-4">
                        {member.bio}
                      </p>
                      <div className="flex justify-center space-x-3">
                        {member.email && (
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white" asChild>
                            <a href={`mailto:${member.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {member.linkedin_url && (
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white" asChild>
                            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Magnetic>
              ))}
            </div>

            {/* Team Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">
                  <CountUp end={teamMembers.length} suffix="+" />
                </div>
                <div className="text-white/90">Team Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">
                  <CountUp end={50} suffix="+" />
                </div>
                <div className="text-white/90">Years Combined Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">
                  <CountUp end={15} suffix="+" />
                </div>
                <div className="text-white/90">Countries Represented</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
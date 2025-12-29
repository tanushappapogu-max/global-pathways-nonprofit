import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
import { 
  Building, 
  ExternalLink, 
  Mail, 
  Users, 
  GraduationCap,
  BookOpen,
  MapPin,
  Heart,
  Handshake,
  Star,
  Award,
  School,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Target,
  TrendingUp,
  Rocket
} from 'lucide-react';

interface Partner {
  id: string;
  partner_name: string;
  partner_type: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  location?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners_2025_10_14_03_00')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPartnersByType = () => {
    const grouped: { [key: string]: Partner[] } = {};
    partners.forEach(partner => {
      if (!grouped[partner.partner_type]) {
        grouped[partner.partner_type] = [];
      }
      grouped[partner.partner_type].push(partner);
    });
    return grouped;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'university': return <GraduationCap className="h-6 w-6" />;
      case 'high_school': return <School className="h-6 w-6" />;
      case 'nonprofit': return <Heart className="h-6 w-6" />;
      case 'library': return <BookOpen className="h-6 w-6" />;
      case 'community_center': return <Users className="h-6 w-6" />;
      case 'scholarship_org': return <Award className="h-6 w-6" />;
      default: return <Building className="h-6 w-6" />;
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'university': return 'Universities & Colleges';
      case 'high_school': return 'High Schools';
      case 'nonprofit': return 'Nonprofit Organizations';
      case 'library': return 'Libraries';
      case 'community_center': return 'Community Centers';
      case 'scholarship_org': return 'Scholarship Organizations';
      default: return 'Other Partners';
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'university': return 'Higher education institutions committed to accessible admissions';
      case 'high_school': return 'Educational institutions helping students navigate college admissions';
      case 'nonprofit': return 'Organizations dedicated to expanding educational opportunities';
      case 'library': return 'Public libraries providing college planning resources';
      case 'community_center': return 'Community centers supporting local students';
      case 'scholarship_org': return 'Organizations providing financial support for education';
      default: return 'Other organizations supporting our mission';
    }
  };

  const advisoryBoard = [
    {
      name: 'Tanush Appapogu',
      title: 'Co-Founder & CEO',
      organization: 'Downingtown East Highschool',
      bio: 'Highschool student with a passion for helping others.',
    },
    {
      name: 'Shriyan Ghati',
      title: 'Co-Founder & CFO',
      organization: 'Downingtown STEM Acheademy',
      bio: 'Dedicated student helping first-generation college students navigate the admissions process.',
    },
    {
      name: 'Neel Vangala',
      title: 'Co-Founder & COO',
      organization: 'Downingtown East Highschool',
      bio: 'Leading initiatives to increase college enrollment among underrepresented students.',
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading partners...</p>
        </div>
      </div>
    );
  }

  const partnersByType = getPartnersByType();

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-8 bg-blue-900 border-0 px-6 py-3 text-base font-medium">
              <Handshake className="w-5 h-5 mr-2" />
              Building a Network of Support
            </Badge>
            
            <motion.h1 className="text-7xl md:text-8xl font-black mb-8 leading-[1.3]">
              <span className="block mb-4 text-gray-900">
                Our Partner
              </span>
              <span className="inline-block bg-gray-900 bg-clip-text text-transparent pb-2">
                Network
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Working together with schools, organizations, and communities to expand college access for all students
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-8 text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Nationwide Network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Proven Results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Community Focused</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
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
            {[
              { number: partners.length, label: "Partner Organizations", suffix: "+", icon: Building },
              { number: 50, label: "Students Reached", suffix: "K+", icon: Users },
              { number: 26, label: "Aid Unlocked", prefix: "$", suffix: "M+", icon: Award },
              { number: 95, label: "Success Rate", suffix: "%", icon: TrendingUp }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
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
                  <div className="w-20 h-20 rounded-2xl bg-blue-900 flex items-center justify-center mx-auto mb-6 shadow-lg">
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

      {/* Partner Organizations Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-black text-gray-900 mb-6">
              Partner Organizations
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
              Schools and organizations that trust Global Pathways to support their students
            </p>
          </motion.div>

          {Object.keys(partnersByType).length === 0 ? (
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="text-center py-16">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No partners yet</h3>
                <p className="text-gray-600">Check back soon for our growing network of partners!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-16">
              {Object.entries(partnersByType).map(([type, typePartners]) => (
                <div key={type}>
                  <motion.div 
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-4 bg-blue-900 rounded-2xl mr-6 shadow-lg">
                      <div className="text-white">
                        {getTypeIcon(type)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{getTypeTitle(type)}</h3>
                      <p className="text-lg text-gray-600">{getTypeDescription(type)}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                    {typePartners.map((partner, index) => (
                      <motion.div
                        key={partner.id}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ y: -10 }}
                        className="group"
                      >
                        <Card className="h-full bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
                          <CardContent className="pt-8">
                            <div className="mb-6">
                              {partner.logo_url ? (
                                <img
                                  src={partner.logo_url}
                                  alt={partner.partner_name}
                                  className="h-16 w-auto mb-4"
                                />
                              ) : (
                                <div className="h-16 w-16 bg-blue-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
                                  <div className="text-white">
                                    {getTypeIcon(partner.partner_type)}
                                  </div>
                                </div>
                              )}
                              <h4 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {partner.partner_name}
                              </h4>
                              <Badge className="mb-4 bg-blue-100 text-blue-900 border-blue-200">
                                {partner.partner_type.replace('_', ' ')}
                              </Badge>
                              {partner.description && (
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                  {partner.description}
                                </p>
                              )}
                              {partner.location && (
                                <div className="flex items-center text-gray-600 text-sm mb-4">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {partner.location}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3">
                              {partner.website_url && (
                                <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-900 hover:bg-blue-50 hover:border-blue-400" asChild>
                                  <a
                                    href={partner.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Visit
                                  </a>
                                </Button>
                              )}
                              {partner.contact_email && (
                                <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-900 hover:bg-blue-50 hover:border-blue-400" asChild>
                                  <a
                                    href={`mailto:${partner.contact_email}`}
                                    className="flex items-center justify-center"
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact
                                  </a>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Advisory Board Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-black text-gray-900 mb-6">
              Advisory Board
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
              Experienced educators and financial aid professionals guiding our mission
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
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
            {advisoryBoard.map((advisor, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="text-center bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="pt-10">
                    <div className="w-32 h-32 bg-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <Users className="h-16 w-16 text-white" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{advisor.name}</h4>
                    <p className="text-blue-600 font-semibold mb-1 text-lg">{advisor.title}</p>
                    <p className="text-gray-600 mb-4">{advisor.organization}</p>
                    <p className="text-gray-700 leading-relaxed">{advisor.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-black text-gray-900 mb-6">
              Partnership Benefits
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
              What our partners gain by working with Global Pathways
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
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
            {[
              {
                icon: Users,
                title: 'Student Support',
                description: 'Enhanced resources and tools for your students\' college journey'
              },
              {
                icon: Star,
                title: 'Improved Outcomes',
                description: 'Higher FAFSA completion rates and college enrollment success'
              },
              {
                icon: BookOpen,
                title: 'Training & Resources',
                description: 'Professional development and educational materials for staff'
              },
              {
                icon: Handshake,
                title: 'Community Impact',
                description: 'Be part of a movement expanding college access nationwide'
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="text-center bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
                    <CardContent className="pt-8">
                      <div className="w-20 h-20 bg-blue-900 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="font-bold text-xl text-gray-900 mb-4">{benefit.title}</h4>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 relative">
        <div className="max-w-5xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-black text-gray-900 mb-8">
              Become a Partner
            </h2>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Join our network of organizations committed to expanding college access and helping students achieve their dreams
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="mailto:info@globalpathwaysnonprofit.org">
  <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-8 text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 group">
    <Mail className="mr-3 h-7 w-7" />
    Contact Us
    <Sparkles className="ml-3 h-7 w-7 group-hover:rotate-180 transition-transform duration-500" />
  </Button>
</a>            
              <a href="/partnership-proposal.pdf" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 px-12 py-8 text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <ArrowRight className="mr-3 h-7 w-7" />
                  View Proposal
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
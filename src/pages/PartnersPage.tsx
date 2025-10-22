import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
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
  Globe,
  School,
  Building2
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';
import { Magnetic } from '@/components/animations/Magnetic';
import { CountUp } from '@/components/animations/CountUp';

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'university': return 'from-blue-500 to-blue-600';
      case 'high_school': return 'from-green-500 to-green-600';
      case 'nonprofit': return 'from-purple-500 to-purple-600';
      case 'library': return 'from-orange-500 to-orange-600';
      case 'community_center': return 'from-pink-500 to-pink-600';
      case 'scholarship_org': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const advisoryBoard = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Former Financial Aid Director, State University',
      bio: 'Over 20 years of experience in financial aid administration and student support services.',
      image: '/images/advisor1.jpg'
    },
    {
      name: 'Maria Rodriguez',
      title: 'High School Counselor, Lincoln High School',
      bio: 'Dedicated counselor helping first-generation college students navigate the admissions process.',
      image: '/images/advisor2.jpg'
    },
    {
      name: 'James Chen',
      title: 'College Access Program Director',
      bio: 'Leading initiatives to increase college enrollment among underrepresented students.',
      image: '/images/advisor3.jpg'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading partners...</p>
        </div>
      </div>
    );
  }

  const partnersByType = getPartnersByType();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Magnetic>
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
              <Handshake className="w-4 h-4 mr-2" />
              Our Network
            </Badge>
          </Magnetic>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <ShinyText text="Our Partners" />
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Working together with schools, organizations, and communities to expand college access for all students
          </p>
        </div>

        {/* Partnership Impact */}
        <section className="mb-20">
          <Magnetic>
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
              <CardContent className="pt-12 pb-12">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-5xl font-bold mb-3">
                      <CountUp end={partners.length} suffix="+" />
                    </div>
                    <p className="text-blue-100 text-lg">Partner Organizations</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-3">
                      <CountUp end={50} suffix="K+" />
                    </div>
                    <p className="text-blue-100 text-lg">Students Reached</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-3">
                      <CountUp end={26} prefix="$" suffix="M+" />
                    </div>
                    <p className="text-blue-100 text-lg">Aid Unlocked</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-3">
                      <CountUp end={95} suffix="%" />
                    </div>
                    <p className="text-blue-100 text-lg">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Magnetic>
        </section>

        {/* Partner Organizations */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <ShinyText text="Partner Organizations" />
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Schools and organizations that trust Global Pathways to support their students
            </p>
          </div>

          <div className="space-y-16">
            {Object.entries(partnersByType).map(([type, typePartners]) => (
              <div key={type}>
                <Magnetic>
                  <div className="flex items-center mb-8">
                    <div className={`p-4 bg-gradient-to-br ${getTypeColor(type)} rounded-2xl mr-6 shadow-lg`}>
                      <div className="text-white">
                        {getTypeIcon(type)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{getTypeTitle(type)}</h3>
                      <p className="text-lg text-gray-600">{getTypeDescription(type)}</p>
                    </div>
                  </div>
                </Magnetic>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {typePartners.map((partner) => (
                    <Magnetic key={partner.id}>
                      <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group">
                        <CardContent className="pt-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              {partner.logo_url ? (
                                <img
                                  src={partner.logo_url}
                                  alt={partner.partner_name}
                                  className="h-16 w-auto mb-4"
                                />
                              ) : (
                                <div className={`h-16 w-16 bg-gradient-to-br ${getTypeColor(partner.partner_type)} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                                  <div className="text-white">
                                    {getTypeIcon(partner.partner_type)}
                                  </div>
                                </div>
                              )}
                              <h4 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {partner.partner_name}
                              </h4>
                              <Badge variant="outline" className="mb-4 text-sm">
                                {partner.partner_type.replace('_', ' ')}
                              </Badge>
                              {partner.description && (
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                  {partner.description}
                                </p>
                              )}
                              {partner.location && (
                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {partner.location}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            {partner.website_url && (
                              <Button variant="outline" size="sm" className="flex-1" asChild>
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
                              <Button variant="outline" size="sm" className="flex-1" asChild>
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
                    </Magnetic>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advisory Board */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <ShinyText text="Advisory Board" />
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced educators and financial aid professionals guiding our mission
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {advisoryBoard.map((advisor, index) => (
              <Magnetic key={index}>
                <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-10">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <Users className="h-16 w-16 text-white" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{advisor.name}</h4>
                    <p className="text-blue-600 font-semibold mb-4 text-lg">{advisor.title}</p>
                    <p className="text-gray-600 leading-relaxed">{advisor.bio}</p>
                  </CardContent>
                </Card>
              </Magnetic>
            ))}
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <ShinyText text="Partnership Benefits" />
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What our partners gain by working with Global Pathways
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Magnetic>
              <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-4">Student Support</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Enhanced resources and tools for your students' college journey
                  </p>
                </CardContent>
              </Card>
            </Magnetic>

            <Magnetic>
              <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-4">Improved Outcomes</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Higher FAFSA completion rates and college enrollment success
                  </p>
                </CardContent>
              </Card>
            </Magnetic>

            <Magnetic>
              <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-4">Training & Resources</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Professional development and educational materials for staff
                  </p>
                </CardContent>
              </Card>
            </Magnetic>

            <Magnetic>
              <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Handshake className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-4">Community Impact</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Be part of a movement expanding college access nationwide
                  </p>
                </CardContent>
              </Card>
            </Magnetic>
          </div>
        </section>

        {/* Become a Partner CTA */}
        <section className="text-center">
          <Magnetic>
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
              <CardContent className="pt-16 pb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <ShinyText text="Become a Partner" className="text-white" />
                </h2>
                <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Join our network of organizations committed to expanding college access and helping students achieve their dreams
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Magnetic>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg">
                      <Mail className="h-5 w-5 mr-3" />
                      Contact Us
                    </Button>
                  </Magnetic>
                  <Magnetic>
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                      <ExternalLink className="h-5 w-5 mr-3" />
                      Partnership Info
                    </Button>
                  </Magnetic>
                </div>
              </CardContent>
            </Card>
          </Magnetic>
        </section>
      </div>
    </div>
  );
};
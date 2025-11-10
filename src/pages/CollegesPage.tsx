import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';

import { 
  Search, 
  MapPin, 
  Users, 
  DollarSign, 
  GraduationCap, 
  ExternalLink,
  Filter,
  Star,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  X,
  School
} from 'lucide-react';

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  college_type: string;
  admission_rate?: number;
  tuition_in_state?: number;
  tuition_out_state?: number;
  total_cost?: number;
  undergraduate_enrollment?: number;
  need_blind_domestic?: boolean;
  need_blind_international?: boolean;
  meets_full_need?: boolean;
  no_loan_policy?: boolean;
  application_platform?: string;
  early_decision_deadline?: string;
  regular_decision_deadline?: string;
  sat_range_25th?: number;
  sat_range_75th?: number;
  act_range_25th?: number;
  act_range_75th?: number;
  gpa_average?: number;
  popular_majors?: string[];
  housing_guaranteed_years?: number;
  campus_setting?: string;
  website_url?: string;
  test_optional?: boolean;
}

export const CollegesPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [maxAdmissionRate, setMaxAdmissionRate] = useState<number | undefined>();
  const [maxTuition, setMaxTuition] = useState<number | undefined>();
  const [testOptionalOnly, setTestOptionalOnly] = useState(false);
  const [needBlindOnly, setNeedBlindOnly] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  const collegeTypes = [
    { value: 'ivy_league', label: 'Ivy League' },
    { value: 't20', label: 'Top 20 Universities' },
    { value: 'state_school', label: 'State Universities' },
    { value: 'liberal_arts', label: 'Liberal Arts Colleges' },
    { value: 'technical', label: 'Technical Schools' },
    { value: 'community', label: 'Community Colleges' }
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
  ];

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [colleges, searchTerm, selectedType, selectedState, maxAdmissionRate, maxTuition, testOptionalOnly, needBlindOnly]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges_database_2025_10_06_01_15')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...colleges];

    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(college => college.college_type === selectedType);
    }

    if (selectedState) {
      filtered = filtered.filter(college => college.state === selectedState);
    }

    if (maxAdmissionRate !== undefined) {
      filtered = filtered.filter(college =>
        college.admission_rate && college.admission_rate <= maxAdmissionRate
      );
    }

    if (maxTuition !== undefined) {
      filtered = filtered.filter(college =>
        college.tuition_out_state && college.tuition_out_state <= maxTuition
      );
    }

    if (testOptionalOnly) {
      filtered = filtered.filter(college => college.test_optional === true);
    }

    if (needBlindOnly) {
      filtered = filtered.filter(college => 
        college.need_blind_domestic === true || college.need_blind_international === true
      );
    }

    setFilteredColleges(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedState('');
    setMaxAdmissionRate(undefined);
    setMaxTuition(undefined);
    setTestOptionalOnly(false);
    setNeedBlindOnly(false);
  };

  const formatTuition = (inState?: number, outState?: number): string => {
    if (inState && outState && inState !== outState) {
      return `$${inState.toLocaleString()} (in-state) / $${outState.toLocaleString()} (out-of-state)`;
    }
    if (outState) return `$${outState.toLocaleString()}`;
    if (inState) return `$${inState.toLocaleString()}`;
    return 'Contact for pricing';
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'ivy_league': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 't20': return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'state_school': return 'bg-green-100 text-green-900 border-green-300';
      case 'liberal_arts': return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'technical': return 'bg-red-100 text-red-900 border-red-300';
      case 'community': return 'bg-gray-100 text-gray-900 border-gray-300';
      default: return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  const getTypeLabel = (type: string): string => {
    const typeObj = collegeTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const stats = [
    { number: colleges.length, label: "Total Colleges", suffix: "", color: "text-gray-900" },
    { number: filteredColleges.length, label: "Matching Results", suffix: "", color: "text-gray-900" },
    { number: colleges.filter(c => c.test_optional).length, label: "Test Optional", suffix: "", color: "text-gray-900" },
    { number: colleges.filter(c => c.meets_full_need).length, label: "Meet Full Need", suffix: "", color: "text-gray-900" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <GraduationCap className="w-5 h-5 mr-2" />
            College Database
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-[1.3] overflow-visible">
            <span className="block text-gray-900 mb-4">College</span>
            <span className="block text-gray-900">Explorer</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Discover and compare colleges that match your academic goals and preferences
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} 
              whileHover={{ scale: 1.05 }} 
              className="text-center bg-white backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-300"
            >
              <div className={`text-4xl font-black ${stat.color} mb-3`}>
                <CountUp end={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-gray-700 text-base font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: showTopButton ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-500 text-white p-4 rounded-full shadow-xl z-50"
          >
            ↑ Top
          </motion.button>

          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 text-2xl">
                  <Filter className="h-6 w-6 mr-2 text-blue-900" />
                  Filters
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Narrow down colleges by your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-900 text-base mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                    <Input
                      placeholder="Search colleges..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900 text-base mb-2 block">College Type</Label>
                  <Select value={selectedType || "none"} onValueChange={(value) => setSelectedType(value === "none" ? "" : value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All Types</SelectItem>
                      {collegeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-900 text-base mb-2 block">State</Label>
                  <Select value={selectedState || "none"} onValueChange={(value) => setSelectedState(value === "none" ? "" : value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-900 text-base mb-2 block">Max Admission Rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 20"
                    value={maxAdmissionRate || ''}
                    onChange={(e) => setMaxAdmissionRate(e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                  />
                </div>

                <div>
                  <Label className="text-gray-900 text-base mb-2 block">Max Tuition ($)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 50000"
                    value={maxTuition || ''}
                    onChange={(e) => setMaxTuition(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="testOptional"
                    checked={testOptionalOnly}
                    onCheckedChange={(checked) => setTestOptionalOnly(checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="testOptional" className="text-gray-700 cursor-pointer">
                    Test-optional only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needBlind"
                    checked={needBlindOnly}
                    onCheckedChange={(checked) => setNeedBlindOnly(checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="needBlind" className="text-gray-700 cursor-pointer">
                    Need-blind admissions
                  </Label>
                </div>

                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="w-full border-gray-300 text-gray-900 hover:bg-gray-100"
                >
                  Clear All Filters
                </Button>

                <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-300">
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {filteredColleges.length}
                  </div>
                  <div className="text-sm text-gray-700">colleges found</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {filteredColleges.length > 0 ? (
              <div className="space-y-6">
                {filteredColleges.map((college, index) => (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-3 text-gray-900">{college.name}</CardTitle>
                            <CardDescription className="flex items-center text-base mb-4 text-gray-600">
                              <MapPin className="h-5 w-5 mr-2" />
                              {college.location}
                            </CardDescription>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getTypeColor(college.college_type)}>
                                {getTypeLabel(college.college_type)}
                              </Badge>
                              {college.test_optional && (
                                <Badge variant="outline" className="border-gray-300 text-gray-700">Test Optional</Badge>
                              )}
                              {college.need_blind_domestic && (
                                <Badge variant="outline" className="border-gray-300 text-gray-700">Need Blind</Badge>
                              )}
                              {college.meets_full_need && (
                                <Badge variant="outline" className="border-gray-300 text-gray-700">Meets Full Need</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {college.admission_rate && (
                              <div className="text-2xl font-bold text-blue-900 mb-2">
                                {college.admission_rate}%
                              </div>
                            )}
                            <div className="text-sm text-gray-600 mb-1">acceptance rate</div>
                            <div className="text-base text-gray-900 font-medium">
                              {formatTuition(college.tuition_in_state, college.tuition_out_state)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Academic Profile</h4>
                            <div className="space-y-3 text-sm">
                              {college.undergraduate_enrollment && (
                                <div className="flex items-center text-gray-700">
                                  <Users className="h-5 w-5 mr-3 text-blue-900" />
                                  {college.undergraduate_enrollment.toLocaleString()} undergraduates
                                </div>
                              )}
                              {college.sat_range_25th && college.sat_range_75th && (
                                <div className="flex items-center text-gray-700">
                                  <GraduationCap className="h-5 w-5 mr-3 text-blue-900" />
                                  SAT: {college.sat_range_25th}-{college.sat_range_75th}
                                </div>
                              )}
                              {college.act_range_25th && college.act_range_75th && (
                                <div className="flex items-center text-gray-700">
                                  <GraduationCap className="h-5 w-5 mr-3 text-blue-900" />
                                  ACT: {college.act_range_25th}-{college.act_range_75th}
                                </div>
                              )}
                              {college.gpa_average && (
                                <div className="flex items-center text-gray-700">
                                  <Star className="h-5 w-5 mr-3 text-yellow-600" />
                                  Avg GPA: {college.gpa_average}
                                </div>
                              )}
                              {college.campus_setting && (
                                <div className="flex items-center text-gray-700">
                                  <MapPin className="h-5 w-5 mr-3 text-green-600" />
                                  {college.campus_setting.charAt(0).toUpperCase() + college.campus_setting.slice(1)} campus
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Application Details</h4>
                            <div className="space-y-3 text-sm">
                              {college.application_platform && (
                                <div className="flex items-center text-gray-700">
                                  <BookOpen className="h-5 w-5 mr-3 text-orange-600" />
                                  {college.application_platform}
                                </div>
                              )}
                              {college.regular_decision_deadline && (
                                <div className="flex items-center text-gray-700">
                                  <Calendar className="h-5 w-5 mr-3 text-pink-600" />
                                  Deadline: {new Date(college.regular_decision_deadline).toLocaleDateString()}
                                </div>
                              )}
                              {college.housing_guaranteed_years && college.housing_guaranteed_years > 0 && (
                                <div className="flex items-center text-gray-700">
                                  <Award className="h-5 w-5 mr-3 text-blue-900" />
                                  {college.housing_guaranteed_years} year{college.housing_guaranteed_years > 1 ? 's' : ''} housing guaranteed
                                </div>
                              )}
                              {college.no_loan_policy && (
                                <div className="flex items-center text-gray-700">
                                  <DollarSign className="h-5 w-5 mr-3 text-green-600" />
                                  No-loan policy
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {college.popular_majors && college.popular_majors.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3">Popular Majors</h4>
                            <div className="flex flex-wrap gap-2">
                              {college.popular_majors.slice(0, 6).map((major, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-900 border-gray-300">
                                  {major}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          {college.website_url && (
                            <Button variant="outline" size="sm" asChild className="border-gray-300 text-gray-900 hover:bg-gray-100">
                              <a 
                                href={college.website_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                Visit Website
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                          )}
                          
                          <Button size="sm" className="bg-blue-900 hover:bg-blue-500 text-white" asChild>
                            <a href="/college-comparison">
                              Add to Comparison
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
                <CardContent className="pt-12 pb-12 text-center">
                  <School className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Colleges Found</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Try adjusting your filters to find more colleges
                  </p>
                  <Button onClick={clearFilters} className="bg-blue-900 hover:bg-blue-500 text-white">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
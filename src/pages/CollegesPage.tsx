import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
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
  Award
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';
import { Magnetic } from '@/components/animations/Magnetic';

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
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [maxAdmissionRate, setMaxAdmissionRate] = useState<number | undefined>();
  const [maxTuition, setMaxTuition] = useState<number | undefined>();
  const [testOptionalOnly, setTestOptionalOnly] = useState(false);
  const [needBlindOnly, setNeedBlindOnly] = useState(false);

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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(college => college.college_type === selectedType);
    }

    // State filter
    if (selectedState) {
      filtered = filtered.filter(college => college.state === selectedState);
    }

    // Admission rate filter
    if (maxAdmissionRate !== undefined) {
      filtered = filtered.filter(college =>
        college.admission_rate && college.admission_rate <= maxAdmissionRate
      );
    }

    // Tuition filter
    if (maxTuition !== undefined) {
      filtered = filtered.filter(college =>
        college.tuition_out_state && college.tuition_out_state <= maxTuition
      );
    }

    // Test optional filter
    if (testOptionalOnly) {
      filtered = filtered.filter(college => college.test_optional === true);
    }

    // Need blind filter
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
      case 'ivy_league': return 'bg-purple-100 text-purple-800';
      case 't20': return 'bg-blue-100 text-blue-800';
      case 'state_school': return 'bg-green-100 text-green-800';
      case 'liberal_arts': return 'bg-orange-100 text-orange-800';
      case 'technical': return 'bg-red-100 text-red-800';
      case 'community': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string): string => {
    const typeObj = collegeTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <GraduationCap className="w-4 h-4 mr-2" />
            College Database
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="College Explorer" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and compare colleges that match your academic goals and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
                <CardDescription>
                  Narrow down colleges by your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search colleges..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* College Type */}
                <div>
                  <Label htmlFor="type">College Type</Label>
                  <Select value={selectedType || "none"} onValueChange={(value) => setSelectedType(value === "none" ? "" : value)}>
                    <SelectTrigger className="mt-1">
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

                {/* State */}
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={selectedState || "none"} onValueChange={(value) => setSelectedState(value === "none" ? "" : value)}>
                    <SelectTrigger className="mt-1">
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

                {/* Admission Rate */}
                <div>
                  <Label htmlFor="admissionRate">Max Admission Rate (%)</Label>
                  <Input
                    id="admissionRate"
                    type="number"
                    placeholder="e.g., 20"
                    value={maxAdmissionRate || ''}
                    onChange={(e) => setMaxAdmissionRate(e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="mt-1"
                  />
                </div>

                {/* Max Tuition */}
                <div>
                  <Label htmlFor="tuition">Max Tuition ($)</Label>
                  <Input
                    id="tuition"
                    type="number"
                    placeholder="e.g., 50000"
                    value={maxTuition || ''}
                    onChange={(e) => setMaxTuition(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="mt-1"
                  />
                </div>

                {/* Test Optional */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="testOptional"
                    checked={testOptionalOnly}
                    onCheckedChange={(checked) => setTestOptionalOnly(checked as boolean)}
                  />
                  <Label htmlFor="testOptional" className="text-sm">
                    Test-optional only
                  </Label>
                </div>

                {/* Need Blind */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needBlind"
                    checked={needBlindOnly}
                    onCheckedChange={(checked) => setNeedBlindOnly(checked as boolean)}
                  />
                  <Label htmlFor="needBlind" className="text-sm">
                    Need-blind admissions
                  </Label>
                </div>

                {/* Clear Filters */}
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>

                {/* Results Count */}
                <div className="text-center text-sm text-gray-600">
                  {filteredColleges.length} colleges found
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colleges List */}
          <div className="lg:col-span-3">
            {filteredColleges.length > 0 ? (
              <div className="space-y-6">
                {filteredColleges.map((college) => (
                  <Magnetic key={college.id}>
                    <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{college.name}</CardTitle>
                            <CardDescription className="flex items-center text-base mb-3">
                              <MapPin className="h-4 w-4 mr-1" />
                              {college.location}
                            </CardDescription>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getTypeColor(college.college_type)}>
                                {getTypeLabel(college.college_type)}
                              </Badge>
                              {college.test_optional && (
                                <Badge variant="outline">Test Optional</Badge>
                              )}
                              {college.need_blind_domestic && (
                                <Badge variant="outline">Need Blind</Badge>
                              )}
                              {college.meets_full_need && (
                                <Badge variant="outline">Meets Full Need</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {college.admission_rate && (
                              <div className="text-lg font-semibold text-blue-600 mb-1">
                                {college.admission_rate}% acceptance
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              {formatTuition(college.tuition_in_state, college.tuition_out_state)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Academic Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Academic Profile</h4>
                            <div className="space-y-2 text-sm">
                              {college.undergraduate_enrollment && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                                  {college.undergraduate_enrollment.toLocaleString()} undergraduates
                                </div>
                              )}
                              {college.sat_range_25th && college.sat_range_75th && (
                                <div className="flex items-center">
                                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                                  SAT: {college.sat_range_25th}-{college.sat_range_75th}
                                </div>
                              )}
                              {college.gpa_average && (
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 mr-2 text-gray-400" />
                                  Avg GPA: {college.gpa_average}
                                </div>
                              )}
                              {college.campus_setting && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                  {college.campus_setting.charAt(0).toUpperCase() + college.campus_setting.slice(1)} campus
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Application Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
                            <div className="space-y-2 text-sm">
                              {college.application_platform && (
                                <div className="flex items-center">
                                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                                  {college.application_platform}
                                </div>
                              )}
                              {college.regular_decision_deadline && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  Deadline: {new Date(college.regular_decision_deadline).toLocaleDateString()}
                                </div>
                              )}
                              {college.housing_guaranteed_years && college.housing_guaranteed_years > 0 && (
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 mr-2 text-gray-400" />
                                  {college.housing_guaranteed_years} year{college.housing_guaranteed_years > 1 ? 's' : ''} housing guaranteed
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Popular Majors */}
                        {college.popular_majors && college.popular_majors.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Popular Majors</h4>
                            <div className="flex flex-wrap gap-2">
                              {college.popular_majors.slice(0, 5).map((major, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {major}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-6">
                          <div className="flex space-x-2">
                            {college.website_url && (
                              <Button variant="outline" size="sm" asChild>
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
                          </div>
                          
                          <Button size="sm" asChild>
                            <a href="/college-comparison">
                              Add to Comparison
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Magnetic>
                ))}
              </div>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="pt-12 pb-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Colleges Found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to find more colleges
                  </p>
                  <Button onClick={clearFilters}>
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Plus, 
  X, 
  DollarSign, 
  Users, 
  GraduationCap, 
  MapPin, 
  Star,
  TrendingUp,
  Award,
  ExternalLink,
  BookOpen,
  Home,
  Calculator,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';


interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  college_type: string;
  admission_rate: number;
  tuition_in_state: number;
  tuition_out_state: number;
  total_cost: number;
  undergraduate_enrollment: number;
  acceptance_rate_international: number;
  need_blind_domestic: boolean;
  need_blind_international: boolean;
  meets_full_need: boolean;
  no_loan_policy: boolean;
  average_aid_amount: number;
  application_platform: string;
  sat_range_25th: number;
  sat_range_75th: number;
  act_range_25th: number;
  act_range_75th: number;
  gpa_average: number;
  campus_setting: string;
  website_url: string;
  test_optional: boolean;
}

export const CollegeComparisonPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadColleges();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = colleges.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredColleges(filtered.slice(0, 10));
    } else {
      setFilteredColleges([]);
    }
  }, [searchTerm, colleges]);

  const loadColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges_database_2025_10_06_01_15')
        .select('*')
        .order('name');

      if (data && !error) {
        setColleges(data);
      }
    } catch (error) {
      console.error('Error loading colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCollegeToComparison = (college: College) => {
    if (selectedColleges.length < 4 && !selectedColleges.find(c => c.id === college.id)) {
      setSelectedColleges([...selectedColleges, college]);
      setSearchTerm('');
      setFilteredColleges([]);
    }
  };

  const removeCollegeFromComparison = (collegeId: string) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== collegeId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCollegeTypeColor = (type: string) => {
    switch (type) {
      case 'ivy_league': return 'bg-purple-100 text-purple-800';
      case 't20': return 'bg-blue-100 text-blue-800';
      case 'state_school': return 'bg-green-100 text-green-800';
      case 'liberal_arts': return 'bg-orange-100 text-orange-800';
      case 'technical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdmissionDifficulty = (rate: number) => {
    if (rate <= 10) return { label: 'Most Competitive', color: 'text-red-600', icon: AlertCircle };
    if (rate <= 25) return { label: 'Highly Competitive', color: 'text-orange-600', icon: AlertCircle };
    if (rate <= 50) return { label: 'Competitive', color: 'text-yellow-600', icon: Info };
    if (rate <= 75) return { label: 'Moderately Competitive', color: 'text-blue-600', icon: Info };
    return { label: 'Less Competitive', color: 'text-green-600', icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading colleges...</p>
          </div>
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
            <BarChart3 className="w-4 h-4 mr-2" />
            College Comparison
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Compare Colleges" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare up to 4 colleges side-by-side to make informed decisions about your education
          </p>
        </div>

        {/* College Search */}
        
          <Card className="mb-8 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Add Colleges to Compare
              </CardTitle>
              <CardDescription>
                Search and select up to 4 colleges to compare ({selectedColleges.length}/4 selected)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search colleges by name, location, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                
                {filteredColleges.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredColleges.map((college) => (
                      <div
                        key={college.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => addCollegeToComparison(college)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{college.name}</h4>
                            <p className="text-sm text-gray-600">{college.location}</p>
                          </div>
                          <Badge className={getCollegeTypeColor(college.college_type)}>
                            {college.college_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        

        {/* Selected Colleges for Comparison */}
        {selectedColleges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <ShinyText text="College Comparison" />
            </h2>
            
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {selectedColleges.map((college) => {
                    const difficulty = getAdmissionDifficulty(college.admission_rate);
                    const DifficultyIcon = difficulty.icon;
                    
                    return (
                      
                        <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-2">{college.name}</CardTitle>
                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {college.location}
                                </div>
                                <Badge className={getCollegeTypeColor(college.college_type)}>
                                  {college.college_type.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCollegeFromComparison(college.id)}
                                className="ml-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {/* Admission Stats */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Admission</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Acceptance Rate</span>
                                  <span className="font-medium">{college.admission_rate}%</span>
                                </div>
                                <div className="flex items-center">
                                  <DifficultyIcon className={`h-4 w-4 mr-1 ${difficulty.color}`} />
                                  <span className={`text-sm ${difficulty.color}`}>{difficulty.label}</span>
                                </div>
                              </div>
                            </div>

                            {/* Test Scores */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Test Scores</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">SAT Range</span>
                                  <span className="font-medium">{college.sat_range_25th}-{college.sat_range_75th}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">ACT Range</span>
                                  <span className="font-medium">{college.act_range_25th}-{college.act_range_75th}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Avg GPA</span>
                                  <span className="font-medium">{college.gpa_average}</span>
                                </div>
                                {college.test_optional && (
                                  <Badge variant="secondary" className="text-xs">Test Optional</Badge>
                                )}
                              </div>
                            </div>

                            {/* Costs */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Costs</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">In-State Tuition</span>
                                  <span className="font-medium">{formatCurrency(college.tuition_in_state)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Out-of-State</span>
                                  <span className="font-medium">{formatCurrency(college.tuition_out_state)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Total Cost</span>
                                  <span className="font-medium">{formatCurrency(college.total_cost)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Avg Aid</span>
                                  <span className="font-medium">{formatCurrency(college.average_aid_amount)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Financial Aid Policies */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Financial Aid</h4>
                              <div className="space-y-1">
                                {college.need_blind_domestic && (
                                  <Badge variant="secondary" className="text-xs mr-1 mb-1">Need-Blind (Domestic)</Badge>
                                )}
                                {college.need_blind_international && (
                                  <Badge variant="secondary" className="text-xs mr-1 mb-1">Need-Blind (Intl)</Badge>
                                )}
                                {college.meets_full_need && (
                                  <Badge variant="secondary" className="text-xs mr-1 mb-1">Meets Full Need</Badge>
                                )}
                                {college.no_loan_policy && (
                                  <Badge variant="secondary" className="text-xs mr-1 mb-1">No-Loan Policy</Badge>
                                )}
                              </div>
                            </div>

                            {/* Campus Info */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Campus</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Enrollment</span>
                                  <span className="font-medium">{college.undergraduate_enrollment?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Setting</span>
                                  <span className="font-medium capitalize">{college.campus_setting}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t">
                              <Button variant="outline" className="w-full" asChild>
                                <a href={college.website_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit Website
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedColleges.length === 0 && (
          
            <Card className="text-center py-12 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent>
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Colleges Selected</h3>
                <p className="text-gray-600 mb-6">
                  Search and add colleges above to start comparing them side-by-side
                </p>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Start Searching
                </Button>
              </CardContent>
            </Card>
          
        )}
      </div>
    </div>
  );
};
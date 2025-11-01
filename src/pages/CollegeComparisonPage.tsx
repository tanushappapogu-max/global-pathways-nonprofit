import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
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
      case 'ivy_league': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 't20': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'state_school': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'liberal_arts': return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'technical': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getAdmissionDifficulty = (rate: number) => {
    if (rate <= 10) return { label: 'Most Competitive', color: 'text-red-400', icon: AlertCircle };
    if (rate <= 25) return { label: 'Highly Competitive', color: 'text-orange-400', icon: AlertCircle };
    if (rate <= 50) return { label: 'Competitive', color: 'text-yellow-400', icon: Info };
    if (rate <= 75) return { label: 'Moderately Competitive', color: 'text-blue-400', icon: Info };
    return { label: 'Less Competitive', color: 'text-green-400', icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-8 py-3 text-base font-medium">
            <BarChart3 className="w-5 h-5 mr-2" />
            College Comparison Tool
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">Compare</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Colleges</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Compare up to 4 colleges side-by-side to make informed decisions about your education
          </p>
        </motion.div>

        {/* College Search */}
        <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white text-2xl">
              <Search className="h-6 w-6 mr-2 text-blue-400" />
              Add Colleges to Compare
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Search and select up to 4 colleges to compare ({selectedColleges.length}/4 selected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search colleges by name, location, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
              />
              
              {filteredColleges.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-white/20 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                  {filteredColleges.map((college) => (
                    <div
                      key={college.id}
                      className="p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                      onClick={() => addCollegeToComparison(college)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white text-base">{college.name}</h4>
                          <p className="text-sm text-gray-400">{college.location}</p>
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
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-black text-white mb-8">
              Side-by-Side Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {selectedColleges.map((college, index) => {
                    const difficulty = getAdmissionDifficulty(college.admission_rate);
                    const DifficultyIcon = difficulty.icon;
                    
                    return (
                      <motion.div
                        key={college.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-blue-400/50 transition-all">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2 text-white">{college.name}</CardTitle>
                                <div className="flex items-center text-gray-400 text-sm mb-3">
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
                                className="ml-2 border-white/20 text-white hover:bg-white/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {/* Admission Stats */}
                            <div>
                              <h4 className="font-semibold text-white mb-3 text-base">Admission</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">Acceptance Rate</span>
                                  <span className="font-medium text-blue-400 text-base">{college.admission_rate}%</span>
                                </div>
                                <div className="flex items-center">
                                  <DifficultyIcon className={`h-4 w-4 mr-2 ${difficulty.color}`} />
                                  <span className={`text-sm ${difficulty.color}`}>{difficulty.label}</span>
                                </div>
                              </div>
                            </div>

                            {/* Test Scores */}
                            <div>
                              <h4 className="font-semibold text-white mb-3 text-base">Test Scores</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">SAT Range</span>
                                  <span className="font-medium text-white">{college.sat_range_25th}-{college.sat_range_75th}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">ACT Range</span>
                                  <span className="font-medium text-white">{college.act_range_25th}-{college.act_range_75th}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">Avg GPA</span>
                                  <span className="font-medium text-white">{college.gpa_average}</span>
                                </div>
                                {college.test_optional && (
                                  <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">Test Optional</Badge>
                                )}
                              </div>
                            </div>

                            {/* Costs */}
                            <div>
                              <h4 className="font-semibold text-white mb-3 text-base">Costs</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">In-State Tuition</span>
                                  <span className="font-medium text-white text-sm">{formatCurrency(college.tuition_in_state)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">Out-of-State</span>
                                  <span className="font-medium text-white text-sm">{formatCurrency(college.tuition_out_state)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">Total Cost</span>
                                  <span className="font-medium text-blue-400 text-sm">{formatCurrency(college.total_cost)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">Avg Aid</span>
                                  <span className="font-medium text-green-400 text-sm">{formatCurrency(college.average_aid_amount)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Financial Aid Policies */}
                            <div>
                              <h4 className="font-semibold text-white mb-3 text-base">Financial Aid</h4>
                              <div className="flex flex-wrap gap-2">
                                {college.need_blind_domestic && (
                                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">Need-Blind (US)</Badge>
                                )}
                                {college.need_blind_international && (
                                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">Need-Blind (Intl)</Badge>
                                )}
                                {college.meets_full_need && (
                                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">Meets Full Need</Badge>
                                )}
                                {college.no_loan_policy && (
                                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">No-Loan Policy</Badge>
                                )}
                              </div>
                            </div>

                            {/* Campus Info */}
                            <div>
                              <h4 className="font-semibold text-white mb-3 text-base">Campus</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">Enrollment</span>
                                  <span className="font-medium text-white">{college.undergraduate_enrollment?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-300">
                                  <span className="text-sm">Setting</span>
                                  <span className="font-medium text-white capitalize">{college.campus_setting}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-white/10">
                              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                                <a href={college.website_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit Website
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {selectedColleges.length === 0 && (
          <Card className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardContent>
              <BarChart3 className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-3">No Colleges Selected</h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Search and add colleges above to start comparing them side-by-side
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
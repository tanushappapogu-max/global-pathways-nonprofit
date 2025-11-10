import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
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
  School,
  Check,
  Plus,
  Minus,
  ArrowUpDown,
  Heart,
  ChevronDown,
  ChevronUp,
  Building2,
  Target
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

type SortOption = 'name' | 'admission_rate' | 'tuition' | 'enrollment';
type SortDirection = 'asc' | 'desc';

export const CollegesPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [maxAdmissionRate, setMaxAdmissionRate] = useState<number | undefined>();
  const [minAdmissionRate, setMinAdmissionRate] = useState<number | undefined>();
  const [maxTuition, setMaxTuition] = useState<number | undefined>();
  const [minTuition, setMinTuition] = useState<number | undefined>();
  const [testOptionalOnly, setTestOptionalOnly] = useState(false);
  const [needBlindOnly, setNeedBlindOnly] = useState(false);
  const [meetsFullNeedOnly, setMeetsFullNeedOnly] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
    loadSavedColleges();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [colleges, searchTerm, selectedType, selectedState, maxAdmissionRate, minAdmissionRate, 
      maxTuition, minTuition, testOptionalOnly, needBlindOnly, meetsFullNeedOnly, sortBy, sortDirection]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
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

  const loadSavedColleges = () => {
    const saved = localStorage.getItem('savedColleges');
    if (saved) setSavedColleges(JSON.parse(saved));
  };

  const toggleSaveCollege = (collegeId: string) => {
    const newSaved = savedColleges.includes(collegeId)
      ? savedColleges.filter(id => id !== collegeId)
      : [...savedColleges, collegeId];
    setSavedColleges(newSaved);
    localStorage.setItem('savedColleges', JSON.stringify(newSaved));
  };

  const toggleComparison = (collegeId: string) => {
    if (comparisonList.includes(collegeId)) {
      setComparisonList(comparisonList.filter(id => id !== collegeId));
    } else if (comparisonList.length < 4) {
      setComparisonList([...comparisonList, collegeId]);
    }
  };

  const toggleCardExpansion = (collegeId: string) => {
    setExpandedCards(prev => 
      prev.includes(collegeId) 
        ? prev.filter(id => id !== collegeId)
        : [...prev, collegeId]
    );
  };

  const applyFiltersAndSort = () => {
    let filtered = [...colleges];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(search) ||
        college.location.toLowerCase().includes(search) ||
        college.state.toLowerCase().includes(search) ||
        college.popular_majors?.some(major => major.toLowerCase().includes(search))
      );
    }

    if (selectedType) filtered = filtered.filter(c => c.college_type === selectedType);
    if (selectedState) filtered = filtered.filter(c => c.state === selectedState);
    
    if (minAdmissionRate !== undefined) {
      filtered = filtered.filter(c => c.admission_rate && c.admission_rate >= minAdmissionRate);
    }
    if (maxAdmissionRate !== undefined) {
      filtered = filtered.filter(c => c.admission_rate && c.admission_rate <= maxAdmissionRate);
    }
    
    if (minTuition !== undefined) {
      filtered = filtered.filter(c => c.tuition_out_state && c.tuition_out_state >= minTuition);
    }
    if (maxTuition !== undefined) {
      filtered = filtered.filter(c => c.tuition_out_state && c.tuition_out_state <= maxTuition);
    }

    if (testOptionalOnly) filtered = filtered.filter(c => c.test_optional === true);
    if (needBlindOnly) filtered = filtered.filter(c => c.need_blind_domestic || c.need_blind_international);
    if (meetsFullNeedOnly) filtered = filtered.filter(c => c.meets_full_need === true);

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'admission_rate':
          aVal = a.admission_rate || 100;
          bVal = b.admission_rate || 100;
          break;
        case 'tuition':
          aVal = a.tuition_out_state || a.tuition_in_state || 0;
          bVal = b.tuition_out_state || b.tuition_in_state || 0;
          break;
        case 'enrollment':
          aVal = a.undergraduate_enrollment || 0;
          bVal = b.undergraduate_enrollment || 0;
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    setFilteredColleges(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedState('');
    setMaxAdmissionRate(undefined);
    setMinAdmissionRate(undefined);
    setMaxTuition(undefined);
    setMinTuition(undefined);
    setTestOptionalOnly(false);
    setNeedBlindOnly(false);
    setMeetsFullNeedOnly(false);
  };

  const formatTuition = (inState?: number, outState?: number): string => {
    if (inState && outState && inState !== outState) {
      return `$${inState.toLocaleString()} / $${outState.toLocaleString()}`;
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
    return collegeTypes.find(t => t.value === type)?.label || type;
  };

  const getSelectivityLabel = (rate?: number): { label: string; color: string } => {
    if (!rate) return { label: 'N/A', color: 'text-gray-600' };
    if (rate < 10) return { label: 'Most Selective', color: 'text-red-600' };
    if (rate < 25) return { label: 'Highly Selective', color: 'text-orange-600' };
    if (rate < 50) return { label: 'Selective', color: 'text-yellow-600' };
    if (rate < 75) return { label: 'Moderately Selective', color: 'text-green-600' };
    return { label: 'Less Selective', color: 'text-blue-600' };
  };

  const stats = [
    { number: colleges.length, label: "Total Colleges", icon: School, color: "text-blue-900" },
    { number: filteredColleges.length, label: "Matching Results", icon: Filter, color: "text-purple-900" },
    { number: comparisonList.length, label: "In Comparison", icon: Target, color: "text-green-900" },
    { number: savedColleges.length, label: "Saved", icon: Heart, color: "text-pink-900" }
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
        <motion.div className="text-center mb-16 pt-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <GraduationCap className="w-5 h-5 mr-2" />
            College Database
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-[1.3] overflow-visible">
            <span className="block text-gray-900 mb-4">College</span>
            <span className="block text-gray-900">Explorer</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Compare colleges side-by-side and find your perfect match
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          {stats.map((stat, index) => (
            <motion.div key={index} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.05 }} className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-300">
              <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
              <div className={`text-4xl font-black ${stat.color} mb-2`}>
                <CountUp end={stat.number} />
              </div>
              <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {comparisonList.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-blue-900 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Comparison List ({comparisonList.length}/4)</h3>
                <p className="text-blue-200">Add up to 4 colleges to compare side-by-side</p>
              </div>
              <div className="flex gap-3">
                <Button
  onClick={() => setComparisonList([])}
  variant="outline"
  className="border-white text-white hover:bg-blue-800"
>
  Clear All
</Button>

{comparisonList.length >= 2 && (
  <Button
    className="bg-white text-blue-900 hover:bg-blue-50 font-bold"
    onClick={() =>
      navigate("/college-comparison", { state: { comparisonList } })
    }
  >
    Compare Now →
  </Button>
)}

              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {comparisonList.map(id => {
                const college = colleges.find(c => c.id === id);
                return college ? (
                  <Badge key={id} className="bg-blue-800 text-white px-3 py-2 text-sm">
                    {college.name}
                    <X className="h-4 w-4 ml-2 cursor-pointer" onClick={() => toggleComparison(id)} />
                  </Badge>
                ) : null;
              })}
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {showTopButton && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl z-50">
                ↑ Top
              </motion.button>
            )}
          </AnimatePresence>

          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 text-2xl">
                  <Filter className="h-6 w-6 mr-2 text-blue-900" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-900 text-sm mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                    <Input placeholder="Name, location, major..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900 text-sm mb-2 block">Sort By</Label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="admission_rate">Acceptance Rate</SelectItem>
                        <SelectItem value="tuition">Tuition</SelectItem>
                        <SelectItem value="enrollment">Size</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')} variant="outline" className="border-gray-300 px-3">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900 text-sm mb-2 block">College Type</Label>
                  <Select value={selectedType || "none"} onValueChange={(v) => setSelectedType(v === "none" ? "" : v)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All Types</SelectItem>
                      {collegeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-900 text-sm mb-2 block">State</Label>
                  <Select value={selectedState || "none"} onValueChange={(v) => setSelectedState(v === "none" ? "" : v)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-900 text-sm mb-2 block">Acceptance Rate (%)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" value={minAdmissionRate || ''} onChange={(e) => setMinAdmissionRate(e.target.value ? parseFloat(e.target.value) : undefined)} className="bg-white border-gray-300 text-gray-900" />
                    <Input type="number" placeholder="Max" value={maxAdmissionRate || ''} onChange={(e) => setMaxAdmissionRate(e.target.value ? parseFloat(e.target.value) : undefined)} className="bg-white border-gray-300 text-gray-900" />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-900 text-sm mb-2 block">Tuition Range ($)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" value={minTuition || ''} onChange={(e) => setMinTuition(e.target.value ? parseInt(e.target.value) : undefined)} className="bg-white border-gray-300 text-gray-900" />
                    <Input type="number" placeholder="Max" value={maxTuition || ''} onChange={(e) => setMaxTuition(e.target.value ? parseInt(e.target.value) : undefined)} className="bg-white border-gray-300 text-gray-900" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="testOpt" checked={testOptionalOnly} onCheckedChange={(c) => setTestOptionalOnly(c as boolean)} />
                    <Label htmlFor="testOpt" className="text-gray-700 text-sm cursor-pointer">Test-optional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="needBlind" checked={needBlindOnly} onCheckedChange={(c) => setNeedBlindOnly(c as boolean)} />
                    <Label htmlFor="needBlind" className="text-gray-700 text-sm cursor-pointer">Need-blind</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fullNeed" checked={meetsFullNeedOnly} onCheckedChange={(c) => setMeetsFullNeedOnly(c as boolean)} />
                    <Label htmlFor="fullNeed" className="text-gray-700 text-sm cursor-pointer">Meets full need</Label>
                  </div>
                </div>

                <Button variant="outline" onClick={clearFilters} className="w-full border-gray-300 text-gray-900 hover:bg-gray-100">
                  Clear Filters
                </Button>

                <div className="text-center p-4 bg-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-900 mb-1">{filteredColleges.length}</div>
                  <div className="text-xs text-gray-700">colleges found</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {filteredColleges.length > 0 ? (
              <div className="space-y-4">
                {filteredColleges.map((college, index) => {
                  const isExpanded = expandedCards.includes(college.id);
                  const isInComparison = comparisonList.includes(college.id);
                  const isSaved = savedColleges.includes(college.id);
                  const selectivity = getSelectivityLabel(college.admission_rate);

                  return (
                    <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                      <Card className={`bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${isInComparison ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}>
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex-1">
                                  <CardTitle className="text-2xl mb-2 text-gray-900 flex items-center gap-2">
                                    {college.name}
                                    {isSaved && <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />}
                                  </CardTitle>
                                  <CardDescription className="flex items-center text-base text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {college.location}
                                  </CardDescription>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                <Badge className={getTypeColor(college.college_type)}>{getTypeLabel(college.college_type)}</Badge>
                                {college.test_optional && <Badge className="bg-green-100 text-green-900">Test Optional</Badge>}
                                {college.meets_full_need && <Badge className="bg-blue-100 text-blue-900">Meets Full Need</Badge>}
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              {college.admission_rate && (
                                <>
                                  <div className="text-3xl font-black text-blue-900 mb-1">{college.admission_rate}%</div>
                                  <div className={`text-xs font-semibold mb-2 ${selectivity.color}`}>{selectivity.label}</div>
                                </>
                              )}
                              <div className="text-sm text-gray-900 font-bold">{formatTuition(college.tuition_in_state, college.tuition_out_state)}</div>
                              <div className="text-xs text-gray-600">{college.tuition_in_state !== college.tuition_out_state ? 'In-state / Out-state' : 'Annual tuition'}</div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            {college.undergraduate_enrollment && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Users className="h-5 w-5 text-blue-900 shrink-0" />
                                <div>
                                  <div className="font-semibold">{college.undergraduate_enrollment.toLocaleString()}</div>
                                  <div className="text-xs text-gray-600">Students</div>
                                </div>
                              </div>
                            )}
                            {college.sat_range_25th && college.sat_range_75th && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <GraduationCap className="h-5 w-5 text-purple-600 shrink-0" />
                                <div>
                                  <div className="font-semibold">{college.sat_range_25th}-{college.sat_range_75th}</div>
                                  <div className="text-xs text-gray-600">SAT Range</div>
                                </div>
                              </div>
                            )}
                            {college.gpa_average && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Star className="h-5 w-5 text-yellow-600 shrink-0" />
                                <div>
                                  <div className="font-semibold">{college.gpa_average}</div>
                                  <div className="text-xs text-gray-600">Avg GPA</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {isExpanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t border-gray-200">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-blue-900" />
                                    Campus Details
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    {college.campus_setting && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Setting:</span>
                                        <span className="font-medium text-gray-900">{college.campus_setting.charAt(0).toUpperCase() + college.campus_setting.slice(1)}</span>
                                      </div>
                                    )}
                                    {college.housing_guaranteed_years && college.housing_guaranteed_years > 0 && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Housing:</span>
                                        <span className="font-medium text-gray-900">{college.housing_guaranteed_years} year{college.housing_guaranteed_years > 1 ? 's' : ''} guaranteed</span>
                                      </div>
                                    )}
                                    {college.act_range_25th && college.act_range_75th && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">ACT Range:</span>
                                        <span className="font-medium text-gray-900">{college.act_range_25th}-{college.act_range_75th}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-900" />
                                    Application Info
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    {college.application_platform && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Platform:</span>
                                        <span className="font-medium text-gray-900">{college.application_platform}</span>
                                      </div>
                                    )}
                                    {college.regular_decision_deadline && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">RD Deadline:</span>
                                        <span className="font-medium text-gray-900">{new Date(college.regular_decision_deadline).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                    {college.early_decision_deadline && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">ED Deadline:</span>
                                        <span className="font-medium text-gray-900">{new Date(college.early_decision_deadline).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <DollarSign className="h-5 w-5 text-green-600" />
                                  Financial Aid
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {college.need_blind_domestic && (
                                    <Badge className="bg-green-100 text-green-900">Need-Blind (Domestic)</Badge>
                                  )}
                                  {college.need_blind_international && (
                                    <Badge className="bg-green-100 text-green-900">Need-Blind (International)</Badge>
                                  )}
                                  {college.meets_full_need && (
                                    <Badge className="bg-blue-100 text-blue-900">Meets 100% Need</Badge>
                                  )}
                                  {college.no_loan_policy && (
                                    <Badge className="bg-purple-100 text-purple-900">No-Loan Policy</Badge>
                                  )}
                                </div>
                              </div>

                              {college.popular_majors && college.popular_majors.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-orange-600" />
                                    Popular Majors
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {college.popular_majors.map((major, idx) => (
                                      <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-900 border border-gray-300">
                                        {major}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                              onClick={() => toggleComparison(college.id)}
                              size="sm"
                              variant={isInComparison ? "default" : "outline"}
                              className={isInComparison ? "bg-blue-900 text-white" : "border-gray-300 text-gray-900 hover:bg-gray-100"}
                              disabled={!isInComparison && comparisonList.length >= 4}
                            >
                              {isInComparison ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  In Comparison
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Compare
                                </>
                              )}
                            </Button>

                            <Button
                              onClick={() => toggleSaveCollege(college.id)}
                              size="sm"
                              variant="outline"
                              className={isSaved ? "border-pink-300 text-pink-600 hover:bg-pink-50" : "border-gray-300 text-gray-900 hover:bg-gray-100"}
                            >
                              <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-pink-500' : ''}`} />
                              {isSaved ? 'Saved' : 'Save'}
                            </Button>

                            {college.website_url && (
                              <Button size="sm" variant="outline" asChild className="border-gray-300 text-gray-900 hover:bg-gray-100">
                                <a href={college.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                  Website
                                  <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                              </Button>
                            )}

                            <Button
                              onClick={() => toggleCardExpansion(college.id)}
                              size="sm"
                              variant="ghost"
                              className="ml-auto text-gray-600 hover:text-gray-900"
                            >
                              {isExpanded ? (
                                <>
                                  Less Info
                                  <ChevronUp className="h-4 w-4 ml-2" />
                                </>
                              ) : (
                                <>
                                  More Info
                                  <ChevronDown className="h-4 w-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardContent className="pt-12 pb-12 text-center">
                  <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

        {savedColleges.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
                Saved Colleges ({savedColleges.length})
              </h3>
              <Button onClick={() => {
                setSavedColleges([]);
                localStorage.removeItem('savedColleges');
              }} variant="outline" size="sm" className="border-gray-300 text-gray-700">
                Clear Saved
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedColleges.map(id => {
                const college = colleges.find(c => c.id === id);
                return college ? (
                  <div key={id} className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="font-semibold text-gray-900 mb-1">{college.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{college.location}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pink-600 font-medium">
                        {college.admission_rate ? `${college.admission_rate}% acceptance` : 'N/A'}
                      </span>
                      <X className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-900" onClick={() => toggleSaveCollege(id)} />
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  DollarSign, 
  Calendar, 
  Users, 
  Award,
  ExternalLink,
  Filter,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';

export const ScholarshipPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [scholarships, searchTerm, selectedCategory, selectedAmount]);

  const fetchScholarships = async () => {
    try {
      const { data, error } = await supabase
        .from('scholarships_content_2025_10_14_03_00')
        .select('*')
        .order('amount', { ascending: false });

      if (error) {
        console.error('Error fetching scholarships:', error);
        // Use fallback scholarships if database fails
        setScholarships(getFallbackScholarships());
        setLoading(false);
        return;
      }

      // If no data from database, use fallback
      if (!data || data.length === 0) {
        setScholarships(getFallbackScholarships());
      } else {
        setScholarships(data);
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setScholarships(getFallbackScholarships());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackScholarships = () => [
    {
      id: '1',
      name: 'Academic Excellence Scholarship 2025',
      provider: 'National Education Foundation',
      amount: 12000,
      deadline: '2025-03-15',
      description: 'Merit-based scholarship for high-achieving students entering college in 2025-2026',
      eligibility: 'Minimum 3.5 GPA, leadership experience, community service',
      category: 'merit',
      application_url: 'https://scholarships.com/academic-excellence-2025'
    },
    {
      id: '2',
      name: 'STEM Future Leaders Grant',
      provider: 'Technology Innovation Institute',
      amount: 10000,
      deadline: '2025-04-15',
      description: 'Supporting next-generation STEM students for 2025-2026 academic year',
      eligibility: 'STEM major, research project, academic merit',
      category: 'stem',
      application_url: 'https://stemgrants.org/future-leaders-2025'
    },
    {
      id: '3',
      name: 'Community Impact Scholarship',
      provider: 'Civic Leadership Foundation',
      amount: 8000,
      deadline: '2025-05-01',
      description: 'Recognizing students making community impact in 2025',
      eligibility: '100+ volunteer hours, leadership role, community impact',
      category: 'community',
      application_url: 'https://civicawards.org/impact-2025'
    },
    {
      id: '4',
      name: 'First Generation Success Award 2025',
      provider: 'Educational Access Fund',
      amount: 9000,
      deadline: '2025-06-30',
      description: 'Supporting first-generation college students for 2025-2026',
      eligibility: 'First-generation status, financial need, academic potential',
      category: 'need_based',
      application_url: 'https://accessfund.org/first-gen-2025'
    },
    {
      id: '5',
      name: 'Diversity Excellence Scholarship',
      provider: 'Inclusion & Equity Institute',
      amount: 7500,
      deadline: '2025-07-15',
      description: 'Promoting diversity in higher education for 2025-2026',
      eligibility: 'Underrepresented background, diversity advocacy, academic merit',
      category: 'diversity',
      application_url: 'https://inclusion.edu/diversity-2025'
    },
    {
      id: '6',
      name: 'Future Innovators Grant',
      provider: 'Innovation Education Fund',
      amount: 6000,
      deadline: '2025-08-01',
      description: 'Supporting innovative students entering college in fall 2025',
      eligibility: 'Creative project, innovation mindset, academic achievement',
      category: 'innovation',
      application_url: 'https://innovation.edu/future-grant-2025'
    },
    {
      id: '7',
      name: 'Global Citizenship Scholarship',
      provider: 'International Education Alliance',
      amount: 8500,
      deadline: '2025-09-15',
      description: 'For students committed to global citizenship and cultural understanding',
      eligibility: 'International experience, language skills, cultural awareness',
      category: 'international',
      application_url: 'https://global-ed.org/citizenship-2025'
    },
    {
      id: '8',
      name: 'Environmental Stewardship Award',
      provider: 'Green Future Foundation',
      amount: 7000,
      deadline: '2025-10-01',
      description: 'Supporting students passionate about environmental sustainability',
      eligibility: 'Environmental project, sustainability focus, community involvement',
      category: 'environmental',
      application_url: 'https://greenfuture.org/stewardship-2025'
    }
  ];

  const filterScholarships = () => {
    let filtered = scholarships;

    if (searchTerm) {
      filtered = filtered.filter(scholarship =>
        scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.provider?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scholarship =>
        scholarship.category === selectedCategory
      );
    }

    if (selectedAmount !== 'all') {
      const [min, max] = selectedAmount.split('-').map(Number);
      filtered = filtered.filter(scholarship => {
        const amount = scholarship.amount;
        if (max) {
          return amount >= min && amount <= max;
        } else {
          return amount >= min;
        }
      });
    }

    setFilteredScholarships(filtered);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(scholarships.map(scholarship => scholarship.category).filter(Boolean))];
    return categories.sort();
  };

  const formatAmount = (amount) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatEligibility = (eligibility) => {
    if (typeof eligibility === 'string') {
      return eligibility;
    }
    if (typeof eligibility === 'object' && eligibility !== null) {
      return Object.entries(eligibility)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return 'See details';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Financial Aid
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Scholarship Database" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thousands of scholarships to help fund your education
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search scholarships by name, provider, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="0-1000">Under $1K</SelectItem>
                  <SelectItem value="1000-5000">$1K - $5K</SelectItem>
                  <SelectItem value="5000-10000">$5K - $10K</SelectItem>
                  <SelectItem value="10000">$10K+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredScholarships.length} of {scholarships.length} scholarships
          </p>
        </div>

        {/* Scholarship Grid */}
        {filteredScholarships.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
                <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
                          {scholarship.name}
                        </CardTitle>
                        {scholarship.provider && (
                          <CardDescription className="text-blue-600 font-medium mt-1">
                            {scholarship.provider}
                          </CardDescription>
                        )}
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-2xl font-bold text-green-600">
                          {formatAmount(scholarship.amount)}
                        </div>
                        {scholarship.category && (
                          <Badge variant="outline" className="mt-1">
                            {scholarship.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scholarship.description && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {scholarship.description}
                        </p>
                      )}
                      
                      {scholarship.deadline && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      {scholarship.eligibility && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Eligibility: </span>
                          <span className="text-gray-600">{formatEligibility(scholarship.eligibility)}</span>
                        </div>
                      )}

                      {scholarship.requirements && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Requirements: </span>
                          <span className="text-gray-600 line-clamp-2">{scholarship.requirements}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      {scholarship.application_url && (
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
              <CardContent className="p-12">
                <GraduationCap className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  <ShinyText text="Need Personalized Help?" className="text-white" />
                </h2>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                  Try our AI-powered scholarship finder to get personalized recommendations based on your profile
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold" asChild>
                  <a href="/ai-finder">
                    Try AI Scholarship Finder
                  </a>
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};
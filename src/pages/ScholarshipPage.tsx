import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Calendar, 
  Award,
  ExternalLink,
  Heart,
  ArrowUp,
  Bookmark,
  Check
} from 'lucide-react';
import { CountUp } from '@/components/animations/CountUp';

export const ScholarshipPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    fetchScholarships();
    loadSavedScholarships();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [scholarships, searchTerm, selectedCategory, selectedAmount, showSavedOnly, savedScholarships]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadSavedScholarships = () => {
    const saved = localStorage.getItem('savedScholarshipIds');
    if (saved) {
      setSavedScholarships(JSON.parse(saved));
    }
  };

  const toggleSaveScholarship = async (scholarship: any) => {
    const scholarshipId = `${scholarship.name}-${scholarship.provider}`;
    const isSaved = savedScholarships.includes(scholarshipId);

    if (isSaved) {
      const updated = savedScholarships.filter(id => id !== scholarshipId);
      setSavedScholarships(updated);
      localStorage.setItem('savedScholarshipIds', JSON.stringify(updated));
      
      if (user) {
        await supabase
          .from('saved_scholarships')
          .delete()
          .eq('user_id', user.id)
          .eq('scholarship_name', scholarship.name);
      }
      
      toast({ title: "Removed", description: "Scholarship removed from your dashboard" });
    } else {
      const updated = [...savedScholarships, scholarshipId];
      setSavedScholarships(updated);
      localStorage.setItem('savedScholarshipIds', JSON.stringify(updated));

      if (user) {
        await supabase.from('saved_scholarships').insert({
          user_id: user.id,
          scholarship_name: scholarship.name,
          provider: scholarship.provider,
          amount: Number(scholarship.amount) || 0,
          deadline: scholarship.deadline,
          description: scholarship.description,
          url: scholarship.application_url
        });
      }
      
      toast({ title: "Saved!", description: "Scholarship saved to your dashboard" });
    }
  };

  const fetchScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) {
      console.error('Error fetching scholarships:', error);
    } else {
      setScholarships(data || []);
    }
    setLoading(false);
  };

  const filterScholarships = () => {
    let filtered = scholarships;

    if (showSavedOnly) {
      filtered = filtered.filter(s => {
        const id = `${s.name}-${s.provider}`;
        return savedScholarships.includes(id);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(scholarship =>
        scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.provider?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scholarship => scholarship.category === selectedCategory);
    }

    if (selectedAmount !== 'all') {
      const [min, max] = selectedAmount.split('-').map(Number);
      filtered = filtered.filter(scholarship => {
        const amount = Number(scholarship.amount);
        if (isNaN(amount)) return false;
        if (max) return amount >= min && amount <= max;
        return amount >= min;
      });
    }

    setFilteredScholarships(filtered);
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(scholarships.map(s => s.category).filter(Boolean))];
    return categories.sort();
  };

  const formatAmount = (amount: any) => {
    if (!amount) return 'Varies';
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return num >= 1000 ? `$${(num / 1000).toFixed(0)}K` : `$${num}`;
  };

  const numericAmounts = scholarships.map(s => Number(s.amount)).filter(a => !isNaN(a));
  const totalAmount = numericAmounts.reduce((sum, a) => sum + a, 0);
  const averageAmount = numericAmounts.length > 0 ? Math.round(totalAmount / numericAmounts.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div className="text-center mb-16 pt-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <Award className="w-5 h-5 mr-2" />
            Financial Aid Opportunities
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-[1.3] overflow-visible">
            <span className="block text-gray-900 mb-4">Scholarship</span>
            <span className="block text-gray-900">Database</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Discover scholarships to help fund your education
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <motion.div whileHover={{ scale: 1.05 }} className="text-center bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:border-blue-400 transition-all">
            <div className="text-4xl font-black text-gray-900 mb-3">
              <CountUp end={scholarships.length} />
            </div>
            <div className="text-gray-700 text-base font-medium">Available Scholarships</div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="text-center bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:border-blue-400 transition-all">
            <div className="text-4xl font-black text-gray-900 mb-3">
              <CountUp end={totalAmount / 1_000_000} suffix="M" prefix="$" />
            </div>
            <div className="text-gray-700 text-base font-medium">Total Aid Available</div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="text-center bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:border-blue-400 transition-all">
            <div className="text-4xl font-black text-gray-900 mb-3">
              <CountUp end={Math.round(averageAmount / 1000)} suffix="K" prefix="$" />
            </div>
            <div className="text-gray-700 text-base font-medium">Average Award</div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="text-center bg-pink-100 rounded-3xl p-6 shadow-lg border border-pink-300 hover:border-pink-400 transition-all">
            <div className="text-4xl font-black text-pink-900 mb-3">
              <CountUp end={savedScholarships.length} />
            </div>
            <div className="text-pink-900 text-base font-medium">Saved</div>
          </motion.div>
        </motion.div>

        <motion.div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white border-gray-300 text-gray-900 h-14"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900 h-14">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900 h-14">
                  <SelectValue placeholder="Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="0-1000">$0 - $1K</SelectItem>
                  <SelectItem value="1000-5000">$1K - $5K</SelectItem>
                  <SelectItem value="5000-10000">$5K - $10K</SelectItem>
                  <SelectItem value="10000-1000000">$10K+</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showSavedOnly ? "default" : "outline"}
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={showSavedOnly ? "bg-pink-600 hover:bg-pink-500 text-white h-14" : "border-gray-300 text-gray-900 h-14"}
              >
                <Heart className={`w-5 h-5 mr-2 ${showSavedOnly ? 'fill-white' : ''}`} />
                Saved Only
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.length > 0 ? (
            filteredScholarships.map((scholarship: any) => {
              const scholarshipId = `${scholarship.name}-${scholarship.provider}`;
              const isSaved = savedScholarships.includes(scholarshipId);

              return (
                <motion.div key={scholarship.id} whileHover={{ scale: 1.02 }}>
                  <Card className="bg-white border-gray-200 hover:border-blue-400 shadow-lg transition-all h-full flex flex-col">
                    <CardHeader className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl font-bold text-gray-900 flex-1 pr-2">{scholarship.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaveScholarship(scholarship)}
                          className={`shrink-0 ${isSaved ? "text-pink-600 hover:text-pink-700" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          <Heart className={`h-5 w-5 ${isSaved ? 'fill-pink-600' : ''}`} />
                        </Button>
                      </div>
                      <CardDescription className="text-gray-700">{scholarship.provider}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-black text-blue-900">{formatAmount(scholarship.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 text-sm">{scholarship.deadline}</span>
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">{scholarship.description}</div>
                      <Button asChild className="w-full bg-blue-900 hover:bg-blue-800 text-white">
                        <a href={scholarship.application_url} target="_blank" rel="noopener noreferrer">
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</p>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {showTopButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-full shadow-2xl z-50"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
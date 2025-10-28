import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calculator, 
  DollarSign, 
  GraduationCap, 
  MapPin, 
  TrendingUp, 
  PieChart,
  BookOpen,
  Home,
  Car,
  ShoppingBag,
  Award,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';


interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  college_type: string;
  tuition_in_state: number;
  tuition_out_state: number;
  total_cost: number;
  meets_full_need: boolean;
  average_aid_amount: number;
}

interface CostBreakdown {
  tuition: number;
  fees: number;
  housing: number;
  meals: number;
  books: number;
  transportation: number;
  personal: number;
  total: number;
}

interface FinancialAid {
  grants: number;
  scholarships: number;
  workStudy: number;
  loans: number;
  total: number;
}

interface UserProfile {
  gpa: number;
  sat: number;
  act: number;
  state: string;
  familyIncome: number;
  isFirstGeneration: boolean;
  isLowIncome: boolean;
  isInternational: boolean;
  isMinority: boolean;
  major: string;
}

export const CostCalculatorPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [collegeSearch, setCollegeSearch] = useState<string>('');
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    gpa: 0,
    sat: 0,
    act: 0,
    state: '',
    familyIncome: 0,
    isFirstGeneration: false,
    isLowIncome: false,
    isInternational: false,
    isMinority: false,
    major: ''
  });

  const [residencyStatus, setResidencyStatus] = useState<string>('');

  useEffect(() => {
    loadColleges();
  }, []);

  useEffect(() => {
    if (collegeSearch) {
      const filtered = colleges.filter(college =>
        college.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
        college.location.toLowerCase().includes(collegeSearch.toLowerCase())
      );
      setFilteredColleges(filtered.slice(0, 10));
    } else {
      setFilteredColleges([]);
    }
  }, [collegeSearch, colleges]);

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
    }
  };

  const calculatePersonalizedCosts = (college: College | null): CostBreakdown => {
    if (!college) {
      // Default estimates based on college type
      return {
        tuition: 35000,
        fees: 2500,
        housing: 12000,
        meals: 5500,
        books: 1200,
        transportation: 1500,
        personal: 2500,
        total: 60200
      };
    }

    // Determine tuition based on residency and user profile
    let baseTuition = 0;
    if (userProfile.isInternational) {
      baseTuition = (college.tuition_out_state || college.tuition_in_state || 35000) * 1.2;
    } else if (userProfile.state === college.state || residencyStatus === 'in-state') {
      baseTuition = college.tuition_in_state || 25000;
    } else {
      baseTuition = college.tuition_out_state || college.tuition_in_state || 35000;
    }

    // Major-specific cost adjustments
    let majorMultiplier = 1.0;
    const stemMajors = ['engineering', 'computer science', 'biology', 'chemistry', 'physics', 'mathematics'];
    const businessMajors = ['business', 'finance', 'accounting', 'marketing', 'economics'];
    const artsMajors = ['art', 'music', 'theater', 'film', 'design'];

    if (stemMajors.some(major => userProfile.major.toLowerCase().includes(major))) {
      majorMultiplier = 1.15;
    } else if (businessMajors.some(major => userProfile.major.toLowerCase().includes(major))) {
      majorMultiplier = 1.1;
    } else if (artsMajors.some(major => userProfile.major.toLowerCase().includes(major))) {
      majorMultiplier = 1.2;
    }

    const adjustedTuition = baseTuition * majorMultiplier;

    // Location-based cost adjustments
    const locationMultiplier = college.location?.toLowerCase().includes('new york') || 
                              college.location?.toLowerCase().includes('california') || 
                              college.location?.toLowerCase().includes('boston') ? 1.3 : 1.0;

    const costs: CostBreakdown = {
      tuition: Math.round(adjustedTuition),
      fees: Math.round(2500 * locationMultiplier),
      housing: Math.round(12000 * locationMultiplier),
      meals: Math.round(5500 * locationMultiplier),
      books: Math.round(1200 * majorMultiplier),
      transportation: Math.round(userProfile.state === college.state ? 1000 : 2000),
      personal: Math.round(2500 * locationMultiplier),
      total: 0
    };

    costs.total = costs.tuition + costs.fees + costs.housing + costs.meals + costs.books + costs.transportation + costs.personal;
    return costs;
  };

  const calculatePersonalizedAid = (college: College | null): FinancialAid => {
    let estimatedAid: FinancialAid = {
      grants: 0,
      scholarships: 0,
      workStudy: 0,
      loans: 0,
      total: 0
    };

    const familyIncome = userProfile.familyIncome || 0;

    // Federal Pell Grant estimation
    if (familyIncome < 30000) {
      estimatedAid.grants += 7000;
    } else if (familyIncome < 50000) {
      estimatedAid.grants += 5000;
    } else if (familyIncome < 75000) {
      estimatedAid.grants += 2000;
    }

    // State grants
    if (college && userProfile.state === college.state && familyIncome < 60000) {
      estimatedAid.grants += 3000;
    }

    // Institutional aid
    if (college?.meets_full_need && familyIncome < 100000) {
      const totalCost = college.total_cost || 50000;
      const needBasedAid = Math.max(0, totalCost - (familyIncome * 0.1));
      estimatedAid.grants += Math.min(needBasedAid * 0.6, 25000);
    } else if (college?.average_aid_amount) {
      const aidMultiplier = familyIncome < 50000 ? 1.2 : familyIncome < 100000 ? 1.0 : 0.7;
      estimatedAid.grants += (college.average_aid_amount * aidMultiplier * 0.5);
    }

    // Merit scholarships based on academic profile
    if (userProfile.gpa >= 3.8 && (userProfile.sat >= 1400 || userProfile.act >= 32)) {
      estimatedAid.scholarships += 8000;
    } else if (userProfile.gpa >= 3.5 && (userProfile.sat >= 1200 || userProfile.act >= 27)) {
      estimatedAid.scholarships += 4000;
    } else if (userProfile.gpa >= 3.0) {
      estimatedAid.scholarships += 1500;
    }

    // Special population scholarships
    if (userProfile.isFirstGeneration) estimatedAid.scholarships += 2000;
    if (userProfile.isMinority) estimatedAid.scholarships += 1500;
    if (userProfile.isLowIncome) estimatedAid.grants += 2500;

    // Work-study
    if (familyIncome < 80000) {
      estimatedAid.workStudy = 2500;
    }

    // Federal student loans
    estimatedAid.loans = 5500;

    estimatedAid.total = estimatedAid.grants + estimatedAid.scholarships + estimatedAid.workStudy + estimatedAid.loans;
    return estimatedAid;
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleCollegeSelect = (college: College) => {
    setSelectedCollege(college);
    setCollegeSearch(college.name);
    setFilteredColleges([]);
  };

  const costs = calculatePersonalizedCosts(selectedCollege);
  const aid = calculatePersonalizedAid(selectedCollege);
  const netCost = Math.max(0, costs.total - aid.total);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <Calculator className="w-4 h-4 mr-2" />
            Financial Planning
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="Personalized Cost Calculator" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get accurate cost estimates based on your academic profile, location, and financial situation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* College Selection */}
            
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Select College
                  </CardTitle>
                  <CardDescription>
                    Choose a specific college or use general estimates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        placeholder="Search for a college..."
                        value={collegeSearch}
                        onChange={(e) => setCollegeSearch(e.target.value)}
                      />
                      {filteredColleges.length > 0 && (
                        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredColleges.map((college) => (
                            <div
                              key={college.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleCollegeSelect(college)}
                            >
                              <div className="font-medium">{college.name}</div>
                              <div className="text-sm text-gray-600">{college.location}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedCollege && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{selectedCollege.name}</div>
                            <div className="text-sm text-gray-600">{selectedCollege.location}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCollege(null);
                              setCollegeSearch('');
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            

            {/* Academic Profile */}
            
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Academic Profile
                  </CardTitle>
                  <CardDescription>
                    Your academic credentials affect merit aid eligibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gpa">GPA (4.0 scale)</Label>
                      <Input
                        id="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={userProfile.gpa || ''}
                        onChange={(e) => setUserProfile({...userProfile, gpa: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sat">SAT Score</Label>
                      <Input
                        id="sat"
                        type="number"
                        min="400"
                        max="1600"
                        value={userProfile.sat || ''}
                        onChange={(e) => setUserProfile({...userProfile, sat: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="act">ACT Score</Label>
                      <Input
                        id="act"
                        type="number"
                        min="1"
                        max="36"
                        value={userProfile.act || ''}
                        onChange={(e) => setUserProfile({...userProfile, act: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="major">Intended Major</Label>
                      <Input
                        id="major"
                        value={userProfile.major}
                        onChange={(e) => setUserProfile({...userProfile, major: e.target.value})}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            

            {/* Financial Information */}
            
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Financial Information
                  </CardTitle>
                  <CardDescription>
                    Financial details help estimate need-based aid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="familyIncome">Annual Family Income</Label>
                      <Input
                        id="familyIncome"
                        type="number"
                        value={userProfile.familyIncome || ''}
                        onChange={(e) => setUserProfile({...userProfile, familyIncome: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 75000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Home State</Label>
                      <Input
                        id="state"
                        value={userProfile.state}
                        onChange={(e) => setUserProfile({...userProfile, state: e.target.value})}
                        placeholder="e.g., California"
                      />
                    </div>
                    <div>
                      <Label htmlFor="residency">Residency Status</Label>
                      <Select value={residencyStatus} onValueChange={setResidencyStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select residency status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-state">In-State Resident</SelectItem>
                          <SelectItem value="out-of-state">Out-of-State Resident</SelectItem>
                          <SelectItem value="international">International Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="international"
                          checked={userProfile.isInternational}
                          onCheckedChange={(checked) => {
                            setUserProfile({...userProfile, isInternational: checked as boolean});
                            if (checked) setResidencyStatus('international');
                          }}
                        />
                        <Label htmlFor="international" className="text-sm">
                          I am an international student
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="firstGen"
                        checked={userProfile.isFirstGeneration}
                        onCheckedChange={(checked) => setUserProfile({...userProfile, isFirstGeneration: checked as boolean})}
                      />
                      <Label htmlFor="firstGen">First-generation college student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowIncome"
                        checked={userProfile.isLowIncome}
                        onCheckedChange={(checked) => setUserProfile({...userProfile, isLowIncome: checked as boolean})}
                      />
                      <Label htmlFor="lowIncome">Low-income family (eligible for free/reduced lunch)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="international"
                        checked={userProfile.isInternational}
                        onCheckedChange={(checked) => setUserProfile({...userProfile, isInternational: checked as boolean})}
                      />
                      <Label htmlFor="international">International student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="minority"
                        checked={userProfile.isMinority}
                        onCheckedChange={(checked) => setUserProfile({...userProfile, isMinority: checked as boolean})}
                      />
                      <Label htmlFor="minority">Underrepresented minority</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            

            {/* Calculate Button */}
            <div className="text-center">
              <Button 
                onClick={handleCalculate}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate My Costs
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults && (
              <>
                {/* Cost Summary */}
                
                  <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-center">
                        <ShinyText text="Annual Cost Summary" className="text-white" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/20">
                          <span>Total Costs</span>
                          <span className="text-2xl font-bold">
                            {formatCurrency(costs.total)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/20">
                          <span>Financial Aid</span>
                          <span className="text-2xl font-bold text-green-300">
                            -{formatCurrency(aid.total)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 bg-white/20 rounded-lg px-4">
                          <span className="text-lg font-semibold">Net Annual Cost</span>
                          <span className="text-3xl font-bold">
                            {formatCurrency(netCost)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                

                {/* Cost Breakdown */}
                
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Tuition & Fees</span>
                          <span className="font-semibold">{formatCurrency(costs.tuition + costs.fees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Room & Board</span>
                          <span className="font-semibold">{formatCurrency(costs.housing + costs.meals)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Books & Supplies</span>
                          <span className="font-semibold">{formatCurrency(costs.books)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transportation</span>
                          <span className="font-semibold">{formatCurrency(costs.transportation)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Personal Expenses</span>
                          <span className="font-semibold">{formatCurrency(costs.personal)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                

                {/* Financial Aid Breakdown */}
                
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle>Financial Aid Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Grants</span>
                          <span className="font-semibold text-green-600">{formatCurrency(aid.grants)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Scholarships</span>
                          <span className="font-semibold text-blue-600">{formatCurrency(aid.scholarships)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Work-Study</span>
                          <span className="font-semibold text-purple-600">{formatCurrency(aid.workStudy)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Student Loans</span>
                          <span className="font-semibold text-orange-600">{formatCurrency(aid.loans)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                

                {/* 4-Year Projection */}
                
                  <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle>4-Year Projection</CardTitle>
                      <CardDescription>
                        Estimated total costs (3% annual increase)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((year) => {
                          const yearCost = netCost * Math.pow(1.03, year - 1);
                          return (
                            <div key={year} className="flex justify-between">
                              <span>Year {year}</span>
                              <span className="font-semibold">
                                {formatCurrency(yearCost)}
                              </span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between pt-3 border-t font-bold text-blue-800">
                          <span>Total 4-Year Cost</span>
                          <span className="text-xl">
                            {formatCurrency(netCost * 4.18)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
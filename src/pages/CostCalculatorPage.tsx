import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from '@/components/animations/CountUp';
import { useAuth } from '@/contexts/AuthContext';
import { trackToolUsage, completeToolUsage } from '@/lib/utils';
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
  Info,
  Search,
  X
} from 'lucide-react';

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
  healthInsurance: number;
  technology: number;
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
  householdSize: number;
  siblingsInCollege: number;
  isFirstGeneration: boolean;
  isLowIncome: boolean;
  isInternational: boolean;
  isMinority: boolean;
  hasDisability: boolean;
  isVeteran: boolean;
  major: string;
  housingPlan: string;
  mealPlan: string;
  hasVehicle: boolean;
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
    householdSize: 4,
    siblingsInCollege: 0,
    isFirstGeneration: false,
    isLowIncome: false,
    isInternational: false,
    isMinority: false,
    hasDisability: false,
    isVeteran: false,
    major: '',
    housingPlan: 'on-campus',
    mealPlan: 'unlimited',
    hasVehicle: false
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
      return {
        tuition: 35000,
        fees: 2500,
        housing: 12000,
        meals: 5500,
        books: 1200,
        transportation: 1500,
        personal: 2500,
        technology: 800,
        total: 63000
      };
    }

    // Determine tuition based on residency
    let baseTuition = 0;
    if (userProfile.isInternational) {
      baseTuition = (college.tuition_out_state || college.tuition_in_state || 35000) * 1.2;
    } else if (userProfile.state === college.state || residencyStatus === 'in-state') {
      baseTuition = college.tuition_in_state || 25000;
    } else {
      baseTuition = college.tuition_out_state || college.tuition_in_state || 35000;
    }

    // Major-specific adjustments
    let majorMultiplier = 1.0;
    const stemMajors = ['engineering', 'computer science', 'biology', 'chemistry', 'physics', 'mathematics', 'data science', 'robotics'];
    const businessMajors = ['business', 'finance', 'accounting', 'marketing', 'economics'];
    const artsMajors = ['art', 'music', 'theater', 'film', 'design', 'photography'];
    const labMajors = ['nursing', 'pharmacy', 'medicine', 'dental', 'veterinary'];

    const majorLower = userProfile.major.toLowerCase();
    if (stemMajors.some(major => majorLower.includes(major))) {
      majorMultiplier = 1.15;
    } else if (businessMajors.some(major => majorLower.includes(major))) {
      majorMultiplier = 1.1;
    } else if (artsMajors.some(major => majorLower.includes(major))) {
      majorMultiplier = 1.2;
    } else if (labMajors.some(major => majorLower.includes(major))) {
      majorMultiplier = 1.25;
    }

    const adjustedTuition = baseTuition * majorMultiplier;

    // Location-based multipliers
    const locationLower = college.location?.toLowerCase() || '';
    let locationMultiplier = 1.0;
    if (locationLower.includes('new york') || locationLower.includes('manhattan')) locationMultiplier = 1.4;
    else if (locationLower.includes('san francisco') || locationLower.includes('los angeles')) locationMultiplier = 1.35;
    else if (locationLower.includes('boston') || locationLower.includes('washington dc')) locationMultiplier = 1.3;
    else if (locationLower.includes('chicago') || locationLower.includes('seattle')) locationMultiplier = 1.2;

    // Housing costs based on plan
    let housingCost = 12000 * locationMultiplier;
    if (userProfile.housingPlan === 'off-campus') housingCost *= 1.15;
    else if (userProfile.housingPlan === 'commute') housingCost = 0;
    else if (userProfile.housingPlan === 'apartment') housingCost *= 1.3;

    // Meal plan costs
    let mealCost = 5500 * locationMultiplier;
    if (userProfile.mealPlan === 'unlimited') mealCost = 6500 * locationMultiplier;
    else if (userProfile.mealPlan === 'partial') mealCost = 4000 * locationMultiplier;
    else if (userProfile.mealPlan === 'none') mealCost = 3000 * locationMultiplier;

    // Transportation
    let transportation = 1500;
    if (userProfile.hasVehicle) transportation += 2000;
    if (userProfile.state !== college.state) transportation += 1500;
    if (userProfile.housingPlan === 'commute') transportation += 1500;

    const costs: CostBreakdown = {
      tuition: Math.round(adjustedTuition),
      fees: Math.round(2500 * locationMultiplier),
      housing: Math.round(housingCost),
      meals: Math.round(mealCost),
      books: Math.round(1200 * majorMultiplier),
      transportation: Math.round(transportation),
      personal: Math.round(2500 * locationMultiplier),
      healthInsurance: userProfile.isInternational ? 2500 : 2000,
      technology: Math.round(800 * majorMultiplier),
      total: 0
    };

    costs.total = costs.tuition + costs.fees + costs.housing + costs.meals + costs.books + 
                  costs.transportation + costs.personal + costs.healthInsurance + costs.technology;
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
    const householdSize = userProfile.householdSize || 4;
    const adjustedIncome = familyIncome / householdSize;

    // Federal Pell Grant (max $7,395)
    if (familyIncome < 20000) estimatedAid.grants += 7395;
    else if (familyIncome < 30000) estimatedAid.grants += 6500;
    else if (familyIncome < 40000) estimatedAid.grants += 5000;
    else if (familyIncome < 50000) estimatedAid.grants += 3000;
    else if (familyIncome < 60000) estimatedAid.grants += 1500;

    // Federal SEOG Grant
    if (familyIncome < 40000) estimatedAid.grants += 2000;

    // State grants
    if (college && userProfile.state === college.state) {
      if (familyIncome < 40000) estimatedAid.grants += 4000;
      else if (familyIncome < 60000) estimatedAid.grants += 2500;
      else if (familyIncome < 80000) estimatedAid.grants += 1500;
    }

    // Institutional aid
    if (college?.meets_full_need) {
      const totalCost = college.total_cost || 50000;
      const expectedContribution = Math.max(0, familyIncome * 0.15);
      const need = Math.max(0, totalCost - expectedContribution);
      
      if (familyIncome < 65000) estimatedAid.grants += Math.min(need * 0.9, 30000);
      else if (familyIncome < 100000) estimatedAid.grants += Math.min(need * 0.7, 20000);
      else if (familyIncome < 150000) estimatedAid.grants += Math.min(need * 0.5, 15000);
    } else if (college?.average_aid_amount) {
      const aidMultiplier = familyIncome < 50000 ? 1.3 : familyIncome < 100000 ? 1.0 : 0.6;
      estimatedAid.grants += (college.average_aid_amount * aidMultiplier * 0.5);
    }

    // Merit scholarships
    if (userProfile.gpa >= 3.9 && (userProfile.sat >= 1500 || userProfile.act >= 34)) {
      estimatedAid.scholarships += 12000;
    } else if (userProfile.gpa >= 3.7 && (userProfile.sat >= 1400 || userProfile.act >= 32)) {
      estimatedAid.scholarships += 8000;
    } else if (userProfile.gpa >= 3.5 && (userProfile.sat >= 1300 || userProfile.act >= 29)) {
      estimatedAid.scholarships += 5000;
    } else if (userProfile.gpa >= 3.3 && (userProfile.sat >= 1200 || userProfile.act >= 27)) {
      estimatedAid.scholarships += 3000;
    } else if (userProfile.gpa >= 3.0) {
      estimatedAid.scholarships += 1500;
    }

    // Special population scholarships
    if (userProfile.isFirstGeneration) estimatedAid.scholarships += 2500;
    if (userProfile.isMinority) estimatedAid.scholarships += 2000;
    if (userProfile.isLowIncome) estimatedAid.grants += 3000;
    if (userProfile.hasDisability) estimatedAid.grants += 1500;
    if (userProfile.isVeteran) estimatedAid.grants += 5000;

    // Multiple siblings in college
    if (userProfile.siblingsInCollege > 0) {
      estimatedAid.grants += (userProfile.siblingsInCollege * 2000);
    }

    // Work-study
    if (familyIncome < 100000) {
      estimatedAid.workStudy = familyIncome < 50000 ? 3500 : 2500;
    }

    // Federal student loans
    const yearLevel = 1; // Freshman
    if (yearLevel === 1) estimatedAid.loans = 5500;
    else if (yearLevel === 2) estimatedAid.loans = 6500;
    else estimatedAid.loans = 7500;

    estimatedAid.total = estimatedAid.grants + estimatedAid.scholarships + estimatedAid.workStudy + estimatedAid.loans;
    return estimatedAid;
  };

  const handleCalculate = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const stats = [
    { number: costs.total, label: "Total Annual Cost", prefix: "$", color: "text-black" },
    { number: aid.total, label: "Est. Financial Aid", prefix: "$", color: "text-black" },
    { number: netCost, label: "Net Annual Cost", prefix: "$", color: "text-black" },
    { number: Math.round(netCost * 4.18), label: "4-Year Total", prefix: "$", color: "text-black" }
  ];

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div className="text-center mb-16 pt-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <Calculator className="w-5 h-5 mr-2" />
            Financial Planning Tool
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gray-900 to-white bg-clip-text text-transparent mb-4">Cost</span>
            <span className="block bg-gray-900 bg-clip-text text-transparent">Calculator</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Get accurate cost estimates based on your academic profile, location, and financial situation
          </p>
        </motion.div>

        {showResults && (
  <motion.div 
    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16" 
    initial="hidden" 
    whileInView="visible" 
    viewport={{ once: true }} 
    variants={{ 
      hidden: { opacity: 0 }, 
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
    }}
  >
    {stats.map((stat, index) => (
      <motion.div 
        key={index} 
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} 
        whileHover={{ scale: 1.05 }} 
        className="text-center bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 hover:border-blue-400 transition-all duration-300"
      >
        <div className={`text-4xl font-black ${stat.color} mb-3`}>
          <CountUp end={stat.number} prefix={stat.prefix} />
        </div>
        <div className="text-gray-700 text-base font-medium">{stat.label}</div>
      </motion.div>
    ))}
  </motion.div>
)}


        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
           {/* College Selection */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center text-gray-900 text-2xl">
      <GraduationCap className="h-6 w-6 mr-2 text-blue-900" />
      Select College
    </CardTitle>
    <CardDescription className="text-gray-700 text-base">
      Choose a specific college or use general estimates
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          placeholder="Search for a college..."
          value={collegeSearch}
          onChange={(e) => setCollegeSearch(e.target.value)}
          className="pl-10 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
        {filteredColleges.length > 0 && (
          <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {filteredColleges.map((college) => (
              <div
                key={college.id}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleCollegeSelect(college)}
              >
                <div className="font-medium text-gray-900">{college.name}</div>
                <div className="text-sm text-gray-600">{college.location}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedCollege && (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 text-lg">{selectedCollege.name}</div>
              <div className="text-sm text-gray-600">{selectedCollege.location}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCollege(null);
                setCollegeSearch('');
              }}
              className="border-gray-300 text-gray-700 hover:bg-blue-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  </CardContent>
</Card>


            {/* Academic Profile */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center text-gray-900 text-2xl">
      <BookOpen className="h-6 w-6 mr-2 text-purple-700" />
      Academic Profile
    </CardTitle>
    <CardDescription className="text-gray-700 text-base">
      Your academic credentials affect merit aid eligibility
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-900 text-base mb-2 block">GPA (4.0 scale)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="4.0"
          placeholder="3.75"
          value={userProfile.gpa || ''}
          onChange={(e) =>
            setUserProfile({ ...userProfile, gpa: parseFloat(e.target.value) || 0 })
          }
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">SAT Score</Label>
        <Input
          type="number"
          min="400"
          max="1600"
          placeholder="1400"
          value={userProfile.sat || ''}
          onChange={(e) =>
            setUserProfile({ ...userProfile, sat: parseInt(e.target.value) || 0 })
          }
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">ACT Score</Label>
        <Input
          type="number"
          min="1"
          max="36"
          placeholder="32"
          value={userProfile.act || ''}
          onChange={(e) =>
            setUserProfile({ ...userProfile, act: parseInt(e.target.value) || 0 })
          }
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Intended Major</Label>
        <Input
          placeholder="Computer Science"
          value={userProfile.major}
          onChange={(e) =>
            setUserProfile({ ...userProfile, major: e.target.value })
          }
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
    </div>
  </CardContent>
</Card>

            {/* Financial Information */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center text-gray-900 text-2xl">
      <DollarSign className="h-6 w-6 mr-2 text-green-700" />
      Financial Information
    </CardTitle>
    <CardDescription className="text-gray-700 text-base">
      Financial details help estimate need-based aid
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Annual Family Income</Label>
        <Input
          type="number"
          placeholder="75000"
          value={userProfile.familyIncome || ''}
          onChange={(e) =>
            setUserProfile({ ...userProfile, familyIncome: parseInt(e.target.value) || 0 })
          }
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Household Size</Label>
        <Input
          type="number"
          min="1"
          placeholder="4"
          value={userProfile.householdSize || ''}
          onChange={(e) =>
            setUserProfile({ ...userProfile, householdSize: parseInt(e.target.value) || 4 })
          }
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Home State</Label>
        <Input
          placeholder="California"
          value={userProfile.state}
          onChange={(e) => setUserProfile({ ...userProfile, state: e.target.value })}
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Siblings in College</Label>
        <Input
          type="number"
          min="0"
          placeholder="0"
          value={userProfile.siblingsInCollege || ''}
          onChange={(e) =>
            setUserProfile({ ...userProfile, siblingsInCollege: parseInt(e.target.value) || 0 })
          }
          className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 h-12 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Residency Status</Label>
        <Select value={residencyStatus} onValueChange={setResidencyStatus}>
          <SelectTrigger className="bg-white border border-gray-300 text-gray-900 h-12 rounded-lg">
            <SelectValue placeholder="Select residency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-state">In-State Resident</SelectItem>
            <SelectItem value="out-of-state">Out-of-State Resident</SelectItem>
            <SelectItem value="international">International Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="firstGen"
          checked={userProfile.isFirstGeneration}
          onCheckedChange={(checked) =>
            setUserProfile({ ...userProfile, isFirstGeneration: checked as boolean })
          }
          className="border-gray-300"
        />
        <Label htmlFor="firstGen" className="text-gray-700 cursor-pointer">
          First-generation college student
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="lowIncome"
          checked={userProfile.isLowIncome}
          onCheckedChange={(checked) =>
            setUserProfile({ ...userProfile, isLowIncome: checked as boolean })
          }
          className="border-gray-300"
        />
        <Label htmlFor="lowIncome" className="text-gray-700 cursor-pointer">
          Low-income family (eligible for free/reduced lunch)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="minority"
          checked={userProfile.isMinority}
          onCheckedChange={(checked) =>
            setUserProfile({ ...userProfile, isMinority: checked as boolean })
          }
          className="border-gray-300"
        />
        <Label htmlFor="minority" className="text-gray-700 cursor-pointer">
          Underrepresented minority
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="disability"
          checked={userProfile.hasDisability}
          onCheckedChange={(checked) =>
            setUserProfile({ ...userProfile, hasDisability: checked as boolean })
          }
          className="border-gray-300"
        />
        <Label htmlFor="disability" className="text-gray-700 cursor-pointer">
          Student with disability
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="veteran"
          checked={userProfile.isVeteran}
          onCheckedChange={(checked) =>
            setUserProfile({ ...userProfile, isVeteran: checked as boolean })
          }
          className="border-gray-300"
        />
        <Label htmlFor="veteran" className="text-gray-700 cursor-pointer">
          Veteran or active military
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="international"
          checked={userProfile.isInternational}
          onCheckedChange={(checked) => {
            setUserProfile({ ...userProfile, isInternational: checked as boolean });
            if (checked) setResidencyStatus('international');
          }}
          className="border-gray-300"
        />
        <Label htmlFor="international" className="text-gray-700 cursor-pointer">
          International student
        </Label>
      </div>
    </div>
  </CardContent>
</Card>


            {/* Living Arrangements */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center text-gray-900 text-2xl">
      <Home className="h-6 w-6 mr-2 text-orange-600" />
      Living Arrangements
    </CardTitle>
    <CardDescription className="text-gray-700 text-base">
      Housing and meal plan preferences
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Housing Plan</Label>
        <Select
          value={userProfile.housingPlan}
          onValueChange={(value) =>
            setUserProfile({ ...userProfile, housingPlan: value })
          }
        >
          <SelectTrigger className="bg-white border border-gray-300 text-gray-900 h-12 rounded-lg">
            <SelectValue placeholder="Select housing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on-campus">On-Campus Dorm</SelectItem>
            <SelectItem value="off-campus">Off-Campus Housing</SelectItem>
            <SelectItem value="apartment">Off-Campus Apartment</SelectItem>
            <SelectItem value="commute">Commute from Home</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-gray-900 text-base mb-2 block">Meal Plan</Label>
        <Select
          value={userProfile.mealPlan}
          onValueChange={(value) =>
            setUserProfile({ ...userProfile, mealPlan: value })
          }
        >
          <SelectTrigger className="bg-white border border-gray-300 text-gray-900 h-12 rounded-lg">
            <SelectValue placeholder="Select meal plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unlimited">Unlimited Meals</SelectItem>
            <SelectItem value="partial">Partial Meal Plan</SelectItem>
            <SelectItem value="none">No Meal Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox
        id="vehicle"
        checked={userProfile.hasVehicle}
        onCheckedChange={(checked) =>
          setUserProfile({ ...userProfile, hasVehicle: checked as boolean })
        }
        className="border-gray-300"
      />
      <Label htmlFor="vehicle" className="text-gray-700 cursor-pointer">
        I will have a vehicle on campus
      </Label>
    </div>
  </CardContent>
</Card>

            {/* Calculate Button */}
            <div className="text-center">
              <Button 
                onClick={handleCalculate}
                size="lg"
                className="bg-blue-900 hover:from-blue-700 hover:to-purple-700 px-12 py-6 text-lg font-semibold"
              >
                <Calculator className="mr-2 h-6 w-6" />
                Calculate My Costs
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults && (
              <>
                {/* Cost Summary Card */}
<Card className="bg-white text-gray-900 shadow-2xl border border-gray-200 rounded-2xl">
  <CardHeader>
    <CardTitle className="text-center text-3xl font-bold">
      Annual Cost Summary
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <span className="text-lg">Total Costs</span>
        <span className="text-3xl font-bold">{formatCurrency(costs.total)}</span>
      </div>
      <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <span className="text-lg">Financial Aid</span>
        <span className="text-3xl font-bold text-black">
          -{formatCurrency(aid.total)}
        </span>
      </div>
      <div className="flex justify-between items-center py-4 bg-blue-50 rounded-lg px-4">
        <span className="text-xl font-semibold">Net Annual Cost</span>
        <span className="text-4xl font-black text-blue-900">{formatCurrency(netCost)}</span>
      </div>
    </div>
  </CardContent>
</Card>


                {/* Detailed Cost Breakdown */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="text-gray-900 text-xl font-bold">
      Detailed Cost Breakdown
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex justify-between text-gray-700">
        <span>Tuition</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.tuition)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Fees</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.fees)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Housing</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.housing)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Meals</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.meals)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Books & Supplies</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.books)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Transportation</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.transportation)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Personal Expenses</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.personal)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Technology & Equipment</span>
        <span className="font-semibold text-gray-900">{formatCurrency(costs.technology)}</span>
      </div>
    </div>
  </CardContent>
</Card>

                {/* Financial Aid Breakdown */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="text-gray-900 text-xl font-bold">
      Financial Aid Estimate
    </CardTitle>
    <CardDescription className="text-gray-700">
      Based on your profile and federal guidelines
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Grants (Free Money)</span>
        <span className="font-semibold text-green-600 text-lg">
          {formatCurrency(aid.grants)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Scholarships (Free Money)</span>
        <span className="font-semibold text-blue-600 text-lg">
          {formatCurrency(aid.scholarships)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Work-Study (Earned)</span>
        <span className="font-semibold text-purple-600 text-lg">
          {formatCurrency(aid.workStudy)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Student Loans (Repay)</span>
        <span className="font-semibold text-orange-600 text-lg">
          {formatCurrency(aid.loans)}
        </span>
      </div>
      <div className="pt-3 mt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-semibold">Total Aid Package</span>
          <span className="font-bold text-gray-900 text-xl">
            {formatCurrency(aid.total)}
          </span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

                {/* 4-Year Projection */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="text-gray-900 text-xl font-bold">
      4-Year Cost Projection
    </CardTitle>
    <CardDescription className="text-gray-700">
      Assuming 3% annual increase
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {[1, 2, 3, 4].map((year) => {
        const yearCost = netCost * Math.pow(1.03, year - 1);
        return (
          <div key={year} className="flex justify-between text-gray-700">
            <span>Year {year}</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(yearCost)}
            </span>
          </div>
        );
      })}
      <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
        <span className="text-gray-900 font-bold text-lg">Total 4-Year Cost</span>
        <span className="text-2xl font-black bg-blue-900 bg-clip-text text-transparent">
          {formatCurrency(netCost * 4.18)}
        </span>
      </div>
    </div>
  </CardContent>
</Card>

                {/* Payment Options Info */}
<Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="text-gray-900 text-xl font-bold flex items-center">
      <Info className="h-5 w-5 mr-2 text-blue-600" />
      Payment Options
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3 text-gray-700 text-sm">
    <div className="flex items-start space-x-2">
      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
      <span>Monthly payment plans available at most schools</span>
    </div>
    <div className="flex items-start space-x-2">
      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
      <span>Apply for additional scholarships to reduce costs</span>
    </div>
    <div className="flex items-start space-x-2">
      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
      <span>Consider working part-time to offset expenses</span>
    </div>
    <div className="flex items-start space-x-2">
      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
      <span>Explore parent PLUS loans if eligible</span>
    </div>
  </CardContent>
</Card>

                {/* CTA Buttons */}
<div className="space-y-3">
  <Button
    asChild
    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
  >
    <Link to="/scholarships">
      <Award className="mr-2 h-5 w-5" />
      Find Scholarships
    </Link>
  </Button>
  <Button
    asChild
    variant="outline"
    className="w-full border border-gray-300 text-gray-900 hover:bg-blue-50 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
  >
    <Link to="/fafsa">
      <Target className="mr-2 h-5 w-5" />
      FAFSA Guide
    </Link>
  </Button>
</div>
</>
)}

{!showResults && (
  <Card className="bg-white border border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 rounded-2xl">
    <CardContent className="p-8 text-center">
      <Calculator className="h-16 w-16 mx-auto mb-4 text-blue-600" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Calculate?</h3>
      <p className="text-gray-700">
        Fill out the form and click "Calculate My Costs" to see your personalized estimate.
      </p>
    </CardContent>
  </Card>
)}
</div>
</div>


       {/* Disclaimer */}
{showResults && (
  <Card className="mt-8 bg-white border border-yellow-400 shadow-lg rounded-2xl">
    <CardContent className="p-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-gray-700 text-sm">
          <p className="font-semibold text-gray-900 mb-1">Important Disclaimer</p>
          <p>
            These are estimates based on general data and your profile. Actual costs and financial aid packages vary by institution. 
            Contact the college's financial aid office for official estimates. Use your institution's Net Price Calculator for more accurate results.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
)}
</div>
</div>
);
};

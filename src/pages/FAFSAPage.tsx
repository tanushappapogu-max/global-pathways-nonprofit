import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, CheckCircle, AlertCircle, Calendar, DollarSign, FileText, 
  Users, ExternalLink, Clock, Info, Calculator, Globe, ArrowRight, 
  Target, Sparkles, Rocket, Award, Zap
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';
import { CountUp } from '@/components/animations/CountUp';

export const FAFSAPage: React.FC = () => {
  const [fafsaContent, setFafsaContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grant Calculator State
  const [familyIncome, setFamilyIncome] = useState('');
  const [familySize, setFamilySize] = useState('');
  const [studentsInCollege, setStudentsInCollege] = useState('');
  const [parentAge, setParentAge] = useState('');
  const [assets, setAssets] = useState('');
  const [studentIncome, setStudentIncome] = useState('');
  const [studentAssets, setStudentAssets] = useState('');
  const [dependencyStatus, setDependencyStatus] = useState('dependent');
  const [estimatedGrant, setEstimatedGrant] = useState<number | null>(null);

  useEffect(() => {
    fetchFAFSAContent();
  }, []);

  const fetchFAFSAContent = async () => {
    try {
      const { data, error } = await supabase
        .from('fafsa_content_2025_10_14_03_00')
        .select('*')
        .order('section_order');

      if (error) {
        console.error('Error fetching FAFSA content:', error);
        return;
      }

      setFafsaContent(data || []);
    } catch (error) {
      console.error('Error fetching FAFSA content:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedGrant = () => {
    const income = parseInt(familyIncome) || 0;
    const size = parseInt(familySize) || 1;
    const studentsNum = parseInt(studentsInCollege) || 1;
    const parentAgeNum = parseInt(parentAge) || 45;
    const familyAssets = parseInt(assets) || 0;
    const studentIncomeNum = parseInt(studentIncome) || 0;
    const studentAssetsNum = parseInt(studentAssets) || 0;

    let estimatedEFC = 0;
    let adjustedIncome = income;
    
    const incomeProtectionAllowances = {
      1: 11040, 2: 14520, 3: 18100, 4: 22350, 5: 26420, 6: 30920
    };
    const incomeProtection = incomeProtectionAllowances[Math.min(size, 6)] || 30920;
    adjustedIncome = Math.max(0, income - incomeProtection);
    
    const assetProtectionAllowance = parentAgeNum < 45 ? 0 : (parentAgeNum - 45) * 300 + 20000;
    const assessableAssets = Math.max(0, familyAssets - assetProtectionAllowance);
    const studentContribution = Math.max(0, studentIncomeNum - 7040) * 0.5 + studentAssetsNum * 0.2;
    const parentContribution = adjustedIncome * 0.22 + assessableAssets * 0.056;
    
    estimatedEFC = (parentContribution + studentContribution) / studentsNum;
    
    const maxPellGrant = 7395;
    let pellGrant = 0;
    
    if (estimatedEFC <= 6656) {
      pellGrant = maxPellGrant - (estimatedEFC * 0.75);
      pellGrant = Math.max(0, Math.min(pellGrant, maxPellGrant));
    }
    
    let additionalGrants = 0;
    if (income < 30000) additionalGrants = 3000;
    else if (income < 60000) additionalGrants = 2000;
    else if (income < 100000) additionalGrants = 1000;
    
    const totalEstimatedGrant = Math.round(pellGrant + additionalGrants);
    setEstimatedGrant(totalEstimatedGrant);
  };

  const eligibilityRequirements = [
    "U.S. citizen, U.S. national, or eligible noncitizen",
    "Valid Social Security number (with few exceptions)",
    "Enrolled or planning to enroll in eligible degree program",
    "Male students (18-25) must register with Selective Service",
    "Maintain satisfactory academic progress",
    "Not in default on federal student loans",
    "High school diploma, GED, or completion of high school in approved homeschool setting"
  ];

  const requiredDocuments = [
    {
      category: "Personal Information",
      items: ["Social Security number", "Driver's license number (if applicable)", "Alien Registration Number (if not a U.S. citizen)"]
    },
    {
      category: "Tax Information",
      items: ["Federal tax returns (yours and parents' if dependent)", "W-2 forms and other records of money earned", "1099 forms (interest, dividends, unemployment)", "Business and investment mortgage information"]
    },
    {
      category: "Financial Records",
      items: ["Bank account statements", "Investment records (stocks, bonds, mutual funds)", "Records of untaxed income", "Current balance of cash, savings, and checking accounts"]
    },
    {
      category: "Benefits Information",
      items: ["Records of child support received", "Veterans benefits records", "Social Security benefits", "SNAP (food stamps) benefits"]
    }
  ];

  const applicationSteps = [
    {
      step: 1, title: "Create FSA ID", 
      description: "Visit studentaid.gov to create your Federal Student Aid ID. Both you and your parent (if dependent) need separate FSA IDs.",
      timeframe: "Before starting application",
      details: ["Use your legal name as it appears on your Social Security card", "Choose a strong password and security questions", "Verify your email address and phone number", "Keep your FSA ID information secure - it's your electronic signature"],
      tips: "Your FSA ID serves as your legal signature and gives you access to Federal Student Aid websites."
    },
    {
      step: 2, title: "Gather Required Documents",
      description: "Collect all necessary financial documents and tax information for you and your parents (if dependent).",
      timeframe: "1-2 weeks before application",
      details: ["Use the IRS Data Retrieval Tool when possible", "Have both student and parent tax returns ready", "Gather bank statements from the application date", "Collect investment and business records"],
      tips: "The IRS Data Retrieval Tool can automatically import your tax information, reducing errors and processing time."
    },
    {
      step: 3, title: "Complete the FAFSA Form",
      description: "Fill out the Free Application for Federal Student Aid online at studentaid.gov.",
      timeframe: "30-60 minutes",
      details: ["Answer all questions accurately and completely", "Use the IRS Data Retrieval Tool when prompted", "List schools in order of preference", "Review all information before submitting"],
      tips: "Save your progress frequently and double-check all information before submitting."
    },
    {
      step: 4, title: "Review Student Aid Report (SAR)",
      description: "Review your SAR for accuracy and make corrections if needed.",
      timeframe: "3-5 days after submission",
      details: ["Check all personal and financial information", "Verify your Expected Family Contribution (EFC)", "Make corrections online if necessary", "Print and save a copy for your records"],
      tips: "Your EFC determines your eligibility for need-based aid. A lower EFC means more aid eligibility."
    },
    {
      step: 5, title: "Review Financial Aid Offers",
      description: "Compare aid packages from different schools and make informed decisions.",
      timeframe: "After receiving offers",
      details: ["Compare total cost of attendance vs. aid offered", "Understand the difference between grants, loans, and work-study", "Consider loan terms and repayment options", "Accept, decline, or request changes to your aid package"],
      tips: "Don't just look at the aid amount - consider the net cost and loan burden for each school."
    },
    {
      step: 6, title: "Complete Verification (if selected)",
      description: "Provide additional documentation if your application is selected for verification.",
      timeframe: "As soon as possible after notification",
      details: ["Submit requested documents promptly", "Provide tax transcripts from the IRS", "Complete verification worksheets accurately", "Respond to all school requests quickly"],
      tips: "About 1 in 3 applications are selected for verification. Respond quickly to avoid delays in aid processing."
    }
  ];

  const aidTypes = [
    {
      type: "Federal Pell Grant",
      amount: "Up to $7,395 (2025-26)",
      description: "Need-based grant that doesn't need to be repaid",
      eligibility: "Undergraduate students with exceptional financial need"
    },
    {
      type: "Federal Supplemental Educational Opportunity Grant (FSEOG)",
      amount: "$100 - $4,000",
      description: "Additional need-based grant for students with lowest EFC",
      eligibility: "Undergraduate students with exceptional financial need"
    },
    {
      type: "Direct Subsidized Loans",
      amount: "Up to $5,500 (freshmen)",
      description: "Government pays interest while you're in school",
      eligibility: "Undergraduate students with financial need"
    },
    {
      type: "Direct Unsubsidized Loans",
      amount: "Up to $12,500 (independent students)",
      description: "Not based on need, but interest accrues while in school",
      eligibility: "All students regardless of need"
    }
  ];

  const keyStats = [
    { number: 7395, label: "Max Pell Grant", prefix: "$", color: "text-gray-900" },
    { number: 17, label: "Million Students Aided", suffix: "M", color: "text-gray-900" },
    { number: 100, label: "Billion in Aid", prefix: "$", suffix: "B", color: "text-gray-900" },
    { number: 30, label: "Minutes to Complete", suffix: "", color: "text-gray-900" }
  ];

  const stateDeadlines = [
    { state: "California", deadline: "March 2", priority: "High", notes: "Cal Grant deadline" },
    { state: "Texas", deadline: "March 15", priority: "High", notes: "TEXAS Grant priority" },
    { state: "New York", deadline: "May 1", priority: "Medium", notes: "TAP application" },
    { state: "Florida", deadline: "May 15", priority: "Medium", notes: "Florida Student Aid" },
    { state: "Illinois", deadline: "March 1", priority: "High", notes: "MAP Grant priority" },
    { state: "Pennsylvania", deadline: "May 1", priority: "Medium", notes: "State grant programs" },
  ];

  const citizenshipStatuses = [
    {
      status: "U.S. Citizen",
      fafsaEligible: true,
      description: "Full FAFSA eligibility for all federal aid programs",
      aidTypes: ["Pell Grant", "Federal loans", "Work-study", "State aid"]
    },
    {
      status: "Permanent Resident (Green Card)",
      fafsaEligible: true,
      description: "Full FAFSA eligibility same as U.S. citizens",
      aidTypes: ["Pell Grant", "Federal loans", "Work-study", "State aid"]
    },
    {
      status: "F-1 Visa Student",
      fafsaEligible: false,
      description: "Not eligible for FAFSA. Must seek institutional aid",
      aidTypes: ["College scholarships", "Private scholarships", "Institutional aid"]
    },
    {
      status: "J-1 Visa Student",
      fafsaEligible: false,
      description: "Not eligible for FAFSA. Limited aid options available",
      aidTypes: ["College scholarships", "Private scholarships", "Sponsor funding"]
    }
  ];

  const alternativeAid = [
    {
      title: "Institutional Scholarships",
      description: "Merit and need-based aid directly from colleges",
      eligibility: "All students including internationals",
      application: "Usually through college application"
    },
    {
      title: "Private Scholarships",
      description: "Scholarships from organizations, foundations, and companies",
      eligibility: "Varies by scholarship",
      application: "Separate applications required"
    },
    {
      title: "State Aid Programs",
      description: "Financial aid from individual state governments",
      eligibility: "Usually requires state residency",
      application: "Often through FAFSA or state forms"
    },
    {
      title: "Work-Study Programs",
      description: "Part-time employment to help pay education costs",
      eligibility: "Federal and institutional programs available",
      application: "Through FAFSA or college financial aid office"
    }
  ];

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Hero Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <FileText className="w-5 h-5 mr-2" />
            Free Federal Financial Aid
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-[1.3]">
            <span className="block text-gray-900 mb-4">
              FAFSA
            </span>
            <span className="block text-gray-900">
              Complete Guide
            </span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Everything you need to unlock federal financial aid for college
          </p>
        </motion.div>

        {/* Key Stats */}
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
          {keyStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.05 }}
              className="text-center bg-white backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-300"
            >
              <div className={`text-4xl font-black ${stat.color} mb-3`}>
                <CountUp end={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-gray-700 text-base font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex bg-white border border-gray-200 p-2 rounded-2xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-xl px-6 text-gray-700">Overview</TabsTrigger>
              <TabsTrigger value="eligibility" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-xl px-6 text-gray-700">Eligibility</TabsTrigger>
              <TabsTrigger value="application" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-xl px-6 text-gray-700">How to Apply</TabsTrigger>
              <TabsTrigger value="calculator" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-xl px-6 text-gray-700">Calculator</TabsTrigger>
              <TabsTrigger value="citizenship" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-xl px-6 text-gray-700">Citizenship</TabsTrigger>
              <TabsTrigger value="alternatives" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-xl px-6 text-gray-700">Alternatives</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <motion.div 
              className="grid lg:grid-cols-2 gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <BookOpen className="h-6 w-6 mr-3 text-blue-900" />
                    What is FAFSA?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p className="text-lg leading-relaxed">
                    FAFSA is a form used by students in the United States to apply for financial aid for college or university. 
                    It determines eligibility for federal aid such as grants, loans, and work-study programs.
                  </p>
                  <div className="space-y-3">
                    {["Free to complete", "Required for federal aid", "Used by states and colleges", "Must be completed annually"].map((item, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-blue-900 mr-3" />
                        <span className="text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Calendar className="h-6 w-6 mr-3 text-blue-900" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { date: "October 1", desc: "FAFSA opens for following academic year", color: "border-blue-600 bg-blue-100" },
                    { date: "ASAP", desc: "Submit early - some aid is first-come, first-served", color: "border-blue-600 bg-blue-100" },
                    { date: "June 30", desc: "Federal deadline for FAFSA submission", color: "border-blue-600 bg-blue-100" }
                  ].map((item, i) => (
                    <div key={i} className={`border-l-4 ${item.color} pl-4 py-2 rounded-r-lg`}>
                      <h4 className="font-bold text-gray-900 text-base">{item.date}</h4>
                      <p className="text-gray-700 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* State Deadlines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <AlertCircle className="h-6 w-6 mr-3 text-blue-900" />
                    State Priority Deadlines
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Missing state deadlines can cost you thousands in aid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-900">
                          <th className="text-left py-4 text-base font-semibold">State</th>
                          <th className="text-left py-4 text-base font-semibold">Deadline</th>
                          <th className="text-left py-4 text-base font-semibold">Priority</th>
                          <th className="text-left py-4 text-base font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stateDeadlines.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-4 font-medium text-gray-900">{item.state}</td>
                            <td className="py-4 text-gray-700">{item.deadline}</td>
                            <td className="py-4">
                              <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'} className="text-sm">
                                {item.priority}
                              </Badge>
                            </td>
                            <td className="py-4 text-gray-600 text-sm">{item.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Alert className="mt-8 bg-blue-100 border-blue-300">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-gray-700">
                <strong>Pro Tip:</strong> Submit your FAFSA as early as possible after October 1st. Some aid is awarded on a first-come, first-served basis.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="eligibility">
            <motion.div 
              className="grid lg:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Users className="h-6 w-6 mr-3 text-blue-900" />
                    Basic Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {eligibilityRequirements.map((req, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-900 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-base leading-relaxed">{req}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg hover:border-blue-400 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <DollarSign className="h-6 w-6 mr-3 text-blue-900" />
                    Types of Federal Aid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aidTypes.map((aid, index) => (
                    <div key={index} className="border-l-4 border-blue-900 pl-4 py-2 bg-blue-50 rounded-r-lg">
                      <h4 className="font-semibold text-gray-900 text-base">{aid.type}</h4>
                      <p className="text-sm text-gray-600">{aid.description}</p>
                      <p className="text-sm font-medium text-blue-900">{aid.amount}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="application">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {applicationSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-lg hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-lg text-gray-700 mb-4">{step.description}</p>
                      <Badge variant="outline" className="mb-4 text-sm border-gray-300 text-gray-700">
                        <Clock className="h-4 w-4 mr-2" />
                        {step.timeframe}
                      </Badge>
                      <div className="space-y-2 mb-4">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-blue-900 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                      <Alert className="bg-blue-100 border-blue-300">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-gray-700 text-sm">
                          <strong>Tip:</strong> {step.tips}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Required Documents */}
              <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <FileText className="h-6 w-6 mr-3 text-blue-900" />
                    Required Documents Checklist
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Gather these documents before starting your FAFSA application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {requiredDocuments.map((category, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 text-lg">{category.category}</h3>
                        <div className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-blue-900 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Guide from Supabase */}
              {fafsaContent.length > 0 && (
                <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <BookOpen className="h-6 w-6 mr-3 text-blue-900" />
                      Detailed Application Guide
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      Comprehensive step-by-step instructions for completing your FAFSA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {fafsaContent.map((section, index) => (
                        <div key={section.id} className="border-l-4 border-blue-900 pl-6 bg-blue-50 py-3 rounded-r-lg">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {section.section_name}
                          </h3>
                          {section.subsection_name && (
                            <h4 className="text-md font-medium text-blue-900 mb-3">
                              {section.subsection_name}
                            </h4>
                          )}
                          <div className="prose prose-sm max-w-none text-gray-700">
                            {section.content.split('\n').map((paragraph, pIndex) => (
                              <p key={pIndex} className="mb-3 leading-relaxed">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="calculator">
            <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-3xl text-gray-900">
                  <Calculator className="h-8 w-8 mr-3 text-blue-900" />
                  Federal Grant Estimator
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Get an estimate of your potential federal grant eligibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Family Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="familyIncome" className="text-gray-900 text-base mb-2 block">Annual Family Income ($)</Label>
                        <Input 
                          id="familyIncome" 
                          type="number" 
                          placeholder="50000" 
                          value={familyIncome} 
                          onChange={(e) => setFamilyIncome(e.target.value)} 
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 text-base h-12" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="familySize" className="text-gray-900 text-base mb-2 block">Family Size</Label>
                        <Select value={familySize} onValueChange={setFamilySize}>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12 text-base">
                            <SelectValue placeholder="Select family size" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={n.toString()}>{n}{n === 6 ? '+' : ''} {n === 1 ? 'person' : 'people'}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="studentsInCollege" className="text-gray-900 text-base mb-2 block">Students in College</Label>
                        <Select value={studentsInCollege} onValueChange={setStudentsInCollege}>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12 text-base">
                            <SelectValue placeholder="Number of students" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4].map(n => <SelectItem key={n} value={n.toString()}>{n}{n === 4 ? '+' : ''} student{n === 1 ? '' : 's'}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="parentAge" className="text-gray-900 text-base mb-2 block">Older Parent's Age</Label>
                        <Input 
                          id="parentAge" 
                          type="number" 
                          placeholder="45" 
                          value={parentAge} 
                          onChange={(e) => setParentAge(e.target.value)} 
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 text-base h-12" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="assets" className="text-gray-900 text-base mb-2 block">Family Assets ($)</Label>
                        <Input 
                          id="assets" 
                          type="number" 
                          placeholder="25000" 
                          value={assets} 
                          onChange={(e) => setAssets(e.target.value)} 
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 text-base h-12" 
                        />
                        <p className="text-sm text-gray-600 mt-1">Savings, investments, real estate (excluding primary home)</p>
                      </div>
                      <div>
                        <Label htmlFor="studentIncome" className="text-gray-900 text-base mb-2 block">Student Annual Income ($)</Label>
                        <Input 
                          id="studentIncome" 
                          type="number" 
                          placeholder="5000" 
                          value={studentIncome} 
                          onChange={(e) => setStudentIncome(e.target.value)} 
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 text-base h-12" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentAssets" className="text-gray-900 text-base mb-2 block">Student Assets ($)</Label>
                        <Input 
                          id="studentAssets" 
                          type="number" 
                          placeholder="2000" 
                          value={studentAssets} 
                          onChange={(e) => setStudentAssets(e.target.value)} 
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 text-base h-12" 
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={calculateEstimatedGrant} 
                      className="w-full bg-blue-900 hover:bg-blue-800 text-white h-14 text-lg font-bold shadow-lg"
                    >
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Grant Estimate
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {estimatedGrant !== null && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-blue-100 backdrop-blur-sm border border-blue-300 rounded-3xl p-8 shadow-lg"
                      >
                        <div className="text-center">
                          <div className="text-5xl font-black text-gray-900 mb-4">
                            ${estimatedGrant.toLocaleString()}
                          </div>
                          <p className="text-xl text-gray-900 font-bold mb-6">Estimated Annual Grant</p>
                          <div className="text-gray-700 space-y-2 text-left text-sm">
                            <p>• Includes Federal Pell Grant and state grants</p>
                            <p>• Actual amounts may vary by school</p>
                            <p>• Complete FAFSA for official determination</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <Card className="bg-blue-100 border-blue-300">
                      <CardHeader>
                        <CardTitle className="text-gray-900 text-lg">Important Notes</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-700 space-y-3">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-900" />
                          <p>This is an estimate only. Actual aid depends on many factors including school costs, state programs, and federal funding.</p>
                        </div>
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-900" />
                          <p>The calculation uses simplified formulas. The actual FAFSA uses more complex algorithms.</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-900" />
                          <p>Complete the official FAFSA at studentaid.gov for accurate aid determination.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="citizenship">
            <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <Globe className="h-6 w-6 mr-3 text-blue-900" />
                  FAFSA Eligibility by Citizenship Status
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Understanding financial aid eligibility based on your citizenship status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {citizenshipStatuses.map((status, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-400 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{status.status}</h3>
                        <Badge variant={status.fafsaEligible ? 'default' : 'secondary'} className="bg-blue-900 text-white">
                          {status.fafsaEligible ? 'FAFSA Eligible' : 'Not FAFSA Eligible'}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{status.description}</p>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Available Aid Types:</h4>
                        <div className="flex flex-wrap gap-2">
                          {status.aidTypes.map((aidType, aidIndex) => (
                            <Badge key={aidIndex} variant="outline" className="border-gray-300 text-gray-700">
                              {aidType}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alternatives">
            <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <Target className="h-6 w-6 mr-3 text-blue-900" />
                  Alternative Financial Aid Options
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Explore other funding sources if you're not eligible for FAFSA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {alternativeAid.map((aid, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-400 transition-all">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{aid.title}</h3>
                      <p className="text-gray-700 mb-4">{aid.description}</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Eligibility: </span>
                          <span className="text-gray-600">{aid.eligibility}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Application: </span>
                          <span className="text-gray-600">{aid.application}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button className="bg-blue-900 hover:bg-blue-800 text-white h-20 text-xl font-bold shadow-lg group" asChild>
              <a href="https://studentaid.gov/h/apply-for-aid/fafsa" target="_blank" rel="noopener noreferrer">
                <Rocket className="mr-3 h-6 w-6 group-hover:translate-y-[-4px] transition-transform" />
                Start FAFSA Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-xl font-bold border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white transition-all group"
              onClick={() => {
                const tabs = document.querySelectorAll('[role="tab"]');
                const calculatorTab = Array.from(tabs).find(tab => 
                  tab.textContent?.includes('Calculator')
                ) as HTMLElement;
                if (calculatorTab) {
                  calculatorTab.click();
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                }
              }}
            >
              <Calculator className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
              Calculate Expected Aid
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
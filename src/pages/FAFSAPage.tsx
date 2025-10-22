import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  FileText, 
  Users, 
  ExternalLink,
  Clock,
  Info,
  Download,
  Calculator,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Star,
  Target,
  TrendingUp,
  Shield,
  HelpCircle
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';

export const FAFSAPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
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

    // Simplified Federal Pell Grant calculation (actual calculation is more complex)
    let estimatedEFC = 0;
    
    // Income assessment
    let adjustedIncome = income;
    
    // Income protection allowance based on family size
    const incomeProtectionAllowances = {
      1: 11040, 2: 14520, 3: 18100, 4: 22350, 5: 26420, 6: 30920
    };
    const incomeProtection = incomeProtectionAllowances[Math.min(size, 6)] || 30920;
    
    adjustedIncome = Math.max(0, income - incomeProtection);
    
    // Asset assessment (simplified)
    const assetProtectionAllowance = parentAgeNum < 45 ? 0 : (parentAgeNum - 45) * 300 + 20000;
    const assessableAssets = Math.max(0, familyAssets - assetProtectionAllowance);
    
    // Student contribution
    const studentContribution = Math.max(0, studentIncomeNum - 7040) * 0.5 + studentAssetsNum * 0.2;
    
    // Parent contribution
    const parentContribution = adjustedIncome * 0.22 + assessableAssets * 0.056;
    
    estimatedEFC = (parentContribution + studentContribution) / studentsNum;
    
    // Pell Grant calculation (2024-25 maximum is $7,395)
    const maxPellGrant = 7395;
    let pellGrant = 0;
    
    if (estimatedEFC <= 6656) {
      pellGrant = maxPellGrant - (estimatedEFC * 0.75);
      pellGrant = Math.max(0, Math.min(pellGrant, maxPellGrant));
    }
    
    // Additional state and institutional grants (estimated)
    let additionalGrants = 0;
    if (income < 30000) {
      additionalGrants = 3000;
    } else if (income < 60000) {
      additionalGrants = 2000;
    } else if (income < 100000) {
      additionalGrants = 1000;
    }
    
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
      items: [
        "Social Security number",
        "Driver's license number (if applicable)",
        "Alien Registration Number (if not a U.S. citizen)"
      ]
    },
    {
      category: "Tax Information",
      items: [
        "Federal tax returns (yours and parents' if dependent)",
        "W-2 forms and other records of money earned",
        "1099 forms (interest, dividends, unemployment)",
        "Business and investment mortgage information"
      ]
    },
    {
      category: "Financial Records",
      items: [
        "Bank account statements",
        "Investment records (stocks, bonds, mutual funds)",
        "Records of untaxed income",
        "Current balance of cash, savings, and checking accounts"
      ]
    },
    {
      category: "Benefits Information",
      items: [
        "Records of child support received",
        "Veterans benefits records",
        "Social Security benefits",
        "SNAP (food stamps) benefits"
      ]
    }
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "Create FSA ID",
      description: "Visit studentaid.gov to create your Federal Student Aid ID. Both you and your parent (if dependent) need separate FSA IDs.",
      timeframe: "Before starting application",
      details: [
        "Use your legal name as it appears on your Social Security card",
        "Choose a strong password and security questions",
        "Verify your email address and phone number",
        "Keep your FSA ID information secure - it's your electronic signature"
      ],
      tips: "Your FSA ID serves as your legal signature and gives you access to Federal Student Aid websites."
    },
    {
      step: 2,
      title: "Gather Required Documents",
      description: "Collect all necessary financial documents and tax information for you and your parents (if dependent).",
      timeframe: "1-2 weeks before application",
      details: [
        "Use the IRS Data Retrieval Tool when possible",
        "Have both student and parent tax returns ready",
        "Gather bank statements from the application date",
        "Collect investment and business records"
      ],
      tips: "The IRS Data Retrieval Tool can automatically import your tax information, reducing errors and processing time."
    },
    {
      step: 3,
      title: "Complete the FAFSA Form",
      description: "Fill out the Free Application for Federal Student Aid online at studentaid.gov.",
      timeframe: "30-60 minutes",
      details: [
        "Answer all questions accurately and completely",
        "Use the IRS Data Retrieval Tool when prompted",
        "List schools in order of preference",
        "Review all information before submitting"
      ],
      tips: "Save your progress frequently and double-check all information before submitting."
    },
    {
      step: 4,
      title: "Review Student Aid Report (SAR)",
      description: "Review your SAR for accuracy and make corrections if needed.",
      timeframe: "3-5 days after submission",
      details: [
        "Check all personal and financial information",
        "Verify your Expected Family Contribution (EFC)",
        "Make corrections online if necessary",
        "Print and save a copy for your records"
      ],
      tips: "Your EFC determines your eligibility for need-based aid. A lower EFC means more aid eligibility."
    },
    {
      step: 5,
      title: "Review Financial Aid Offers",
      description: "Compare aid packages from different schools and make informed decisions.",
      timeframe: "After receiving offers",
      details: [
        "Compare total cost of attendance vs. aid offered",
        "Understand the difference between grants, loans, and work-study",
        "Consider loan terms and repayment options",
        "Accept, decline, or request changes to your aid package"
      ],
      tips: "Don't just look at the aid amount - consider the net cost and loan burden for each school."
    },
    {
      step: 6,
      title: "Complete Verification (if selected)",
      description: "Provide additional documentation if your application is selected for verification.",
      timeframe: "As soon as possible after notification",
      details: [
        "Submit requested documents promptly",
        "Provide tax transcripts from the IRS",
        "Complete verification worksheets accurately",
        "Respond to all school requests quickly"
      ],
      tips: "About 1 in 3 applications are selected for verification. Respond quickly to avoid delays in aid processing."
    }
  ];

  const aidTypes = [
    {
      type: "Federal Pell Grant",
      amount: "Up to $7,395 (2023-24)",
      description: "Need-based grant that doesn't need to be repaid",
      eligibility: "Undergraduate students with exceptional financial need",
      renewable: true
    },
    {
      type: "Federal Supplemental Educational Opportunity Grant (FSEOG)",
      amount: "$100 - $4,000",
      description: "Additional need-based grant for students with lowest EFC",
      eligibility: "Undergraduate students with exceptional financial need",
      renewable: true
    },
    {
      type: "Direct Subsidized Loans",
      amount: "Up to $5,500 (freshmen)",
      description: "Government pays interest while you're in school",
      eligibility: "Undergraduate students with financial need",
      renewable: true
    },
    {
      type: "Direct Unsubsidized Loans",
      amount: "Up to $12,500 (independent students)",
      description: "Not based on need, but interest accrues while in school",
      eligibility: "All students regardless of need",
      renewable: true
    },
    {
      type: "Federal Work-Study",
      amount: "Varies by school",
      description: "Part-time employment to help pay education expenses",
      eligibility: "Students with financial need",
      renewable: true
    },
    {
      type: "Parent PLUS Loans",
      amount: "Up to cost of attendance minus other aid",
      description: "Federal loans for parents of dependent students",
      eligibility: "Parents who pass credit check",
      renewable: true
    }
  ];

  const stateDeadlines = [
    { state: "California", deadline: "March 2", priority: "High", notes: "Cal Grant deadline" },
    { state: "Texas", deadline: "March 15", priority: "High", notes: "TEXAS Grant priority" },
    { state: "New York", deadline: "May 1", priority: "Medium", notes: "TAP application" },
    { state: "Florida", deadline: "May 15", priority: "Medium", notes: "Florida Student Aid" },
    { state: "Illinois", deadline: "March 1", priority: "High", notes: "MAP Grant priority" },
    { state: "Pennsylvania", deadline: "May 1", priority: "Medium", notes: "State grant programs" },
    { state: "Ohio", deadline: "October 1", priority: "Medium", notes: "Ohio College Opportunity Grant" },
    { state: "Michigan", deadline: "March 1", priority: "High", notes: "Michigan Competitive Scholarship" }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" />
            Financial Aid Guide
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="FAFSA Guide" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete guide to the Free Application for Federal Student Aid (FAFSA) and financial aid options
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="application">How to Apply</TabsTrigger>
            <TabsTrigger value="calculator">Grant Calculator</TabsTrigger>
            <TabsTrigger value="citizenship">Citizenship</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    What is FAFSA?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    FAFSA is a form used by students in the United States to apply for financial aid for college or university. 
                    It determines eligibility for federal aid such as grants, loans, and work-study programs.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span>Free to complete</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span>Required for federal aid</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span>Used by states and colleges</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span>Must be completed annually</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-blue-700">October 1</h4>
                      <p className="text-gray-600">FAFSA opens for the following academic year</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-green-700">As Soon as Possible</h4>
                      <p className="text-gray-600">Submit early - some aid is first-come, first-served</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-semibold text-red-700">June 30</h4>
                      <p className="text-gray-600">Federal deadline for FAFSA submission</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-orange-700">State Deadlines</h4>
                      <p className="text-gray-600">Vary by state - check your state's deadline</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* State Deadlines Table */}
            <Card className="mt-8 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  State Priority Deadlines
                </CardTitle>
                <CardDescription>
                  Missing state deadlines can cost you thousands in aid. Check your state's specific requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">State</th>
                        <th className="text-left py-2">Deadline</th>
                        <th className="text-left py-2">Priority</th>
                        <th className="text-left py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stateDeadlines.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{item.state}</td>
                          <td className="py-2">{item.deadline}</td>
                          <td className="py-2">
                            <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>
                              {item.priority}
                            </Badge>
                          </td>
                          <td className="py-2 text-sm text-gray-600">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Alert className="mt-8 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro Tip:</strong> Submit your FAFSA as early as possible after October 1st. Some aid is awarded on a first-come, first-served basis, and early submission gives you the best chance at maximum aid.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="eligibility" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Basic Eligibility Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eligibilityRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Types of Federal Aid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aidTypes.slice(0, 4).map((aid, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-blue-700">{aid.type}</h4>
                        <p className="text-sm text-gray-600">{aid.description}</p>
                        <p className="text-sm font-medium text-green-600">{aid.amount}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="application" className="mt-8">
            {/* Step-by-step Application Process */}
            <div className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Step-by-Step Application Process
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to complete your FAFSA application successfully
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {applicationSteps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-gray-50">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-gray-600 mb-3">{step.description}</p>
                            <div className="mb-3">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {step.timeframe}
                              </Badge>
                            </div>
                            <div className="space-y-2 mb-4">
                              {step.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex items-start">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{detail}</span>
                                </div>
                              ))}
                            </div>
                            <Alert className="bg-blue-50 border-blue-200">
                              <Info className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                <strong>Tip:</strong> {step.tips}
                              </AlertDescription>
                            </Alert>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Required Documents */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Required Documents Checklist
                  </CardTitle>
                  <CardDescription>
                    Gather these documents before starting your FAFSA application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {requiredDocuments.map((category, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="font-semibold text-gray-900 border-b pb-2">{category.category}</h3>
                        <div className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
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
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Detailed Application Guide
                    </CardTitle>
                    <CardDescription>
                      Comprehensive step-by-step instructions for completing your FAFSA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {fafsaContent.map((section, index) => (
                        <div key={section.id} className="border-l-4 border-blue-500 pl-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {section.section_name}
                          </h3>
                          {section.subsection_name && (
                            <h4 className="text-md font-medium text-blue-600 mb-3">
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
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Federal Grant Estimator
                  </CardTitle>
                  <CardDescription>
                    Get an estimate of your potential federal grant eligibility based on your financial information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
                        
                        <div>
                          <Label htmlFor="familyIncome">Annual Family Income ($)</Label>
                          <Input
                            id="familyIncome"
                            type="number"
                            placeholder="50000"
                            value={familyIncome}
                            onChange={(e) => setFamilyIncome(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="familySize">Family Size</Label>
                          <Select value={familySize} onValueChange={setFamilySize}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select family size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 person</SelectItem>
                              <SelectItem value="2">2 people</SelectItem>
                              <SelectItem value="3">3 people</SelectItem>
                              <SelectItem value="4">4 people</SelectItem>
                              <SelectItem value="5">5 people</SelectItem>
                              <SelectItem value="6">6+ people</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="studentsInCollege">Students in College</Label>
                          <Select value={studentsInCollege} onValueChange={setStudentsInCollege}>
                            <SelectTrigger>
                              <SelectValue placeholder="Number of students" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 student</SelectItem>
                              <SelectItem value="2">2 students</SelectItem>
                              <SelectItem value="3">3 students</SelectItem>
                              <SelectItem value="4">4+ students</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="parentAge">Older Parent's Age</Label>
                          <Input
                            id="parentAge"
                            type="number"
                            placeholder="45"
                            value={parentAge}
                            onChange={(e) => setParentAge(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="assets">Family Assets ($)</Label>
                          <Input
                            id="assets"
                            type="number"
                            placeholder="25000"
                            value={assets}
                            onChange={(e) => setAssets(e.target.value)}
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            Savings, investments, real estate (excluding primary home)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                        
                        <div>
                          <Label htmlFor="dependencyStatus">Dependency Status</Label>
                          <Select value={dependencyStatus} onValueChange={setDependencyStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dependent">Dependent Student</SelectItem>
                              <SelectItem value="independent">Independent Student</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="studentIncome">Student Annual Income ($)</Label>
                          <Input
                            id="studentIncome"
                            type="number"
                            placeholder="5000"
                            value={studentIncome}
                            onChange={(e) => setStudentIncome(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="studentAssets">Student Assets ($)</Label>
                          <Input
                            id="studentAssets"
                            type="number"
                            placeholder="2000"
                            value={studentAssets}
                            onChange={(e) => setStudentAssets(e.target.value)}
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            Student's savings and investments
                          </p>
                        </div>
                      </div>

                      <Button 
                        onClick={calculateEstimatedGrant}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Grant Estimate
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {estimatedGrant !== null && (
                        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                          <CardHeader>
                            <CardTitle className="text-green-800">Estimated Grant Eligibility</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <div className="text-4xl font-bold text-green-600 mb-2">
                                ${estimatedGrant.toLocaleString()}
                              </div>
                              <p className="text-green-700 mb-4">
                                Estimated annual grant amount
                              </p>
                              <div className="text-sm text-gray-600 space-y-2">
                                <p>• This includes Federal Pell Grant and estimated state grants</p>
                                <p>• Actual amounts may vary based on school costs and policies</p>
                                <p>• Complete the FAFSA for official determination</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-blue-800">Important Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-blue-700 space-y-3">
                          <div className="flex items-start">
                            <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <p>This is an estimate only. Actual aid depends on many factors including school costs, state programs, and federal funding.</p>
                          </div>
                          <div className="flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <p>The calculation uses simplified formulas. The actual FAFSA uses more complex algorithms.</p>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <p>Complete the official FAFSA at studentaid.gov for accurate aid determination.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardHeader>
                          <CardTitle className="text-yellow-800">Grant Types Included</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-yellow-700 space-y-2">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>Federal Pell Grant (up to $7,395)</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>Estimated State Grants</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>Federal Supplemental Educational Opportunity Grant (FSEOG)</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="citizenship" className="mt-8">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  FAFSA Eligibility by Citizenship Status
                </CardTitle>
                <CardDescription>
                  Understanding financial aid eligibility based on your citizenship status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {citizenshipStatuses.map((status, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{status.status}</h3>
                        <Badge variant={status.fafsaEligible ? 'default' : 'secondary'}>
                          {status.fafsaEligible ? 'FAFSA Eligible' : 'Not FAFSA Eligible'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{status.description}</p>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Available Aid Types:</h4>
                        <div className="flex flex-wrap gap-2">
                          {status.aidTypes.map((aidType, aidIndex) => (
                            <Badge key={aidIndex} variant="outline">
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

          <TabsContent value="alternatives" className="mt-8">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Alternative Financial Aid Options
                </CardTitle>
                <CardDescription>
                  Explore other funding sources if you're not eligible for FAFSA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {alternativeAid.map((aid, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{aid.title}</h3>
                      <p className="text-gray-600 mb-4">{aid.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-700">Eligibility: </span>
                          <span className="text-gray-600">{aid.eligibility}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Application: </span>
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

        {/* Quick Action Buttons */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button className="bg-blue-600 hover:bg-blue-700 h-16 text-lg" asChild>
              <a href="https://studentaid.gov/h/apply-for-aid/fafsa" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Start FAFSA Application
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => {
                // Find and click the calculator tab
                const tabs = document.querySelectorAll('[role="tab"]');
                const calculatorTab = Array.from(tabs).find(tab => 
                  tab.textContent?.includes('Grant Calculator')
                ) as HTMLElement;
                if (calculatorTab) {
                  calculatorTab.click();
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }
              }}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Expected Aid
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
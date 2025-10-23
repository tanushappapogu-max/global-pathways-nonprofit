import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Sparkles, 
  Award, 
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Brain,
  Users,
  Globe,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { ShinyText } from '@/components/animations/ShinyText';

import { CountUp } from '@/components/animations/CountUp';

export const AutoScholarshipFinderPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Academic Information
    gpa: '',
    satScore: '',
    actScore: '',
    classRank: '',
    major: '',
    academicHonors: [],
    
    // Personal Information
    ethnicity: '',
    gender: '',
    state: '',
    zipCode: '',
    citizenship: '',
    firstGeneration: false,
    
    // Financial Information
    familyIncome: '',
    needBasedAid: false,
    
    // Activities & Achievements
    extracurriculars: '',
    leadership: '',
    communityService: '',
    workExperience: '',
    awards: '',
    talents: [],
    
    // Career & Goals
    careerGoals: '',
    collegeType: '',
    studyAbroad: false,
    
    // Additional Information
    challenges: '',
    uniqueCircumstances: '',
    languages: []
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
  setLoading(true);
  try {
    // Import the function
    const { matchScholarships } = await import('../api/scholarshipMatcher');
    
    // Call ChatGPT to get personalized matches
    console.log('Calling ChatGPT with form data:', formData);
    const scholarships = await matchScholarships(formData);
    console.log('Received scholarships:', scholarships);
    
    if (scholarships && scholarships.length > 0) {
      setResults(scholarships);
    } else {
      // Fallback if API fails
      setResults(getMockResults());
    }
    setStep(7);
  } catch (error) {
    console.error('Error matching scholarships:', error);
    // Use fallback on error
    setResults(getMockResults());
    setStep(7);
  } finally {
    setLoading(false);
  }
};

  const getMockResults = () => {
    // Enhanced mock results based on user profile
    const baseResults = [
      {
        name: "Merit Excellence Scholarship",
        amount: 15000,
        provider: "Education Foundation",
        match: 95,
        deadline: "2024-03-15",
        description: "For high-achieving students with strong academic records",
        url: "https://example.com/merit-scholarship",
        requirements: ["3.5+ GPA", "Leadership experience", "Community service"]
      },
      {
        name: "STEM Innovation Award",
        amount: 10000,
        provider: "Tech Institute",
        match: 88,
        deadline: "2024-04-01",
        description: "Supporting students pursuing STEM fields",
        url: "https://example.com/stem-award",
        requirements: ["STEM major", "Research experience", "Innovation project"]
      },
      {
        name: "Community Leadership Grant",
        amount: 7500,
        provider: "Community Foundation",
        match: 82,
        deadline: "2024-02-28",
        description: "For students with demonstrated community involvement",
        url: "https://example.com/community-grant",
        requirements: ["100+ volunteer hours", "Leadership role", "Community impact"]
      },
      {
        name: "First Generation College Scholarship",
        amount: 5000,
        provider: "Access Foundation",
        match: 90,
        deadline: "2024-05-01",
        description: "Supporting first-generation college students",
        url: "https://example.com/first-gen",
        requirements: ["First-generation status", "Financial need", "Academic potential"]
      },
      {
        name: "Diversity & Inclusion Scholarship",
        amount: 8000,
        provider: "Diversity Institute",
        match: 85,
        deadline: "2024-03-30",
        description: "Promoting diversity in higher education",
        url: "https://example.com/diversity",
        requirements: ["Underrepresented background", "Diversity advocacy", "Academic merit"]
      }
    ];

    // Filter and adjust based on user profile
    return baseResults.filter(scholarship => {
      if (scholarship.name.includes("First Generation") && !formData.firstGeneration) {
        return false;
      }
      if (scholarship.name.includes("STEM") && !formData.major.toLowerCase().includes('engineering') && 
          !formData.major.toLowerCase().includes('science') && !formData.major.toLowerCase().includes('math')) {
        return false;
      }
      return true;
    }).map(scholarship => ({
      ...scholarship,
      match: Math.max(75, scholarship.match - Math.random() * 10) // Add some randomization
    }));
  };

  const stats = [
    { number: 50000, label: "Scholarships in Database", suffix: "+", color: "text-blue-600" },
    { number: 98, label: "Match Accuracy", suffix: "%", color: "text-green-600" },
    { number: 15, label: "Million in Aid Found", prefix: "$", suffix: "M", color: "text-purple-600" },
    { number: 45, label: "Seconds to Results", suffix: "s", color: "text-orange-600" }
  ];

  const ethnicityOptions = [
    "African American/Black", "Asian/Pacific Islander", "Hispanic/Latino", 
    "Native American", "White/Caucasian", "Middle Eastern", "Mixed/Other", "Prefer not to say"
  ];

  const talentOptions = [
    "Music", "Art", "Theater", "Dance", "Writing", "Photography", "Film", 
    "Athletics", "Debate", "Public Speaking", "Coding", "Entrepreneurship"
  ];

  const languageOptions = [
    "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Arabic", 
    "Italian", "Portuguese", "Russian", "Hindi", "Other"
  ];

  const academicHonorOptions = [
    "National Honor Society", "Beta Club", "Mu Alpha Theta", "National Merit Scholar",
    "AP Scholar", "Honor Roll", "Dean's List", "Academic All-State"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2 text-sm font-medium">
              <Brain className="w-4 h-4 mr-2 sparkle-animation" />
              AI-Powered Matching
            </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <ShinyText text="AI Scholarship Finder" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized scholarship recommendations using advanced AI and real-time web search
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            
              <Card className="text-center bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    <CountUp 
                      end={stat.number} 
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5, 6, 7].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                </div>
                {stepNumber < 7 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600">
              Step {step} of 7: {
                step === 1 ? 'Academic Information' :
                step === 2 ? 'Personal Background' :
                step === 3 ? 'Financial Information' :
                step === 4 ? 'Activities & Leadership' :
                step === 5 ? 'Career Goals' :
                step === 6 ? 'Additional Information' :
                'Your Matches'
              }
            </span>
          </div>
        </div>

        {/* Form Steps */}
        
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Information</h2>
                    <p className="text-gray-600">Tell us about your academic achievements</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Current GPA (4.0 scale)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        placeholder="3.75"
                        value={formData.gpa}
                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        SAT Score (optional)
                      </Label>
                      <Input
                        type="number"
                        min="400"
                        max="1600"
                        placeholder="1450"
                        value={formData.satScore}
                        onChange={(e) => handleInputChange('satScore', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        ACT Score (optional)
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="36"
                        placeholder="32"
                        value={formData.actScore}
                        onChange={(e) => handleInputChange('actScore', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Class Rank (if known)
                      </Label>
                      <Input
                        placeholder="Top 10%"
                        value={formData.classRank}
                        onChange={(e) => handleInputChange('classRank', e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Intended Major/Field of Study
                      </Label>
                      <Input
                        placeholder="Computer Science, Pre-Med, Business, etc."
                        value={formData.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                      Academic Honors (select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {academicHonorOptions.map((honor) => (
                        <div key={honor} className="flex items-center space-x-2">
                          <Checkbox
                            id={honor}
                            checked={formData.academicHonors.includes(honor)}
                            onCheckedChange={(checked) => handleArrayChange('academicHonors', honor, checked)}
                          />
                          <Label htmlFor={honor} className="text-sm">{honor}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Background</h2>
                    <p className="text-gray-600">Help us find scholarships that match your background</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ethnicity/Race
                      </Label>
                      <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ethnicity" />
                        </SelectTrigger>
                        <SelectContent>
                          {ethnicityOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        State of Residence
                      </Label>
                      <Input
                        placeholder="California"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </Label>
                      <Input
                        placeholder="90210"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Citizenship Status
                      </Label>
                      <Select value={formData.citizenship} onValueChange={(value) => handleInputChange('citizenship', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-citizen">U.S. Citizen</SelectItem>
                          <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                          <SelectItem value="international">International Student</SelectItem>
                          <SelectItem value="refugee">Refugee/Asylee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="firstGeneration"
                      checked={formData.firstGeneration}
                      onCheckedChange={(checked) => handleInputChange('firstGeneration', checked)}
                    />
                    <Label htmlFor="firstGeneration">
                      I am a first-generation college student (neither parent has a 4-year degree)
                    </Label>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                      Languages Spoken (select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {languageOptions.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={language}
                            checked={formData.languages.includes(language)}
                            onCheckedChange={(checked) => handleArrayChange('languages', language, checked)}
                          />
                          <Label htmlFor={language} className="text-sm">{language}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Information</h2>
                    <p className="text-gray-600">This helps us find need-based scholarships</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Family Income Range
                      </Label>
                      <Select value={formData.familyIncome} onValueChange={(value) => handleInputChange('familyIncome', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-25k">Under $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                          <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                          <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                          <SelectItem value="over-150k">Over $150,000</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="needBasedAid"
                      checked={formData.needBasedAid}
                      onCheckedChange={(checked) => handleInputChange('needBasedAid', checked)}
                    />
                    <Label htmlFor="needBasedAid">
                      I am interested in need-based financial aid
                    </Label>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Activities & Leadership</h2>
                    <p className="text-gray-600">Showcase your extracurricular involvement and achievements</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Extracurricular Activities
                      </Label>
                      <Textarea
                        placeholder="List your clubs, sports, organizations, etc."
                        value={formData.extracurriculars}
                        onChange={(e) => handleInputChange('extracurriculars', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Leadership Roles
                      </Label>
                      <Textarea
                        placeholder="Describe any leadership positions you've held"
                        value={formData.leadership}
                        onChange={(e) => handleInputChange('leadership', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Community Service & Volunteer Work
                      </Label>
                      <Textarea
                        placeholder="Describe your volunteer experiences and community involvement"
                        value={formData.communityService}
                        onChange={(e) => handleInputChange('communityService', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Experience
                      </Label>
                      <Textarea
                        placeholder="List any part-time jobs, internships, or work experience"
                        value={formData.workExperience}
                        onChange={(e) => handleInputChange('workExperience', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Awards & Recognition
                      </Label>
                      <Textarea
                        placeholder="List any awards, honors, or special recognition you've received"
                        value={formData.awards}
                        onChange={(e) => handleInputChange('awards', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-3">
                        Special Talents & Skills (select all that apply)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {talentOptions.map((talent) => (
                          <div key={talent} className="flex items-center space-x-2">
                            <Checkbox
                              id={talent}
                              checked={formData.talents.includes(talent)}
                              onCheckedChange={(checked) => handleArrayChange('talents', talent, checked)}
                            />
                            <Label htmlFor={talent} className="text-sm">{talent}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Goals & Preferences</h2>
                    <p className="text-gray-600">Tell us about your future plans and college preferences</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Career Goals & Aspirations
                      </Label>
                      <Textarea
                        placeholder="Describe your career goals and what you hope to achieve"
                        value={formData.careerGoals}
                        onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred College Type
                      </Label>
                      <Select value={formData.collegeType} onValueChange={(value) => handleInputChange('collegeType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select college type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public Universities</SelectItem>
                          <SelectItem value="private">Private Universities</SelectItem>
                          <SelectItem value="liberal-arts">Liberal Arts Colleges</SelectItem>
                          <SelectItem value="community">Community Colleges</SelectItem>
                          <SelectItem value="technical">Technical/Trade Schools</SelectItem>
                          <SelectItem value="no-preference">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="studyAbroad"
                        checked={formData.studyAbroad}
                        onCheckedChange={(checked) => handleInputChange('studyAbroad', checked)}
                      />
                      <Label htmlFor="studyAbroad">
                        I am interested in study abroad opportunities
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
                    <p className="text-gray-600">Share any unique circumstances or challenges</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Challenges or Obstacles Overcome
                      </Label>
                      <Textarea
                        placeholder="Describe any significant challenges you've faced and overcome"
                        value={formData.challenges}
                        onChange={(e) => handleInputChange('challenges', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Unique Circumstances or Background
                      </Label>
                      <Textarea
                        placeholder="Share anything unique about your background or circumstances"
                        value={formData.uniqueCircumstances}
                        onChange={(e) => handleInputChange('uniqueCircumstances', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your AI-Matched Scholarships</h2>
                    <p className="text-gray-600">Personalized recommendations based on your profile</p>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">AI is analyzing your profile and searching the web...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take up to 60 seconds</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((scholarship, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-600 bg-white/90 backdrop-blur-sm shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                  {scholarship.name}
                                </h3>
                                <p className="text-blue-600 font-medium mb-2">
                                  {scholarship.provider}
                                </p>
                                <p className="text-gray-600 text-sm mb-3">
                                  {scholarship.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                  <span>Deadline: {scholarship.deadline}</span>
                                  <Badge className="bg-green-100 text-green-800">
                                    {Math.round(scholarship.match)}% Match
                                  </Badge>
                                </div>
                                {scholarship.requirements && (
                                  <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {scholarship.requirements.map((req, reqIndex) => (
                                        <Badge key={reqIndex} variant="outline" className="text-xs">
                                          {req}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                  ${scholarship.amount.toLocaleString()}
                                </div>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 mb-2" asChild>
                                  <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                                    Apply Now
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <div className="text-center pt-6">
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mr-4"
                          onClick={() => {
                            localStorage.setItem('savedMatches', JSON.stringify(results));
                            alert('Matches saved successfully!');
                          }}
                        >
                          Save My Matches
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="/scholarships">
                            Find More Scholarships
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Back
                </Button>
                
                {step < 6 ? (
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : step === 6 ? (
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Find My Scholarships
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setStep(1)} 
                    variant="outline"
                  >
                    Start Over
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        
      </div>
    </div>
  );
};

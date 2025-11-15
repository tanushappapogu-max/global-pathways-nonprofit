import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, ArrowRight, CheckCircle, Brain, Calendar, Heart
} from 'lucide-react';
import { CountUp } from '@/components/animations/CountUp';

export const AutoScholarshipFinderPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gpa: '', satScore: '', actScore: '', classRank: '', major: '', academicHonors: [],
    ethnicity: '', gender: '', state: '', zipCode: '', citizenship: '', firstGeneration: false,
    familyIncome: '', needBasedAid: false,
    extracurriculars: '', leadership: '', communityService: '', workExperience: '', awards: '', talents: [],
    careerGoals: '', collegeType: '', studyAbroad: false,
    challenges: '', uniqueCircumstances: '', languages: []
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter(item => item !== value)
    }));
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      console.log('Starting scholarship matching...');
      
      // Get matches from database first
      let scholarships = await matchScholarshipsFromDatabase(formData);
      
      console.log('Database scholarships found:', scholarships?.length || 0);

      // If we have fewer than 8, supplement with AI
      if (!scholarships || scholarships.length < 8) {
        console.log('Getting AI scholarships to reach minimum 8...');
        const aiScholarships = await getAIScholarships(formData, 8 - (scholarships?.length || 0));
        scholarships = [...(scholarships || []), ...aiScholarships];
      }

      if (scholarships && scholarships.length > 0) {
        console.log('Total scholarships:', scholarships.length);
        setResults(scholarships);
      } else {
        const mockResults = getMockResults();
        setResults(mockResults);
      }
      
      setStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const mockResults = getMockResults();
      setResults(mockResults);
      setStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const matchScholarshipsFromDatabase = async (profile) => {
    try {
      // Fetch all scholarships from database
      const { data: allScholarships, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('amount', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Database error:', error);
        return [];
      }

      if (!allScholarships || allScholarships.length === 0) {
        return [];
      }

      // Filter and match scholarships
      const matches = allScholarships
        .filter(scholarship => {
          // STRICT FILTERING - Remove scholarships that don't match basic criteria
          
          // Gender filtering
          if (scholarship.eligibility && scholarship.name) {
            const eligibilityLower = scholarship.eligibility.toLowerCase();
            const nameLower = scholarship.name.toLowerCase();
            const combined = eligibilityLower + ' ' + nameLower;
            
            // Filter out women-only scholarships for non-female users
            if (profile.gender !== 'female' && 
                (combined.includes('women') || 
                 combined.includes('woman') || 
                 combined.includes('female') ||
                 combined.includes('she/her'))) {
              console.log(`🚫 Filtered out "${scholarship.name}" - women only, user is ${profile.gender}`);
              return false;
            }
            
            // Filter out men-only scholarships for non-male users
            if (profile.gender !== 'male' && 
                (combined.includes('men only') || 
                 combined.includes('male only'))) {
              console.log(`🚫 Filtered out "${scholarship.name}" - men only`);
              return false;
            }
          }
          
          // Ethnicity filtering - only if scholarship is ethnicity-specific and user doesn't match
          if (scholarship.eligibility) {
            const eligibilityLower = scholarship.eligibility.toLowerCase();
            const profileEthnicityLower = profile.ethnicity?.toLowerCase() || '';
            
            // Check if scholarship is ethnicity-specific
            const isHispanicOnly = eligibilityLower.includes('hispanic') || eligibilityLower.includes('latino');
            const isBlackOnly = eligibilityLower.includes('black') || eligibilityLower.includes('african american');
            const isAsianOnly = eligibilityLower.includes('asian') && !eligibilityLower.includes('all');
            const isNativeOnly = eligibilityLower.includes('native american') || eligibilityLower.includes('indigenous');
            
            // Filter if scholarship is ethnicity-specific and user doesn't match
            if (isHispanicOnly && !profileEthnicityLower.includes('hispanic') && !profileEthnicityLower.includes('latino')) {
              console.log(`🚫 Filtered out "${scholarship.name}" - Hispanic/Latino only`);
              return false;
            }
            if (isBlackOnly && !profileEthnicityLower.includes('black') && !profileEthnicityLower.includes('african')) {
              console.log(`🚫 Filtered out "${scholarship.name}" - Black/African American only`);
              return false;
            }
            if (isAsianOnly && !profileEthnicityLower.includes('asian') && !profileEthnicityLower.includes('pacific')) {
              console.log(`🚫 Filtered out "${scholarship.name}" - Asian only`);
              return false;
            }
            if (isNativeOnly && !profileEthnicityLower.includes('native')) {
              console.log(`🚫 Filtered out "${scholarship.name}" - Native American only`);
              return false;
            }
          }
          
          return true; // Scholarship passes all filters
        })
        .map(scholarship => {
          let matchScore = 50; // Base score

          // Check major match
          if (profile.major && scholarship.eligibility) {
            const majorLower = profile.major.toLowerCase();
            const eligibilityLower = scholarship.eligibility.toLowerCase();
            const nameLower = scholarship.name?.toLowerCase() || '';
            
            // Check for major match
            if (eligibilityLower.includes(majorLower)) {
              matchScore += 25;
            }
            
            // STEM major boost
            const isStemMajor = majorLower.includes('engineering') || 
                               majorLower.includes('science') || 
                               majorLower.includes('math') || 
                               majorLower.includes('computer') ||
                               majorLower.includes('biology') ||
                               majorLower.includes('biomedical') ||
                               majorLower.includes('chemical') ||
                               majorLower.includes('mechanical');
            
            const isStemScholarship = eligibilityLower.includes('stem') || 
                                     eligibilityLower.includes('engineering') ||
                                     eligibilityLower.includes('science') ||
                                     nameLower.includes('stem') ||
                                     nameLower.includes('engineering');
            
            if (isStemMajor && isStemScholarship) {
              matchScore += 20;
            }
            
            // Biomedical/Bio engineering specific
            if ((majorLower.includes('bio') || majorLower.includes('biomedical')) &&
                (eligibilityLower.includes('bio') || nameLower.includes('bio'))) {
              matchScore += 15;
            }
          }

          // Gender match bonus (not filter)
          if (profile.gender && scholarship.eligibility) {
            const eligibilityLower = scholarship.eligibility.toLowerCase();
            const nameLower = scholarship.name?.toLowerCase() || '';
            
            // Only give bonus if scholarship specifically mentions gender positively
            if (profile.gender === 'male' && 
                (eligibilityLower.includes('male students') || 
                 nameLower.includes('male scholars'))) {
              matchScore += 15;
            }
          }

          // First generation boost
          if (profile.firstGeneration && scholarship.name) {
            const nameLower = scholarship.name.toLowerCase();
            const eligibilityLower = scholarship.eligibility?.toLowerCase() || '';
            if (nameLower.includes('first generation') || 
                nameLower.includes('first-generation') ||
                eligibilityLower.includes('first generation')) {
              matchScore += 25;
            }
          }

          // Ethnicity match bonus
          if (profile.ethnicity && scholarship.eligibility) {
            const eligibilityLower = scholarship.eligibility.toLowerCase();
            const nameLower = scholarship.name?.toLowerCase() || '';
            const ethnicityLower = profile.ethnicity.toLowerCase();
            
            // Give bonus for matching ethnicity
            if (eligibilityLower.includes(ethnicityLower) ||
                (ethnicityLower.includes('asian') && (eligibilityLower.includes('asian') || eligibilityLower.includes('aapi'))) ||
                (ethnicityLower.includes('pacific') && eligibilityLower.includes('pacific')) ||
                (ethnicityLower.includes('indian') && (eligibilityLower.includes('indian') || eligibilityLower.includes('south asian')))) {
              matchScore += 25;
            }
          }

          // State/region match
          if (profile.state && scholarship.region) {
            const regionLower = scholarship.region.toLowerCase();
            const stateLower = profile.state.toLowerCase();
            if (regionLower.includes(stateLower)) {
              matchScore += 15;
            }
          }

          // GPA bonus
          if (profile.gpa && scholarship.eligibility) {
            const gpaNum = parseFloat(profile.gpa);
            const eligibilityLower = scholarship.eligibility.toLowerCase();
            
            if (gpaNum >= 3.5 && eligibilityLower.includes('3.5')) {
              matchScore += 10;
            } else if (gpaNum >= 3.0 && eligibilityLower.includes('3.0')) {
              matchScore += 10;
            }
          }

          // Cap at 95%
          matchScore = Math.min(95, matchScore);

          console.log(`✅ Matched "${scholarship.name}" with ${matchScore}% score`);

          return {
            name: scholarship.name,
            provider: scholarship.provider || 'Various',
            amount: scholarship.amount || 5000,
            deadline: scholarship.deadline || '2026-06-30',
            description: scholarship.description || 'Scholarship opportunity',
            url: scholarship.application_url || scholarship.link || 'https://example.com',
            match: matchScore,
            requirements: scholarship.eligibility ? [scholarship.eligibility] : ['Check eligibility requirements']
          };
        });

      // Sort by match score and return top matches
      const topMatches = matches
        .filter(m => m.match >= 65) // Only show good matches
        .sort((a, b) => b.match - a.match)
        .slice(0, 8);

      console.log(`📊 Final matches: ${topMatches.length} scholarships`);
      return topMatches;

    } catch (error) {
      console.error('Error matching scholarships:', error);
      return [];
    }
  };

  const getAIScholarships = async (profile, minCount) => {
    try {
      const prompt = `Find ${minCount} scholarships for a student with this profile:
- Major: ${profile.major}
- GPA: ${profile.gpa}
- Ethnicity: ${profile.ethnicity}
- Gender: ${profile.gender}
- State: ${profile.state}
- First Generation: ${profile.firstGeneration}
- Interests: ${profile.extracurriculars}

Return ONLY a JSON array with this exact structure (no markdown, no extra text):
[{
  "name": "Scholarship Name",
  "provider": "Organization Name",
  "amount": 5000,
  "deadline": "2026-03-15",
  "description": "Brief description",
  "url": "https://example.com/apply",
  "match": 85,
  "requirements": ["Requirement 1", "Requirement 2"]
}]`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        })
      });

      const data = await response.json();
      const content = data.content?.[0]?.text || '[]';
      
      // Clean up any markdown formatting
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const aiScholarships = JSON.parse(cleanContent);
      
      console.log('AI generated scholarships:', aiScholarships.length);
      return aiScholarships;
    } catch (error) {
      console.error('Error getting AI scholarships:', error);
      return [];
    }
  };

  const saveMatches = async () => {
    try {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save scholarships to your dashboard.",
          variant: "destructive"
        });
        return;
      }

      console.log('💾 Starting to save scholarships...');

      // Save each scholarship
      const savedCount = await Promise.all(results.map(async (scholarship) => {
        try {
          console.log(`📝 Processing: ${scholarship.name}`);
          
          // Check if scholarship exists in database
          let { data: existingScholarship } = await supabase
            .from('scholarships')
            .select('id')
            .eq('name', scholarship.name)
            .eq('provider', scholarship.provider)
            .single();

          let scholarshipId = existingScholarship?.id;

          // If doesn't exist, create it
          if (!scholarshipId) {
            console.log(`➕ Creating new scholarship in database: ${scholarship.name}`);
            const { data: newScholarship, error: createError } = await supabase
              .from('scholarships')
              .insert({
                name: scholarship.name,
                provider: scholarship.provider,
                amount: scholarship.amount,
                deadline: scholarship.deadline,
                description: scholarship.description,
                application_url: scholarship.url,
                category: 'merit'
              })
              .select('id')
              .single();

            if (createError) {
              console.error('❌ Error creating scholarship:', createError);
              throw createError;
            }
            scholarshipId = newScholarship.id;
            console.log(`✅ Created scholarship with ID: ${scholarshipId}`);
          } else {
            console.log(`✅ Found existing scholarship with ID: ${scholarshipId}`);
          }

          // Now save to scholarship_bookmarks_2025_10_07_02_17
          console.log(`🔖 Saving bookmark for scholarship ID: ${scholarshipId}`);
          const { error: saveError } = await supabase
            .from('scholarship_bookmarks_2025_10_07_02_17')
            .insert({
              user_id: user.id,
              scholarship_id: scholarshipId
            });

          if (saveError) {
            if (saveError.code === '23505') {
              console.log(`ℹ️ Scholarship already saved: ${scholarship.name}`);
              return true; // Already saved, not an error
            }
            console.error('❌ Error saving bookmark:', saveError);
            throw saveError;
          }

          console.log(`✅ Successfully saved: ${scholarship.name}`);
          return true;
        } catch (err) {
          console.error(`❌ Error saving scholarship: ${scholarship.name}`, err);
          return false;
        }
      }));

      const successCount = savedCount.filter(Boolean).length;
      console.log(`✅ Total saved: ${successCount}/${results.length}`);

      toast({
        title: "Success!",
        description: `${successCount} scholarship(s) saved to your dashboard!`
      });

    } catch (error) {
      console.error('❌ Error saving matches:', error);
      toast({
        title: "Error",
        description: "Failed to save some scholarships. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMockResults = () => {
    return [
      { name: "Merit Excellence Scholarship", amount: 15000, provider: "Education Foundation", match: 95, deadline: "2026-03-15", description: "For high-achieving students", url: "https://example.com/merit", requirements: ["3.5+ GPA", "Leadership"] },
      { name: "STEM Innovation Award", amount: 10000, provider: "Tech Institute", match: 88, deadline: "2026-04-01", description: "Supporting STEM students", url: "https://example.com/stem", requirements: ["STEM major", "Research experience"] },
      { name: "Community Leadership Grant", amount: 7500, provider: "Community Foundation", match: 82, deadline: "2026-02-28", description: "For community involvement", url: "https://example.com/community", requirements: ["100+ volunteer hours"] },
      { name: "First Generation Scholarship", amount: 5000, provider: "Access Foundation", match: 90, deadline: "2026-05-01", description: "Supporting first-gen students", url: "https://example.com/first-gen", requirements: ["First-generation status"] },
      { name: "Diversity & Inclusion", amount: 8000, provider: "Diversity Institute", match: 85, deadline: "2026-03-30", description: "Promoting diversity", url: "https://example.com/diversity", requirements: ["Underrepresented background"] },
      { name: "Academic Excellence Award", amount: 6000, provider: "Scholars Foundation", match: 80, deadline: "2026-04-15", description: "For top students", url: "https://example.com/academic", requirements: ["3.7+ GPA"] },
      { name: "Future Leaders Program", amount: 9000, provider: "Leadership Institute", match: 78, deadline: "2026-05-15", description: "Leadership development", url: "https://example.com/leaders", requirements: ["Leadership roles"] },
      { name: "Innovation Challenge", amount: 12000, provider: "Innovation Fund", match: 75, deadline: "2026-06-01", description: "For innovative thinkers", url: "https://example.com/innovation", requirements: ["Project portfolio"] }
    ];
  };

  const stats = [
    { number: 50000, label: "Scholarships", suffix: "+", color: "text-gray-900" },
    { number: 98, label: "Match Accuracy", suffix: "%", color: "text-gray-900" },
    { number: 15, label: "Million in Aid", prefix: "$", suffix: "M", color: "text-gray-900" },
    { number: 45, label: "Seconds", suffix: "s", color: "text-gray-900" }
  ];

  const ethnicityOptions = ["African American/Black", "Asian/Pacific Islander", "Hispanic/Latino", "Native American", "White/Caucasian", "Middle Eastern", "Mixed/Other", "Prefer not to say"];
  const talentOptions = ["Music", "Art", "Theater", "Dance", "Writing", "Photography", "Film", "Athletics", "Debate", "Public Speaking", "Coding", "Entrepreneurship"];
  const languageOptions = ["Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Arabic", "Italian", "Portuguese", "Russian", "Hindi", "Other"];
  const academicHonorOptions = ["National Honor Society", "Beta Club", "Mu Alpha Theta", "National Merit Scholar", "AP Scholar", "Honor Roll", "Dean's List", "Academic All-State"];

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div className="text-center mb-16 pt-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-8 bg-blue-900 text-white border-0 px-8 py-3 text-base font-medium">
            <Brain className="w-5 h-5 mr-2" />
            AI-Powered Matching
          </Badge>
          <h1 className="text-7xl md:text-8xl font-black mb-6">
            <span className="block text-gray-900 mb-4">AI Scholarship</span>
            <span className="block text-gray-900">Finder</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto">Get personalized recommendations using AI and database matching</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="text-center bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
              <div className={`text-4xl font-black ${stat.color} mb-3`}>
                <CountUp end={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-gray-700 text-base font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mb-12">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            {[1, 2, 3, 4, 5, 6, 7].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${step >= stepNumber ? 'bg-blue-900 text-white' : 'bg-white text-gray-500 border-2 border-gray-300'}`}>
                  {step > stepNumber ? <CheckCircle className="h-6 w-6" /> : stepNumber}
                </div>
                {stepNumber < 7 && <div className={`w-8 h-1 ${step > stepNumber ? 'bg-blue-900' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="text-lg text-gray-700 font-medium">
              Step {step} of 7: {step === 1 ? 'Academic' : step === 2 ? 'Personal' : step === 3 ? 'Financial' : step === 4 ? 'Activities' : step === 5 ? 'Career Goals' : step === 6 ? 'Additional' : 'Your Matches'}
            </span>
          </div>
        </div>

        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardContent className="p-8 md:p-12">
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Academic Information</h2>
                  <p className="text-gray-700 text-lg">Tell us about your academic achievements</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Current GPA (4.0 scale)</Label>
                    <Input type="number" step="0.01" min="0" max="4.0" placeholder="3.75" value={formData.gpa} onChange={(e) => handleInputChange('gpa', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" />
                  </div>
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">SAT Score (optional)</Label>
                    <Input type="number" min="400" max="1600" placeholder="1450" value={formData.satScore} onChange={(e) => handleInputChange('satScore', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" />
                  </div>
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">ACT Score (optional)</Label>
                    <Input type="number" min="1" max="36" placeholder="32" value={formData.actScore} onChange={(e) => handleInputChange('actScore', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" />
                  </div>
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Class Rank (if known)</Label>
                    <Input placeholder="Top 10%" value={formData.classRank} onChange={(e) => handleInputChange('classRank', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="block text-base font-medium text-gray-900 mb-2">Intended Major/Field of Study</Label>
                    <Input placeholder="Computer Science, Pre-Med, Business, etc." value={formData.major} onChange={(e) => handleInputChange('major', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" />
                  </div>
                </div>
                <div>
                  <Label className="block text-base font-medium text-gray-900 mb-3">Academic Honors (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {academicHonorOptions.map((honor) => (
                      <div key={honor} className="flex items-center space-x-2">
                        <Checkbox id={honor} checked={formData.academicHonors.includes(honor)} onCheckedChange={(checked) => handleArrayChange('academicHonors', honor, checked)} className="border-gray-300" />
                        <Label htmlFor={honor} className="text-sm text-gray-700 cursor-pointer">{honor}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Personal Background</h2>
                  <p className="text-gray-700 text-lg">Help us find scholarships that match your background</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Ethnicity/Race</Label>
                    <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
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
                    <Label className="block text-base font-medium text-gray-900 mb-2">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
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
                    <Label className="block text-base font-medium text-gray-900 mb-2">State of Residence</Label>
                    <Input placeholder="California" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">ZIP Code</Label>
                    <Input placeholder="90210" value={formData.zipCode} onChange={(e) => handleInputChange('zipCode', e.target.value)} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Citizenship Status</Label>
                    <Select value={formData.citizenship} onValueChange={(value) => handleInputChange('citizenship', value)}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
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
                  <Checkbox id="firstGeneration" checked={formData.firstGeneration} onCheckedChange={(checked) => handleInputChange('firstGeneration', checked)} className="border-gray-300" />
                  <Label htmlFor="firstGeneration" className="text-gray-700 cursor-pointer">
                    I am a first-generation college student (neither parent has a 4-year degree)
                  </Label>
                </div>

                <div>
                  <Label className="block text-base font-medium text-gray-900 mb-3">Languages Spoken (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languageOptions.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox id={language} checked={formData.languages.includes(language)} onCheckedChange={(checked) => handleArrayChange('languages', language, checked)} className="border-gray-300" />
                        <Label htmlFor={language} className="text-sm text-gray-700 cursor-pointer">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Financial Information</h2>
                  <p className="text-gray-700 text-lg">This helps us find need-based scholarships</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Annual Family Income Range</Label>
                    <Select value={formData.familyIncome} onValueChange={(value) => handleInputChange('familyIncome', value)}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
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
                  <Checkbox id="needBasedAid" checked={formData.needBasedAid} onCheckedChange={(checked) => handleInputChange('needBasedAid', checked)} className="border-gray-300" />
                  <Label htmlFor="needBasedAid" className="text-gray-700 cursor-pointer">I am interested in need-based financial aid</Label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Activities & Leadership</h2>
                  <p className="text-gray-700 text-lg">Showcase your extracurricular involvement and achievements</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Extracurricular Activities</Label>
                    <Textarea placeholder="List your clubs, sports, organizations, etc." value={formData.extracurriculars} onChange={(e) => handleInputChange('extracurriculars', e.target.value)} rows={3} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>
                  
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Leadership Roles</Label>
                    <Textarea placeholder="Describe any leadership positions you've held" value={formData.leadership} onChange={(e) => handleInputChange('leadership', e.target.value)} rows={3} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Community Service & Volunteer Work</Label>
                    <Textarea placeholder="Describe your volunteer experiences and community involvement" value={formData.communityService} onChange={(e) => handleInputChange('communityService', e.target.value)} rows={3} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Work Experience</Label>
                    <Textarea placeholder="List any part-time jobs, internships, or work experience" value={formData.workExperience} onChange={(e) => handleInputChange('workExperience', e.target.value)} rows={3} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Awards & Recognition</Label>
                    <Textarea placeholder="List any awards, honors, or special recognition you've received" value={formData.awards} onChange={(e) => handleInputChange('awards', e.target.value)} rows={3} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-3">Special Talents & Skills (select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {talentOptions.map((talent) => (
                        <div key={talent} className="flex items-center space-x-2">
                          <Checkbox id={talent} checked={formData.talents.includes(talent)} onCheckedChange={(checked) => handleArrayChange('talents', talent, checked)} className="border-gray-300" />
                          <Label htmlFor={talent} className="text-sm text-gray-700 cursor-pointer">{talent}</Label>
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Career Goals & Preferences</h2>
                  <p className="text-gray-700 text-lg">Tell us about your future plans and college preferences</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Career Goals & Aspirations</Label>
                    <Textarea placeholder="Describe your career goals and what you hope to achieve" value={formData.careerGoals} onChange={(e) => handleInputChange('careerGoals', e.target.value)} rows={4} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Preferred College Type</Label>
                    <Select value={formData.collegeType} onValueChange={(value) => handleInputChange('collegeType', value)}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-12">
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
                    <Checkbox id="studyAbroad" checked={formData.studyAbroad} onCheckedChange={(checked) => handleInputChange('studyAbroad', checked)} className="border-gray-300" />
                    <Label htmlFor="studyAbroad" className="text-gray-700 cursor-pointer">I am interested in study abroad opportunities</Label>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Additional Information</h2>
                  <p className="text-gray-700 text-lg">Share any unique circumstances or challenges</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Personal Challenges or Obstacles Overcome</Label>
                    <Textarea placeholder="Describe any significant challenges you've faced and overcome" value={formData.challenges} onChange={(e) => handleInputChange('challenges', e.target.value)} rows={4} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>

                  <div>
                    <Label className="block text-base font-medium text-gray-900 mb-2">Unique Circumstances or Background</Label>
                    <Textarea placeholder="Share anything unique about your background or circumstances" value={formData.uniqueCircumstances} onChange={(e) => handleInputChange('uniqueCircumstances', e.target.value)} rows={4} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Your Matches</h2>
                  <p className="text-gray-700 text-lg">Found {results.length} scholarships for you</p>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-700">AI is analyzing your profile...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {results.map((scholarship, index) => (
                      <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                        <Card className="border-l-4 border-l-blue-900">
                          <CardContent className="p-6">
                            <div className="flex justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{scholarship.name}</h3>
                                <p className="text-blue-900 font-medium mb-3">{scholarship.provider}</p>
                                <p className="text-gray-700 text-sm mb-4">{scholarship.description}</p>
                                <div className="flex items-center gap-3 text-sm mb-4">
                                  <Calendar className="h-4 w-4" />
                                  <span>Deadline: {scholarship.deadline}</span>
                                  <Badge className="bg-green-100 text-green-800">{Math.round(scholarship.match)}% Match</Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-black text-blue-900 mb-4">${scholarship.amount.toLocaleString()}</div>
                                <Button size="sm" className="bg-blue-900" asChild>
                                  <a href={scholarship.url} target="_blank" rel="noopener noreferrer">Apply</a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    
                    {results.length > 0 && (
                      <div className="text-center pt-8">
                        <Button className="bg-pink-600 hover:bg-pink-500 px-8 py-6 text-lg" onClick={saveMatches}>
                          <Heart className="mr-2 h-5 w-5" />
                          Save All to Dashboard
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between gap-4 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={handleBack} disabled={step === 1 || step === 7}>Back</Button>
              {step < 6 ? (
                <Button onClick={handleNext} className="bg-blue-900">
                  Next <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : step === 6 ? (
                <Button onClick={handleSubmit} className="bg-blue-900" disabled={loading}>
                  <Zap className="mr-2 h-5 w-5" />
                  Find Scholarships
                </Button>
              ) : (
                <Button onClick={() => { setStep(1); setResults([]); }} variant="outline">Start Over</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
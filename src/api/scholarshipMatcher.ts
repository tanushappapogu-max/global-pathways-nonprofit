import { supabase } from '@/integrations/supabase/client';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Intelligent scoring function
function scoreScholarship(scholarship: any, formData: any): number {
  let score = 0;

  // GPA matching (0-25 points)
  const gpa = parseFloat(formData.gpa);
  if (!isNaN(gpa)) {
    if (gpa >= 3.8) score += 25;
    else if (gpa >= 3.5) score += 20;
    else if (gpa >= 3.0) score += 15;
    else if (gpa >= 2.5) score += 10;
    else score += 5;
  }

  // Major matching (0-20 points)
  const major = formData.major.toLowerCase();
  const scholarshipDesc = (scholarship.description || '').toLowerCase();
  const scholarshipName = (scholarship.name || '').toLowerCase();
  const scholarshipCategory = (scholarship.category || '').toLowerCase();
  const scholarshipEligibility = (scholarship.eligibility || '').toLowerCase();
  
  if (major) {
    // Exact match
    if (scholarshipDesc.includes(major) || scholarshipName.includes(major) || 
        scholarshipCategory.includes(major) || scholarshipEligibility.includes(major)) {
      score += 20;
    } 
    // STEM matching
    else if (major.includes('engineering') || major.includes('science') || major.includes('math') || 
             major.includes('computer') || major.includes('technology') || major.includes('physics') ||
             major.includes('chemistry') || major.includes('biology')) {
      if (scholarshipDesc.includes('stem') || scholarshipDesc.includes('engineering') || 
          scholarshipDesc.includes('science') || scholarshipDesc.includes('technology') ||
          scholarshipCategory.includes('stem') || scholarshipEligibility.includes('stem')) {
        score += 18;
      }
    }
    // Business matching
    else if (major.includes('business') || major.includes('economics') || major.includes('finance')) {
      if (scholarshipDesc.includes('business') || scholarshipDesc.includes('economics') || 
          scholarshipDesc.includes('entrepreneurship') || scholarshipCategory.includes('business')) {
        score += 18;
      }
    }
    // Arts/Humanities matching
    else if (major.includes('art') || major.includes('music') || major.includes('literature') ||
             major.includes('english') || major.includes('history')) {
      if (scholarshipDesc.includes('art') || scholarshipDesc.includes('creative') || 
          scholarshipDesc.includes('humanities') || scholarshipCategory.includes('arts')) {
        score += 18;
      }
    }
    // Health/Medical matching
    else if (major.includes('nursing') || major.includes('medical') || major.includes('health')) {
      if (scholarshipDesc.includes('nursing') || scholarshipDesc.includes('medical') || 
          scholarshipDesc.includes('health') || scholarshipCategory.includes('health')) {
        score += 18;
      }
    }
  }

  // Financial need matching (0-15 points)
  if (formData.needBasedAid) {
    if (scholarshipDesc.includes('need') || scholarshipDesc.includes('financial aid') ||
        scholarshipName.includes('need') || scholarshipCategory.includes('need') ||
        scholarshipEligibility.includes('need')) {
      score += 15;
    }
  }

  // First generation matching (0-15 points)
  if (formData.firstGeneration) {
    if (scholarshipDesc.includes('first generation') || scholarshipDesc.includes('first-generation') ||
        scholarshipName.includes('first generation') || scholarshipName.includes('first-generation') ||
        scholarshipCategory.includes('first-gen') || scholarshipEligibility.includes('first generation')) {
      score += 15;
    }
  }

  // Gender matching (0-10 points)
  if (formData.gender && formData.gender !== 'prefer-not-to-say') {
    const genderTerm = formData.gender === 'female' ? 'women' : formData.gender === 'male' ? 'men' : formData.gender;
    if (scholarshipDesc.includes(genderTerm) || scholarshipName.includes(genderTerm) ||
        scholarshipEligibility.includes(genderTerm)) {
      score += 10;
    }
  }

  // Ethnicity/Diversity matching (0-12 points)
  if (formData.ethnicity && formData.ethnicity !== 'Prefer not to say') {
    const ethnicityLower = formData.ethnicity.toLowerCase();
    if (scholarshipDesc.includes(ethnicityLower) || scholarshipName.includes(ethnicityLower) ||
        scholarshipDesc.includes('minority') || scholarshipDesc.includes('diversity') ||
        scholarshipName.includes('diversity') || scholarshipCategory.includes('diversity') ||
        scholarshipEligibility.includes(ethnicityLower) || scholarshipEligibility.includes('minority')) {
      score += 12;
    }
  }

  // State/Location matching (0-8 points)
  if (formData.state) {
    const stateLower = formData.state.toLowerCase();
    if (scholarshipDesc.includes(stateLower) || scholarshipName.includes(stateLower) ||
        scholarshipEligibility.includes(stateLower)) {
      score += 8;
    }
  }

  // Academic honors bonus (0-5 points)
  if (formData.academicHonors && formData.academicHonors.length > 0) {
    if (scholarshipDesc.includes('merit') || scholarshipDesc.includes('academic') ||
        scholarshipName.includes('merit') || scholarshipCategory.includes('merit') ||
        scholarshipEligibility.includes('merit')) {
      score += 5;
    }
  }

  // Leadership/Service matching (0-5 points)
  if (formData.leadership || formData.communityService) {
    if (scholarshipDesc.includes('leadership') || scholarshipDesc.includes('community') ||
        scholarshipDesc.includes('service') || scholarshipDesc.includes('volunteer') ||
        scholarshipEligibility.includes('leadership')) {
      score += 5;
    }
  }

  return Math.min(score, 100); // Cap at 100
}

export async function matchScholarships(formData: any) {
  try {
    // First, fetch scholarships from your Supabase database
    console.log('Fetching scholarships from database...');
    const { data: dbScholarships, error } = await supabase
      .from('scholarships')
      .select('*')
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
    }

    console.log('Found scholarships in DB:', dbScholarships?.length || 0);

    // Score database scholarships
    const scoredDbScholarships = (dbScholarships || []).map(s => ({
      name: s.name,
      provider: s.provider,
      amount: Number(s.amount) || 0,
      deadline: s.deadline,
      description: s.description,
      match: scoreScholarship(s, formData),
      url: s.application_url || 'https://example.com',
      requirements: s.eligibility ? [s.eligibility] : ['See website for details']
    }));

    // Get top database matches
    const topDbMatches = scoredDbScholarships
      .filter(s => s.match >= 40)
      .sort((a, b) => b.match - a.match)
      .slice(0, 10);

    console.log('Top DB matches:', topDbMatches.length);

    // Check if OpenAI key exists
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'undefined') {
      console.warn('No valid OpenAI API key found, using database scholarships only');
      return topDbMatches.slice(0, 8);
    }

    // Build a more focused prompt
    const studentHighlights = [];
    if (formData.gpa && parseFloat(formData.gpa) >= 3.5) studentHighlights.push(`High GPA: ${formData.gpa}`);
    if (formData.major) studentHighlights.push(`Major: ${formData.major}`);
    if (formData.firstGeneration) studentHighlights.push('First-generation college student');
    if (formData.ethnicity && formData.ethnicity !== 'Prefer not to say') studentHighlights.push(`Ethnicity: ${formData.ethnicity}`);
    if (formData.state) studentHighlights.push(`State: ${formData.state}`);
    if (formData.needBasedAid) studentHighlights.push('Needs financial aid');
    if (formData.leadership) studentHighlights.push('Has leadership experience');
    
    const prompt = `Find 3 real scholarships for a student with these qualifications:
${studentHighlights.join('\n')}

Requirements:
- Must be real scholarships from legitimate organizations
- Must have 2025 deadlines
- Must match student qualifications
- Provide working application URLs

Return as JSON array (no markdown):
[
  {
    "name": "Scholarship Name",
    "provider": "Organization",
    "amount": 5000,
    "deadline": "2025-04-15",
    "description": "Brief description",
    "match": 85,
    "url": "https://application-url.com",
    "requirements": ["req1", "req2", "req3"]
  }
]`;

    console.log('Calling OpenAI API...');
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a scholarship search expert. Return valid JSON only. Focus on major national scholarships that are well-known and legitimate.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('ChatGPT raw response:', content);
    
    // Clean up the response
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }
    
    // Try to parse the JSON
    let aiScholarships = [];
    try {
      aiScholarships = JSON.parse(cleanContent);
      if (!Array.isArray(aiScholarships)) {
        aiScholarships = [];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      aiScholarships = [];
    }
    
    console.log('AI-matched scholarships:', aiScholarships.length);
    
    // If AI found scholarships, combine with DB results
    if (aiScholarships.length > 0) {
      // Combine AI results with top database results
      const allScholarships = [...aiScholarships, ...topDbMatches.slice(0, 5)];
      
      // Deduplicate by name
      const uniqueScholarships = Array.from(
        new Map(allScholarships.map(s => [s.name.toLowerCase(), s])).values()
      );
      
      // Sort by match percentage and return top 8
      return uniqueScholarships
        .sort((a, b) => b.match - a.match)
        .slice(0, 8);
    }
    
    // If AI returned nothing, just use database results
    console.log('AI returned no results, using database scholarships only');
    return topDbMatches.slice(0, 8);
    
  } catch (error) {
    console.error('Error in matchScholarships:', error);
    
    // Fallback to database scholarships with intelligent scoring
    console.log('Falling back to database-only matching');
    const { data: dbScholarships } = await supabase
      .from('scholarships')
      .select('*')
      .limit(100);
    
    if (!dbScholarships || dbScholarships.length === 0) {
      console.error('No scholarships in database');
      return [];
    }
    
    const scoredScholarships = dbScholarships.map(s => ({
      name: s.name,
      provider: s.provider,
      amount: Number(s.amount) || 0,
      deadline: s.deadline,
      description: s.description,
      match: scoreScholarship(s, formData),
      url: s.application_url || 'https://example.com',
      requirements: s.eligibility ? [s.eligibility] : ['See website for details']
    }));
    
    return scoredScholarships
      .filter(s => s.match >= 40)
      .sort((a, b) => b.match - a.match)
      .slice(0, 8);
  }
}
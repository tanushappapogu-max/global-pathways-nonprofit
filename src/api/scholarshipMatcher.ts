import { supabase } from '@/integrations/supabase/client';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Utility: check if text contains any of the given terms
function containsAny(text: string, terms: string[]): boolean {
  const t = text.toLowerCase();
  return terms.some(term => t.includes(term));
}

// STRICT eligibility filter - exclude scholarships that don't match
function isIneligible(scholarship: any, formData: any): boolean {
  const desc = (scholarship.description || '').toLowerCase();
  const name = (scholarship.name || '').toLowerCase();
  const category = (scholarship.category || '').toLowerCase();
  const eligibility = (scholarship.eligibility || '').toLowerCase();
  const allText = `${desc} ${name} ${category} ${eligibility}`;

  // ========== GENDER RESTRICTIONS ==========
  if (formData.gender === 'male') {
    // Exclude ANY scholarship with women/female/girls
    if (containsAny(allText, ['women', 'female', 'girls', 'woman', 'ladies'])) {
      console.log(`🚫 GENDER: Filtered out "${scholarship.name}" (women-only, user is male)`);
      return true;
    }
  }
  
  if (formData.gender === 'female') {
    // Exclude ANY scholarship with men/male/boys (unless also mentions women)
    if (containsAny(allText, ['men', 'male', 'boys', 'man']) && 
        !containsAny(allText, ['women', 'female'])) {
      console.log(`🚫 GENDER: Filtered out "${scholarship.name}" (men-only, user is female)`);
      return true;
    }
  }

  // ========== ETHNICITY RESTRICTIONS ==========
  if (formData.ethnicity && formData.ethnicity !== 'Prefer not to say') {
    const userEthnicity = formData.ethnicity.toLowerCase();
    
    // List of specific ethnicities
    const ethnicities = [
      'african american', 'black',
      'hispanic', 'latino', 'latina', 'latinx',
      'asian', 'pacific islander',
      'native american', 'indigenous',
      'middle eastern', 'arab'
    ];
    
    // Check if scholarship is for a DIFFERENT specific ethnicity
    for (const ethnicity of ethnicities) {
      // Skip if it's the user's ethnicity
      if (userEthnicity.includes(ethnicity) || ethnicity.includes(userEthnicity.split('/')[0])) {
        continue;
      }
      
      // If scholarship is for this different ethnicity specifically
      if ((allText.includes(`${ethnicity} only`) || 
           allText.includes(`for ${ethnicity}`) ||
           allText.includes(`${ethnicity} students only`) ||
           (name.includes(ethnicity) && !allText.includes('all ethnicities'))) &&
          allText.includes('only')) {
        console.log(`🚫 ETHNICITY: Filtered out "${scholarship.name}" (for ${ethnicity}, user is ${userEthnicity})`);
        return true;
      }
    }
    
    // Specific filters
    if (!userEthnicity.includes('hispanic') && !userEthnicity.includes('latino') && 
        (allText.includes('hispanic only') || allText.includes('latino only') || 
         allText.includes('latina only') || allText.includes('latinx only'))) {
      console.log(`🚫 ETHNICITY: Filtered out "${scholarship.name}" (Hispanic/Latino only, user is ${userEthnicity})`);
      return true;
    }
    
    if (!userEthnicity.includes('african') && !userEthnicity.includes('black') && 
        (allText.includes('african american only') || allText.includes('black only'))) {
      console.log(`🚫 ETHNICITY: Filtered out "${scholarship.name}" (African American/Black only, user is ${userEthnicity})`);
      return true;
    }
    
    if (!userEthnicity.includes('asian') && !userEthnicity.includes('pacific') && 
        (allText.includes('asian only') || allText.includes('asian american only'))) {
      console.log(`🚫 ETHNICITY: Filtered out "${scholarship.name}" (Asian only, user is ${userEthnicity})`);
      return true;
    }
  }

  // ========== MAJOR/FIELD RESTRICTIONS ==========
  if (formData.major) {
    const userMajor = formData.major.toLowerCase();
    
    // Determine user's field
    const isSTEM = userMajor.includes('engineering') || userMajor.includes('science') || 
                   userMajor.includes('math') || userMajor.includes('computer') || 
                   userMajor.includes('technology') || userMajor.includes('physics') ||
                   userMajor.includes('chemistry') || userMajor.includes('biology') ||
                   userMajor.includes('biomedical') || userMajor.includes('data');
    
    const isEngineering = userMajor.includes('engineering');
    const isBiomedical = userMajor.includes('biomedical') || userMajor.includes('bio');
    const isComputerScience = userMajor.includes('computer') || userMajor.includes('cs');
    const isBusiness = userMajor.includes('business') || userMajor.includes('economics');
    const isArts = userMajor.includes('art') || userMajor.includes('music') || userMajor.includes('theater');
    const isNursing = userMajor.includes('nursing') || userMajor.includes('health');
    
    // STRICT field restrictions
    
    // Exclude CS-only scholarships for non-CS majors
    if (!isComputerScience && (
        allText.includes('computer science only') || 
        allText.includes('computer science majors only') ||
        allText.includes('cs only') ||
        allText.includes('software engineering only') ||
        (name.includes('computer science') && allText.includes('only')) ||
        (name.includes('computing') && allText.includes('only')))) {
      console.log(`🚫 MAJOR: Filtered out "${scholarship.name}" (CS only, user major: ${userMajor})`);
      return true;
    }
    
    // Exclude engineering-only if not engineering
    if (!isEngineering && (
        allText.includes('engineering majors only') ||
        allText.includes('engineering students only') ||
        (name.includes('engineering') && allText.includes('only') && !allText.includes('stem')))) {
      console.log(`🚫 MAJOR: Filtered out "${scholarship.name}" (Engineering only, user major: ${userMajor})`);
      return true;
    }
    
    // Exclude business-only for non-business
    if (!isBusiness && (
        allText.includes('business majors only') || 
        allText.includes('business students only') ||
        allText.includes('mba only'))) {
      console.log(`🚫 MAJOR: Filtered out "${scholarship.name}" (Business only, user major: ${userMajor})`);
      return true;
    }
    
    // Exclude arts-only for non-arts
    if (!isArts && (
        allText.includes('arts majors only') || 
        allText.includes('music majors only') ||
        allText.includes('theater majors only') ||
        allText.includes('fine arts only'))) {
      console.log(`🚫 MAJOR: Filtered out "${scholarship.name}" (Arts only, user major: ${userMajor})`);
      return true;
    }
    
    // Exclude nursing-only for non-nursing
    if (!isNursing && (
        allText.includes('nursing majors only') || 
        allText.includes('nursing students only') ||
        allText.includes('rn students only'))) {
      console.log(`🚫 MAJOR: Filtered out "${scholarship.name}" (Nursing only, user major: ${userMajor})`);
      return true;
    }
    
    // Exclude non-STEM scholarships for STEM majors
    if (isSTEM && (
        allText.includes('non-stem only') || 
        allText.includes('humanities only') ||
        allText.includes('liberal arts only'))) {
      console.log(`🚫 MAJOR: Filtered out "${scholarship.name}" (Non-STEM only, user major: ${userMajor})`);
      return true;
    }
  }

  // ========== STATE RESTRICTIONS ==========
  if (formData.state) {
    const userState = formData.state.toLowerCase();
    
    // List of all US states
    const states = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 
                   'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 
                   'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 
                   'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 
                   'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 
                   'new hampshire', 'new jersey', 'new mexico', 'new york', 
                   'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 
                   'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 
                   'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 
                   'west virginia', 'wisconsin', 'wyoming'];
    
    // Check if scholarship is for a different specific state
    for (const state of states) {
      if (state === userState) continue;
      
      if ((allText.includes(`${state} residents only`) || 
           allText.includes(`${state} only`) ||
           allText.includes(`${state} students only`)) &&
          !allText.includes(userState)) {
        console.log(`🚫 STATE: Filtered out "${scholarship.name}" (${state} only, user is from ${userState})`);
        return true;
      }
    }
  }

  // ========== GPA RESTRICTIONS ==========
  if (formData.gpa) {
    const userGPA = parseFloat(formData.gpa);
    if (!isNaN(userGPA)) {
      // Check database field
      if (scholarship.min_gpa && userGPA < scholarship.min_gpa) {
        console.log(`🚫 GPA: Filtered out "${scholarship.name}" (requires ${scholarship.min_gpa}, user has ${userGPA})`);
        return true;
      }
      
      // Check text for GPA requirements
      if (allText.includes('3.5 minimum') && userGPA < 3.5) {
        console.log(`🚫 GPA: Filtered out "${scholarship.name}" (requires 3.5 minimum, user has ${userGPA})`);
        return true;
      }
      if (allText.includes('3.8 minimum') && userGPA < 3.8) {
        console.log(`🚫 GPA: Filtered out "${scholarship.name}" (requires 3.8 minimum, user has ${userGPA})`);
        return true;
      }
      if (allText.includes('4.0 required') && userGPA < 4.0) {
        console.log(`🚫 GPA: Filtered out "${scholarship.name}" (requires 4.0, user has ${userGPA})`);
        return true;
      }
    }
  }

  // ========== CITIZENSHIP RESTRICTIONS ==========
  if (formData.citizenship) {
    const citizen = formData.citizenship.toLowerCase();
    
    if ((allText.includes('us citizen only') || allText.includes('u.s. citizen only') || 
         allText.includes('citizenship required') || allText.includes('citizens only')) && 
        citizen !== 'us-citizen') {
      console.log(`🚫 CITIZENSHIP: Filtered out "${scholarship.name}" (US citizen only, user is ${citizen})`);
      return true;
    }
    
    if (allText.includes('international students only') && citizen === 'us-citizen') {
      console.log(`🚫 CITIZENSHIP: Filtered out "${scholarship.name}" (international only, user is US citizen)`);
      return true;
    }
  }

  return false; // Eligible
}

// Intelligent scoring function
function scoreScholarship(scholarship: any, formData: any): number {
  let score = 0;
  
  const desc = (scholarship.description || '').toLowerCase();
  const name = (scholarship.name || '').toLowerCase();
  const category = (scholarship.category || '').toLowerCase();
  const eligibility = (scholarship.eligibility || '').toLowerCase();
  const allText = `${desc} ${name} ${category} ${eligibility}`;

  // ========== GPA SCORING (0-30 points) ==========
  const gpa = parseFloat(formData.gpa);
  if (!isNaN(gpa)) {
    if (gpa >= 3.9) {
      score += 30;
      if (allText.includes('merit') || allText.includes('excellence') || allText.includes('academic')) {
        score += 5;
      }
    } else if (gpa >= 3.7) score += 25;
    else if (gpa >= 3.5) score += 20;
    else if (gpa >= 3.0) score += 15;
    else if (gpa >= 2.5) score += 10;
    else score += 5;
  }

  // ========== MAJOR SCORING (0-30 points) ==========
  const userMajor = formData.major.toLowerCase();
  if (userMajor) {
    // EXACT major match gets highest score
    if (allText.includes(userMajor)) {
      score += 30;
      console.log(`✅ EXACT MAJOR MATCH: "${scholarship.name}" contains "${userMajor}"`);
    }
    // Biomedical Engineering
    else if (userMajor.includes('biomedical') || (userMajor.includes('bio') && userMajor.includes('engineering'))) {
      if (allText.includes('biomedical') || allText.includes('bioengineering')) {
        score += 28;
      } else if (allText.includes('engineering') || allText.includes('stem')) {
        score += 22;
      } else if (allText.includes('biology') || allText.includes('medical')) {
        score += 18;
      }
    }
    // Computer Science
    else if (userMajor.includes('computer science') || userMajor.includes('computer') || userMajor.includes('cs')) {
      if (allText.includes('computer science') || allText.includes('cs') || allText.includes('computing')) {
        score += 28;
      } else if (allText.includes('software') || allText.includes('technology') || allText.includes('stem')) {
        score += 22;
      }
    }
    // Other Engineering
    else if (userMajor.includes('engineering')) {
      if (allText.includes('engineering')) {
        score += 28;
      } else if (allText.includes('stem') || allText.includes('technical')) {
        score += 22;
      }
    }
    // General STEM
    else if (userMajor.includes('science') || userMajor.includes('math') || userMajor.includes('physics') ||
             userMajor.includes('chemistry') || userMajor.includes('biology')) {
      if (allText.includes('stem') || allText.includes('science')) {
        score += 22;
      }
    }
    // Business
    else if (userMajor.includes('business') || userMajor.includes('economics') || userMajor.includes('finance')) {
      if (allText.includes('business') || allText.includes('economics') || allText.includes('finance')) {
        score += 28;
      }
    }
    // Arts/Humanities
    else if (userMajor.includes('art') || userMajor.includes('music') || userMajor.includes('literature')) {
      if (allText.includes('art') || allText.includes('creative') || allText.includes('humanities')) {
        score += 28;
      }
    }
    // Nursing/Health
    else if (userMajor.includes('nursing') || userMajor.includes('health')) {
      if (allText.includes('nursing') || allText.includes('health')) {
        score += 28;
      }
    }
  }

  // ========== ETHNICITY SCORING (0-20 points) ==========
  if (formData.ethnicity && formData.ethnicity !== 'Prefer not to say') {
    const userEthnicity = formData.ethnicity.toLowerCase();
    
    // EXACT ethnicity match
    if (userEthnicity.includes('asian') && allText.includes('asian')) {
      score += 20;
      console.log(`✅ ETHNICITY MATCH: "${scholarship.name}" for Asian students`);
    } else if (userEthnicity.includes('pacific') && allText.includes('pacific')) {
      score += 20;
    } else if (userEthnicity.includes('hispanic') && allText.includes('hispanic')) {
      score += 20;
    } else if (userEthnicity.includes('latino') && allText.includes('latino')) {
      score += 20;
    } else if (userEthnicity.includes('african') && allText.includes('african')) {
      score += 20;
    } else if (userEthnicity.includes('black') && allText.includes('black')) {
      score += 20;
    } else if (userEthnicity.includes('native') && allText.includes('native')) {
      score += 20;
    }
    // General diversity (much lower)
    else if (allText.includes('minority') || allText.includes('diversity') || allText.includes('underrepresented')) {
      score += 8;
    }
  }

  // ========== FINANCIAL NEED (0-15 points) ==========
  if (formData.needBasedAid) {
    if (allText.includes('need-based') || allText.includes('financial need') || allText.includes('low income')) {
      score += 15;
    }
  } else if (allText.includes('merit-based') || allText.includes('merit only')) {
    score += 5;
  }

  // ========== FIRST GENERATION (0-15 points) ==========
  if (formData.firstGeneration && (allText.includes('first generation') || allText.includes('first-generation'))) {
    score += 15;
  }

  // ========== STATE MATCH (0-10 points) ==========
  if (formData.state && allText.includes(formData.state.toLowerCase())) {
    score += 10;
  }

  // ========== LEADERSHIP (0-8 points) ==========
  if (formData.leadership && formData.leadership.trim().length > 10 && allText.includes('leadership')) {
    score += 8;
  }

  // ========== COMMUNITY SERVICE (0-7 points) ==========
  if (formData.communityService && formData.communityService.trim().length > 10 && 
      (allText.includes('community') || allText.includes('service') || allText.includes('volunteer'))) {
    score += 7;
  }

  // ========== ACADEMIC HONORS (0-5 points) ==========
  if (formData.academicHonors && formData.academicHonors.length > 0 && 
      (allText.includes('merit') || allText.includes('honor'))) {
    score += 5;
  }

  return Math.min(score, 100);
}

export async function matchScholarships(formData: any) {
  try {
    console.log('🔍 Starting scholarship matching...');
    console.log('📋 User Profile:', {
      major: formData.major,
      ethnicity: formData.ethnicity,
      gender: formData.gender,
      gpa: formData.gpa,
      state: formData.state
    });

    const { data: dbScholarships, error } = await supabase
      .from('scholarships')
      .select('*')
      .limit(200);

    if (error) console.error('❌ Supabase error:', error);
    console.log(`📚 Found ${dbScholarships?.length || 0} scholarships in database`);

    // FILTER OUT INELIGIBLE
    const eligibleScholarships = (dbScholarships || []).filter(s => !isIneligible(s, formData));
    console.log(`✅ ${eligibleScholarships.length} eligible after strict filtering`);

    // SCORE ELIGIBLE
    const scoredScholarships = eligibleScholarships.map(s => ({
      name: s.name,
      provider: s.provider,
      amount: Number(s.amount) || 0,
      deadline: s.deadline,
      description: s.description,
      match: scoreScholarship(s, formData),
      url: s.application_url || 'https://example.com',
      requirements: s.eligibility ? [s.eligibility] : ['See website for details']
    }));

    // GET TOP MATCHES (60% minimum)
    const topMatches = scoredScholarships
      .filter(s => s.match >= 60)
      .sort((a, b) => b.match - a.match)
      .slice(0, 12);

    console.log(`🎯 Top matches:`, topMatches.slice(0, 5).map(s => `${s.name} (${s.match}%)`));

    // Try OpenAI if key exists
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'undefined' || OPENAI_API_KEY.length < 20) {
      console.warn('⚠️ No OpenAI key, using database only');
      return topMatches.slice(0, 8);
    }

    // Build OpenAI prompt
    const profile = [];
    if (formData.major) profile.push(`Major: ${formData.major}`);
    if (formData.ethnicity && formData.ethnicity !== 'Prefer not to say') profile.push(`Ethnicity: ${formData.ethnicity}`);
    if (formData.gender && formData.gender !== 'prefer-not-to-say') profile.push(`Gender: ${formData.gender}`);
    if (formData.gpa) profile.push(`GPA: ${formData.gpa}`);
    if (formData.state) profile.push(`State: ${formData.state}`);
    if (formData.firstGeneration) profile.push('First-generation student');

    const prompt = `Find 3 real scholarships for: ${profile.join(', ')}

STRICT REQUIREMENTS:
- Must match student's EXACT ethnicity (not just "diversity")
- Must match student's EXACT major field
- Must match student's gender (no opposite gender scholarships)
- Must have 2025 deadlines
- Must be legitimate scholarships

Return JSON only:
[{"name":"","provider":"","amount":5000,"deadline":"2025-04-15","description":"","match":85,"url":"","requirements":[]}]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'Return valid JSON only. Match EXACT criteria.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) throw new Error('OpenAI error');

    const data = await response.json();
    let cleanContent = data.choices[0].message.content.trim()
      .replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let aiScholarships = [];
    try {
      aiScholarships = JSON.parse(cleanContent);
      if (!Array.isArray(aiScholarships)) aiScholarships = [];
    } catch (e) {
      aiScholarships = [];
    }

    if (aiScholarships.length > 0) {
      const combined = [...aiScholarships, ...topMatches.slice(0, 6)];
      const unique = Array.from(new Map(combined.map(s => [s.name.toLowerCase().trim(), s])).values());
      return unique.sort((a, b) => b.match - a.match).slice(0, 8);
    }

    return topMatches.slice(0, 8);
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    const { data: dbScholarships } = await supabase.from('scholarships').select('*').limit(200);
    if (!dbScholarships) return [];
    
    const eligible = dbScholarships.filter(s => !isIneligible(s, formData));
    const scored = eligible.map(s => ({
      name: s.name,
      provider: s.provider,
      amount: Number(s.amount) || 0,
      deadline: s.deadline,
      description: s.description,
      match: scoreScholarship(s, formData),
      url: s.application_url || 'https://example.com',
      requirements: s.eligibility ? [s.eligibility] : ['See website for details']
    }));
    
    return scored.filter(s => s.match >= 60).sort((a, b) => b.match - a.match).slice(0, 8);
  }
}
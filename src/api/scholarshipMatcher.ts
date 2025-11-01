import { supabase } from '@/integrations/supabase/client';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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

    // Check if OpenAI key exists
    if (!OPENAI_API_KEY) {
      console.warn('No OpenAI API key found, using database scholarships only');
      // Return just database scholarships with match scores
      return scoreScholarships(dbScholarships || [], formData);
    }

    // Prepare the prompt for ChatGPT
    const prompt = `You are a scholarship matching expert. Based on the following student profile, analyze and recommend scholarships.

Student Profile:
- GPA: ${formData.gpa}
- SAT: ${formData.satScore || 'N/A'}
- ACT: ${formData.actScore || 'N/A'}
- Major: ${formData.major}
- Ethnicity: ${formData.ethnicity}
- Gender: ${formData.gender}
- State: ${formData.state}
- First Generation: ${formData.firstGeneration}
- Family Income: ${formData.familyIncome}
- Academic Honors: ${formData.academicHonors.join(', ')}
- Extracurriculars: ${formData.extracurriculars}
- Leadership: ${formData.leadership}
- Community Service: ${formData.communityService}
- Career Goals: ${formData.careerGoals}
- Awards: ${formData.awards}
- Special Talents: ${formData.talents.join(', ')}
- Languages: ${formData.languages.join(', ')}

Available Scholarships from Database (${dbScholarships?.length || 0} total):
${dbScholarships?.slice(0, 20).map(s => `
- ${s.name} by ${s.provider}
  Amount: $${s.amount}
  Category: ${s.category}
  Eligibility: ${s.eligibility}
  Deadline: ${s.deadline}
  URL: ${s.application_url}
`).join('\n')}

Task:
1. From the database scholarships above, select the TOP 5 most relevant matches for this student
2. Search the web for 3 NEW real scholarships (not in the list above) that this student qualifies for
3. Calculate a match percentage (0-100) for each scholarship based on student profile

Return as JSON array with this EXACT format (no markdown, no code blocks, just pure JSON):
[
  {
    "name": "Exact scholarship name",
    "provider": "Organization name",
    "amount": 10000,
    "deadline": "2025-03-15",
    "description": "Clear description of what the scholarship is for",
    "match": 95,
    "url": "https://application-url.com",
    "requirements": ["specific requirement 1", "specific requirement 2", "specific requirement 3"]
  }
]

IMPORTANT: Return ONLY valid JSON array, nothing else.`;

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
            content: 'You are a scholarship matching expert. Always respond with valid JSON arrays only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('ChatGPT response:', content);
    
    // Clean up the response (remove markdown code blocks if present)
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }
    
    // Parse the JSON response
    const scholarships = JSON.parse(cleanContent);
    
    console.log('Matched scholarships:', scholarships.length);
    return scholarships;
    
  } catch (error) {
    console.error('Error in matchScholarships:', error);
    // Fallback to database scholarships with basic scoring
    const { data: dbScholarships } = await supabase
      .from('scholarships')
      .select('*')
      .limit(10);
    
    return scoreScholarships(dbScholarships || [], formData);
  }
}

// Fallback function to score database scholarships
function scoreScholarships(scholarships: any[], formData: any) {
  console.log('Using fallback scoring for', scholarships.length, 'scholarships');
  
  return scholarships.map(s => {
    let match = 70; // Base score
    
    // Increase match based on criteria
    if (formData.major && s.category?.toLowerCase().includes(formData.major.toLowerCase())) {
      match += 15;
    }
    if (formData.ethnicity && s.category?.toLowerCase().includes('diversity')) {
      match += 10;
    }
    if (formData.firstGeneration && s.category?.toLowerCase().includes('first')) {
      match += 15;
    }
    if (formData.gpa && parseFloat(formData.gpa) >= 3.5 && s.category?.toLowerCase().includes('merit')) {
      match += 10;
    }
    
    match = Math.min(match, 98); // Cap at 98
    
    return {
      name: s.name,
      provider: s.provider,
      amount: s.amount,
      deadline: s.deadline,
      description: s.description,
      match: match,
      url: s.application_url,
      requirements: s.eligibility ? [s.eligibility] : ['See website for details']
    };
  }).sort((a, b) => b.match - a.match).slice(0, 8);
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { studentProfile, scholarships } = await req.json()

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Prepare GPT prompt for scholarship matching
    const prompt = `
You are an expert scholarship advisor. Analyze the following student profile and scholarship database to provide personalized recommendations.

STUDENT PROFILE:
- GPA: ${studentProfile.gpa || 'Not provided'}
- SAT Score: ${studentProfile.sat || 'Not provided'}
- ACT Score: ${studentProfile.act || 'Not provided'}
- State: ${studentProfile.state || 'Not provided'}
- Major: ${studentProfile.intendedMajor || 'Not provided'}
- Family Income: ${studentProfile.familyIncome || 'Not provided'}
- First Generation: ${studentProfile.isFirstGeneration ? 'Yes' : 'No'}
- Low Income: ${studentProfile.isLowIncome ? 'Yes' : 'No'}
- International: ${studentProfile.isInternational ? 'Yes' : 'No'}
- Minority: ${studentProfile.isMinority ? 'Yes' : 'No'}
- Women: ${studentProfile.isWomen ? 'Yes' : 'No'}

AVAILABLE SCHOLARSHIPS:
${JSON.stringify(scholarships.slice(0, 50), null, 2)}

INSTRUCTIONS:
1. Analyze each scholarship's eligibility criteria against the student profile
2. Calculate a match score (0-100) for each scholarship based on:
   - Academic requirements (GPA, test scores)
   - Demographic fit
   - Geographic eligibility
   - Major alignment
   - Financial need criteria
3. Rank scholarships by match score
4. Return the top 15 scholarships with detailed explanations

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "scholarship_id",
    "scholarship_name": "name",
    "provider_organization": "organization",
    "amount_min": number,
    "amount_max": number,
    "match_score": number,
    "match_reasons": ["reason1", "reason2", "reason3"],
    "application_deadline": "date",
    "website_url": "url",
    "priority_level": "high|medium|low"
  }
]

Focus on scholarships with match scores above 60. Prioritize scholarships that:
- Match academic credentials
- Align with demographic characteristics
- Have upcoming but not expired deadlines
- Offer substantial financial aid
`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert scholarship advisor. Always return valid JSON arrays only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiResult = await openaiResponse.json()
    const gptContent = openaiResult.choices[0].message.content

    // Parse GPT response
    let recommendations
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedContent = gptContent.replace(/```json\n?|\n?```/g, '').trim()
      recommendations = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('Failed to parse GPT response:', gptContent)
      throw new Error('Invalid GPT response format')
    }

    // Validate and enhance recommendations
    const enhancedRecommendations = recommendations.map((rec: any) => ({
      ...rec,
      ai_recommended: true,
      recommendation_date: new Date().toISOString(),
      match_score: Math.min(100, Math.max(0, rec.match_score || 0))
    }))

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: enhancedRecommendations,
        total_analyzed: scholarships.length,
        ai_powered: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in scholarship recommendation:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        ai_powered: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
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
      console.error('OpenAI API key not found')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured',
          fallback: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Processing scholarship recommendations for profile:', {
      gpa: studentProfile.gpa,
      state: studentProfile.state,
      major: studentProfile.intendedMajor,
      scholarshipCount: scholarships.length
    })

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
- Additional Info: ${studentProfile.additionalInfo || 'None'}

AVAILABLE SCHOLARSHIPS (showing first 20):
${JSON.stringify(scholarships.slice(0, 20), null, 2)}

INSTRUCTIONS:
1. Analyze each scholarship's eligibility criteria against the student profile
2. Calculate a match score (0-100) for each scholarship based on:
   - Academic requirements (GPA, test scores)
   - Demographic fit
   - Geographic eligibility
   - Major alignment
   - Financial need criteria
3. Rank scholarships by match score
4. Return the top 10 scholarships with detailed explanations

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
    "priority_level": "high"
  }
]

Focus on scholarships with match scores above 50. Prioritize scholarships that:
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert scholarship advisor. Always return valid JSON arrays only. Be precise and helpful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', openaiResponse.status, errorText)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiResult = await openaiResponse.json()
    const gptContent = openaiResult.choices[0].message.content

    console.log('GPT Response received:', gptContent.substring(0, 200) + '...')

    // Parse GPT response
    let recommendations
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedContent = gptContent.replace(/```json\n?|\n?```/g, '').trim()
      recommendations = JSON.parse(cleanedContent)
      
      if (!Array.isArray(recommendations)) {
        throw new Error('Response is not an array')
      }
    } catch (parseError) {
      console.error('Failed to parse GPT response:', gptContent)
      console.error('Parse error:', parseError)
      
      // Fallback: return basic matching without AI
      const fallbackRecommendations = scholarships.slice(0, 10).map((scholarship: any) => ({
        id: scholarship.id,
        scholarship_name: scholarship.scholarship_name,
        provider_organization: scholarship.provider_organization,
        amount_min: scholarship.amount_min,
        amount_max: scholarship.amount_max,
        match_score: 75,
        match_reasons: ['Basic profile match', 'Available for your region'],
        application_deadline: scholarship.application_deadline,
        website_url: scholarship.website_url,
        priority_level: 'medium'
      }))
      
      return new Response(
        JSON.stringify({
          success: true,
          recommendations: fallbackRecommendations,
          total_analyzed: scholarships.length,
          ai_powered: false,
          fallback_used: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Validate and enhance recommendations
    const enhancedRecommendations = recommendations.map((rec: any) => ({
      ...rec,
      ai_recommended: true,
      recommendation_date: new Date().toISOString(),
      match_score: Math.min(100, Math.max(0, rec.match_score || 0))
    }))

    console.log('Returning', enhancedRecommendations.length, 'recommendations')

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
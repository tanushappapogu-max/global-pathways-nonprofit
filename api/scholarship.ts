import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for server-side access
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // 1️⃣ Fetch existing scholarships from Supabase
    const { data: supabaseScholarships, error } = await supabase
      .from('scholarships')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // 2️⃣ Ask ChatGPT for additional real 2025–2026 scholarships
    const prompt = `Based on this student profile, recommend 8–12 REAL scholarships available in 2025–2026:
- GPA: ${formData.gpa}
- State: ${formData.state}
- Major: ${formData.major}
- Ethnicity: ${formData.ethnicity}
- First Generation: ${formData.firstGeneration ? 'Yes' : 'No'}
- Income: ${formData.income}

Return ONLY valid JSON in this format:
{
  "scholarships": [
    {
      "name": "Scholarship Name",
      "provider": "Organization",
      "amount": 5000,
      "deadline": "2025-MM-DD",
      "match": 85,
      "description": "Description",
      "requirements": ["Requirement"],
      "url": "https://example.com"
    }
  ]
}`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // More reliable and cheaper than 3.5
        messages: [
          { role: 'system', content: 'You are a scholarship advisor. Return only valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;
    let aiScholarships: any[] = [];

    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiScholarships = parsed.scholarships || [];
      }
    }

    // 3️⃣ Combine Supabase + AI results
    const allScholarships = [
      ...(supabaseScholarships || []),
      ...aiScholarships,
    ];

    // 4️⃣ Return combined list
    return res.status(200).json({ scholarships: allScholarships });
  } catch (error) {
    console.error('Error in /api/scholarships:', error);
    return res.status(500).json({ error: 'Failed to load scholarships' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `Based on this student profile, recommend 8-12 REAL scholarships available in 2025-2026:
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

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a scholarship advisor. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ scholarships: parsed.scholarships || [] });
      }
    }
    
    return res.status(200).json({ scholarships: [] });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return res.status(500).json({ error: 'Failed to generate scholarships' });
  }
}
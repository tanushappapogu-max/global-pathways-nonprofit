export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;
  const openaiKey = process.env.OPENAI_API_KEY;
  const serperKey = process.env.SERPER_API_KEY;

  if (!openaiKey || !serperKey) {
    return res.status(500).json({ error: 'API keys not configured' });
  }

  try {
    // Step 1: Search the web for real scholarships
    const searchQuery = `scholarships ${formData.major} ${formData.state} ${formData.ethnicity} first generation 2025 2026`;
    
    console.log('Searching for:', searchQuery);
    
    const searchResponse = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: searchQuery,
        num: 20, // Get 20 results
      }),
    });

    const searchData = await searchResponse.json();
    console.log('Search results received:', searchData.organic?.length || 0, 'results');

    if (!searchData.organic || searchData.organic.length === 0) {
      return res.status(200).json({ scholarships: [] });
    }

    // Step 2: Send search results to ChatGPT for analysis and matching
    const searchResults = searchData.organic.slice(0, 15).map(result => ({
      title: result.title,
      url: result.link,
      description: result.snippet,
    }));

    const prompt = `You are a scholarship advisor. Analyze these real scholarship search results and match them to this student profile:

Student Profile:
- GPA: ${formData.gpa}
- State: ${formData.state}
- Major: ${formData.major}
- Ethnicity: ${formData.ethnicity}
- First Generation: ${formData.firstGeneration ? 'Yes' : 'No'}
- Income: ${formData.income}

Search Results:
${JSON.stringify(searchResults, null, 2)}

Return 8-12 best-matched scholarships in ONLY valid JSON format:
{
  "scholarships": [
    {
      "name": "Extract from title",
      "provider": "Infer organization name",
      "amount": 5000,
      "deadline": "2025-MM-DD (estimate based on context, use realistic dates)",
      "match": 85,
      "description": "Brief description from snippet",
      "requirements": ["Key requirements"],
      "url": "actual URL from search results"
    }
  ]
}

IMPORTANT:
- Use ACTUAL URLs from search results
- Only include scholarships that match the student profile
- Estimate realistic deadlines (most scholarships have deadlines between Jan-May)
- Calculate match score based on student fit`;

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are a scholarship matching expert. Return only valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const chatData = await chatResponse.json();
    console.log('ChatGPT analysis complete');

    if (chatData.error) {
      console.error('OpenAI error:', chatData.error);
      return res.status(500).json({ error: chatData.error.message });
    }

    const content = chatData.choices?.[0]?.message?.content;
    
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Returning', parsed.scholarships?.length || 0, 'scholarships');
        return res.status(200).json({ scholarships: parsed.scholarships || [] });
      }
    }
    
    return res.status(200).json({ scholarships: [] });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate scholarships',
      details: error.message 
    });
  }
}
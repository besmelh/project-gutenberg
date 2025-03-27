const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.handler = async (event) => {
  try {
    const { bookMetadata } = JSON.parse(event.body);

    const prompt = `
  Analyze the following book and return:
  1. summary: A short 1-paragraph plot summary.
  2. characters: The main characters.
  3. language: The language it is written in.
  4. sentiment: Overall sentiment (positive, neutral, or negative).
  5. genre: Book genre.
  
  If you dont have enough context about the book return "Not enough context on the book, contact support."
  
  Book title:  ${bookMetadata?.Title || 'Untitled'},
  Author:  ${bookMetadata?.Author || 'Author'}

  `;

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192', // or "llama3-70b-8192" if enabled
      messages: [
        {
          role: 'system',
          content: `
            You are a literary assistant that ONLY returns a valid JSON object.
            DO NOT use markdown.
            DO NOT include explanations or intros.
            Return exactly this structure:
            {
              "summary": "...",
              "characters": "...",
              "language": "...",
              "sentiment": "...",
              "genre": "..."
            }
            No extra text. No trailing commas.
            `,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;
    console.log('Raw model response:', completion.choices[0].message.content);

    // Remove markdown formatting (just in case)
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned
        .replace(/^```(json)?/, '')
        .replace(/```$/, '')
        .trim();
    }

    // Remove trailing commas from objects/arrays
    cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    let analysisData = cleaned;
    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'object' && parsed.summary) {
        analysisData = parsed;
      }
    } catch {
      // fallback to plain string
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: analysisData }),
    };
  } catch (err) {
    console.error('Groq error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze book.' }),
    };
  }
};

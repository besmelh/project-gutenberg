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
            You are a literary assistant that returns ONLY raw JSON. 
            Use your existing knowldeg base to fetch the info about the book.
            NEVER include explanations, introductions, or markdown.
            Return a plain JSON object with this exact structure:
            {
              "summary": string,
              "characters": string,
              "language": string,
              "sentiment": string,
              "genre": string
              }
            Do not include trailing commas or any other text. The output MUST be valid JSON.
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

    // Remove markdown backticks if they exist
    if (content.startsWith('```')) {
      content = content
        .replace(/^```(json)?/, '')
        .replace(/```$/, '')
        .trim();
    }

    // Remove trailing commas inside objects
    // content = content.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    // Try to parse the cleaned response
    let analysisJson;

    try {
      analysisJson = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse analysis JSON:', content);
      analysisJson = { error: 'Invalid JSON format returned by model.' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: analysisJson }),
    };
  } catch (err) {
    console.error('Groq error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze book.' }),
    };
  }
};

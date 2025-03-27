const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function objToStr(obj) {
  const str = Object.entries(obj)
    .map(
      ([key, val]) =>
        `${key[0].toUpperCase() + key.slice(1)}: ${
          Array.isArray(val) ? val.join(', ') : val
        }`
    )
    .join('\n');

  console.log('stringified obj:', str);
  return str;
}

exports.handler = async (event) => {
  try {
    const { bookMetadata } = JSON.parse(event.body);

    const prompt = `
  Analyze the following book and return:
  **Summary:** A short 1-paragraph plot summary.

  **Characters:** The main characters of the book.

  **Language:** The language it is written in.

  **Sentiment:** Overall sentiment (positive, neutral, or negative).
  
  **Genre:** Book genre.
  
  If you dont have enough context about the book return "Not enough context on the book, contact support."
  
  Book Info:
  ${objToStr(bookMetadata)}
  `;

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192', // or "llama3-70b-8192" if enabled
      messages: [
        {
          role: 'system',
          content:
            'You are a literary assistant that analyzes classic books. Dont give any intro or outro messages to your response. just give me what i asked for. Use your existing knowldege base to infer details about the book.',
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

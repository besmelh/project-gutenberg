const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.handler = async (event) => {
  try {
    const { bookTitleAndAuthor } = JSON.parse(event.body);

    const prompt = `
  Analyze the following book and return:
  1. summary: A short 1-paragraph plot summary.
  2. characters: The main characters.
  3. language: The language it is written in.
  4. sentiment: Overall sentiment (positive, neutral, or negative).
  5. genre: Book genre.
  
  If you dont have enough context about the book return "Not enough context on the book, contact support."
  
  Book:
  ${bookTitleAndAuthor}
  `;

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192', // or "llama3-70b-8192" if enabled
      messages: [
        {
          role: 'system',
          content:
            'You are a literary assistant that analyzes classic books. Dont give any intro or outro messages to your response. just give me what i asked for. Return info in json format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: completion.choices[0].message.content }),
    };
  } catch (err) {
    console.error('Groq error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze book.' }),
    };
  }
};

const groq = require('groq-sdk');
const client = new groq.Groq({ apiKey: process.env.GROQ_API_KEY });

function chunkText(text, maxWords = 1500) {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(' '));
  }

  return chunks;
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { bookText, bookMetadata } = body;

    const chunks = chunkText(bookText);
    const summaries = [];

    for (const chunk of chunks) {
      const res = await client.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: `Summarize this part of the book:\n\n${chunk}`,
          },
        ],
      });

      summaries.push(res.choices[0].message.content);
    }

    const finalRes = await client.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: `These are summaries of different parts of the book titled "${
            bookMetadata?.Title || 'Untitled'
          }" by "${
            bookMetadata?.Author || 'Unknown'
          }". Combine them into one clear and complete summary:\n\n${summaries.join(
            '\n\n'
          )}`,
        },
      ],
    });

    const finalSummary = finalRes.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: finalSummary }),
    };
  } catch (err) {
    console.error('Analysis error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Something went wrong.' }),
    };
  }
};

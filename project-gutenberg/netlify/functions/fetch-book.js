const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { id } = event.queryStringParameters;
  const contentUrl = `https://www.gutenberg.org/files/${id}/${id}-0.txt`;

  try {
    const response = await fetch(contentUrl);
    if (!response.ok) {
      return {
        statusCode: 404,
        body: 'Book not found',
      };
    }

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error fetching book',
    };
  }
};

const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

exports.handler = async (event) => {
  const { id } = event.queryStringParameters;
  const url = `https://www.gutenberg.org/ebooks/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: 404,
        body: 'Metadata page not found',
      };
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // const title = doc.querySelector('h1')?.textContent?.trim() || 'Unknown';
    // const author =
    //   doc.querySelector('.header_author')?.textContent?.trim() || 'Unknown';
    const tableItems = doc.querySelectorAll('.bibrec tr');

    const meta = {};

    tableItems.forEach((row) => {
      const key = row.querySelector('th')?.textContent?.trim();
      const val = row.querySelector('td')?.textContent?.trim();
      if (key && val) meta[key] = val;
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...meta }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error fetching metadata',
    };
  }
};

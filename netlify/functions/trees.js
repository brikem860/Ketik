const { NetlifyDB } = require('@netlify/db');

exports.handler = async (event) => {
  const db = new NetlifyDB('trees');

  if (event.httpMethod === 'POST') {
    const { name, description, images } = JSON.parse(event.body);
    const tree = await db.insert({ name, description, images });
    return {
      statusCode: 201,
      body: JSON.stringify(tree),
    };
  } else if (event.httpMethod === 'GET') {
    const trees = await db.select('*');
    return {
      statusCode: 200,
      body: JSON.stringify(trees),
    };
  }
};
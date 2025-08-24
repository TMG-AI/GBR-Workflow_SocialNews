export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the entire request body (multipart form data) to n8n
    const response = await fetch('https://swheatman.app.n8n.cloud/webhook/media_tracker1', {
      method: 'POST',
      headers: {
        // Forward the original content-type (multipart/form-data)
        'Content-Type': req.headers['content-type'] || 'application/octet-stream',
      },
      body: req.body, // Forward raw body, don't JSON.stringify
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Webhook proxy error:', error);
    res.status(500).json({ error: 'Webhook request failed' });
  }
}

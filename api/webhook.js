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
    // For multipart form data, we need to reconstruct it
    const contentType = req.headers['content-type'];
    let body;
    let headers = {};

    if (contentType && contentType.includes('multipart/form-data')) {
      // Vercel parses multipart data into req.body object
      // We need to convert it back to FormData for n8n
      const formData = new FormData();
      
      // Add all fields from the parsed body
      for (const [key, value] of Object.entries(req.body || {})) {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
      
      body = formData;
      // Don't set Content-Type header, let fetch set it with boundary
    } else {
      // For JSON data
      body = JSON.stringify(req.body);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch('https://swheatman.app.n8n.cloud/webhook/media_tracker1', {
      method: 'POST',
      headers: headers,
      body: body,
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Webhook proxy error:', error);
    res.status(500).json({ error: 'Webhook request failed: ' + error.message });
  }
}

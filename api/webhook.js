import { Writable } from 'stream';

// Helper to parse multipart form data
async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  console.log('🚀 Webhook received - Method:', req.method);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, n8n-webhook-url');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📤 Forwarding multipart form data to n8n...');

    const n8nWebhookUrl = 'https://swheatman.app.n8n.cloud/webhook/media_tracker1';
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Invalid content type. Expected multipart/form-data.' });
    }

    const bodyBuffer = await parseMultipart(req);

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: bodyBuffer,
    });

    console.log('📊 n8n response status:', response.status);
    const responseText = await response.text();
    console.log('📝 n8n response:', responseText);

    return res.status(response.status).send(responseText);

  } catch (error) {
    console.error('💥 Error details:', error);
    return res.status(500).json({
      error: 'Webhook failed',
      message: error.message,
      stack: error.stack,
    });
  }
}



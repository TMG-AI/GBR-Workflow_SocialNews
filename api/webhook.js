export default async function handler(req, res) {
  console.log('🚀 Simple test - Method:', req.method);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📤 Forwarding simple JSON to n8n...');
    
    const response = await fetch('https://swheatman.app.n8n.cloud/webhook/media_tracker1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: 'simple test',
        googleAlertsRss: 'https://example.com/test',
        sheetUrl: 'https://docs.google.com/test'
      }),
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
      stack: error.stack
    });
  }
}

import Busboy from 'busboy';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
    maxDuration: 60,
  },
};

export default async function handler(req, res) {
  console.log('🚀 Media Tracker API called - Method:', req.method);
  
  // Add CORS headers
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
    const busboy = Busboy({ 
      headers: req.headers,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
      }
    });
    
    const formFields = {};
    const files = {};

    // Handle form fields
    busboy.on('field', (fieldname, value) => {
      console.log('📝 Field:', fieldname, '=', value);
      formFields[fieldname] = value;
    });

    // Handle file uploads
    busboy.on('file', (fieldname, file, info) => {
      console.log('📄 File detected:', fieldname, info.filename);
      
      const chunks = [];
      
      file.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      file.on('end', () => {
        files[fieldname] = {
          buffer: Buffer.concat(chunks),
          filename: info.filename,
          mimeType: info.mimeType
        };
        console.log('✅ File collected:', fieldname, files[fieldname].buffer.length, 'bytes');
      });
    });

    // Wait for busboy to finish
    const uploadPromise = new Promise((resolve, reject) => {
      busboy.on('finish', resolve);
      busboy.on('error', reject);
      setTimeout(() => reject(new Error('Upload timeout')), 30000);
    });

    req.pipe(busboy);
    await uploadPromise;

    console.log('📦 Creating FormData for n8n...');
    
    // Create form data to send to n8n
    const formData = new FormData();
    
    // Add form fields
    for (const [key, value] of Object.entries(formFields)) {
      formData.append(key, value);
    }
    
    // Add files
    for (const [fieldname, fileData] of Object.entries(files)) {
      formData.append(fieldname, fileData.buffer, {
        filename: fileData.filename,
        contentType: fileData.mimeType
      });
    }

    console.log('🌐 Sending to n8n webhook...');

    const response = await fetch('https://swheatman.app.n8n.cloud/webhook/media_tracker1', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    console.log('📊 n8n response:', response.status, response.statusText);

    const responseText = await response.text();
    
    res.status(response.status).send(responseText);

  } catch (error) {
    console.error('💥 Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}

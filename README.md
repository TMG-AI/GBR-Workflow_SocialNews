# Media Tracker Web Form

A web form interface for triggering n8n media tracking workflows. This form allows users to monitor media mentions across Twitter/X, Google Alerts RSS feeds, and Meltwater CSV uploads.

## Features

- 📊 **Multi-Source Tracking**: Monitor Twitter/X, Google News, and Meltwater
- 📁 **CSV Upload**: Drag-and-drop support for Meltwater CSV files
- 🔄 **Base64 Encoding**: Automatic file encoding for n8n processing
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Feedback**: Loading states and success/error messages

## Setup Instructions

### 1. Fork or Clone this Repository

```bash
git clone https://github.com/yourusername/media-tracker.git
cd media-tracker
```

### 2. Deploy to Vercel

#### Option A: Deploy with Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Option B: Deploy via GitHub
1. Push this code to your GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

### 3. Configuration

The webhook URL is already configured to: `https://swheatman.app.n8n.cloud/webhook/media-tracker`

If you need to change it, edit line 237 in `index.html`:
```javascript
const WEBHOOK_URL = 'your-n8n-webhook-url-here';
```

## Usage

1. **Google Alerts RSS Feed**: 
   - Go to [Google Alerts](https://www.google.com/alerts)
   - Create an alert for your keywords
   - Choose "RSS feed" as delivery method
   - Copy the RSS URL into the form

2. **Twitter/X Search Terms**:
   - Enter search terms using Twitter's search syntax
   - Example: `Coinbase AND (JPM OR "JP Morgan")`

3. **Meltwater CSV**:
   - Export your data from Meltwater as CSV
   - Drag and drop or click to upload
   - File is automatically encoded to base64

4. **Google Sheets URL**:
   - Create a Google Sheet for storing results
   - Share it with your n8n service account
   - Copy the sheet URL into the form

## File Structure

```
/
├── index.html          # Main web form
├── vercel.json        # Vercel configuration
├── package.json       # Node.js dependencies (optional)
├── README.md          # Documentation
└── .gitignore        # Git ignore file
```

## Data Flow

1. User fills form and uploads CSV (optional)
2. Form converts CSV to base64
3. Data sent to n8n webhook
4. n8n processes data from multiple sources
5. Results stored in Google Sheets

## Security Headers

The application includes security headers configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Environment Variables

No environment variables needed - webhook URL is hardcoded for simplicity.

## Support

For issues with:
- **Web form**: Check browser console for errors
- **n8n workflow**: Check n8n execution logs
- **Vercel deployment**: Check Vercel dashboard logs

## License

MIT

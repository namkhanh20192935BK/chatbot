# Chatbot Serverless Backend

This is a serverless version of the chatbot backend that can be deployed to Vercel.

## Features

- Serverless API endpoints for chat functionality
- Integration with OpenAI GPT-4
- Chat history storage with Supabase
- CORS enabled for frontend integration

## API Endpoints

### POST /api/chat
Send a message to the chatbot and get a response.

**Request Body:**
```json
{
  "userId": "user123",
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?"
}
```

### GET /api/history
Get chat history for a specific user.

**Query Parameters:**
- `userId`: The user ID to fetch history for

**Response:**
```json
{
  "history": [
    {
      "conversation_id": "user123",
      "mesages": [{"user": "Hello", "ai": "Hi there!"}],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Environment Variables

You need to set up the following environment variables in Vercel:

1. `OPENAI_API_KEY` - Your OpenAI API key
2. `SUPABASE_URL` - Your Supabase project URL
3. `SUPABASE_KEY` - Your Supabase service role key

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Make sure you have a Vercel account and are logged in:
```bash
vercel login
```

### Deployment Steps

1. **Set up environment variables in Vercel:**
```bash
vercel env add OPENAI_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
```

2. **Deploy to Vercel:**
```bash
vercel --prod
```

3. **For development (optional):**
```bash
vercel dev
```

### Alternative: Deploy via Vercel Dashboard

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add environment variables in the Vercel dashboard
5. Deploy

## Local Development

To run the serverless functions locally:

```bash
npm install
vercel dev
```

This will start a local development server that mimics the Vercel environment.

## File Structure

```
├── api/
│   ├── chat.js          # POST /api/chat endpoint
│   └── history.js       # GET /api/history endpoint
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Notes

- The serverless functions have a maximum execution time of 30 seconds for chat and 10 seconds for history
- CORS is enabled for all origins (`*`) - you may want to restrict this in production
- The OpenAI model is set to `gpt-4o-mini` - you can change this in the code if needed
- Chat history is stored in Supabase with the structure: `{conversation_id, mesages, created_at}` 
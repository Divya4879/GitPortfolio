<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pTBLVH4pH0U7u-vZ2GvBihG1sH4ey9Xg

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Cloud Run

**Prerequisites:** Google Cloud CLI, Docker

1. Set your Google Cloud project:
   ```bash
   export GOOGLE_CLOUD_PROJECT=your-project-id
   export GEMINI_API_KEY=your-gemini-api-key
   ```

2. Deploy using the script:
   ```bash
   ./deploy.sh
   ```

Or manually:
```bash
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/github-portfolio-analyzer
gcloud run deploy github-portfolio-analyzer \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/github-portfolio-analyzer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=$GEMINI_API_KEY
```
# GitPortfolio

#!/bin/bash

# Set project ID
PROJECT_ID="crafty-biplane-471507-b1"

# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/$PROJECT_ID/github-portfolio-analyzer

gcloud run deploy github-portfolio-analyzer \
  --image gcr.io/$PROJECT_ID/github-portfolio-analyzer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=$GEMINI_API_KEY

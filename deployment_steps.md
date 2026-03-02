# Deploy to Cloud Run

It seems that there is an issue with your Google Cloud authentication. Please ensure you are properly authenticated by following the instructions here: https://cloud.google.com/sdk/docs/authorizing

Once you are authenticated, you can deploy the application to Cloud Run by running the following command in your terminal:

```bash
gcloud run deploy assetvol --image gcr.io/pr-tftest/assetvol:latest --region us-central1 --platform managed --port 3000 --allow-unauthenticated
```

Artifact Registry / Project: pr-tftest / Location: us-central1 / Repository: asset-vol-repo
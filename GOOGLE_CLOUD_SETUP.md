# Google Cloud Setup for Vertex AI (Imagen-4)

## Prerequisites
- Google Cloud Project with billing enabled
- `gcloud` CLI installed
- Service account with Vertex AI permissions

## Step 1: Set Environment Variables

Create a `.env.local` file in the project root:

```bash
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_CLOUD_REGION=us-central1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 2: Authenticate with Google Cloud

### Option A: Using Application Default Credentials (ADC) - Recommended for Development

```bash
# Login with your Google account
gcloud auth application-default login

# This creates credentials at: ~/.config/gcloud/application_default_credentials.json
# The SDK will automatically use these credentials
```

### Option B: Using Service Account Key - Recommended for Production

1. Create a service account:
```bash
gcloud iam service-accounts create vertex-ai-service \
  --display-name="Vertex AI Service Account"
```

2. Grant permissions:
```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:vertex-ai-service@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/aiplatform.admin
```

3. Create and download key:
```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=vertex-ai-service@PROJECT_ID.iam.gserviceaccount.com
```

4. Set environment variable:
```bash
# On Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\key.json"

# On macOS/Linux
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
```

## Step 3: Enable Required APIs

```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Enable Cloud Storage API (for Imagen)
gcloud services enable storage.googleapis.com

# Enable IAM API
gcloud services enable iam.googleapis.com
```

## Step 4: Verify Setup

```bash
# Check if credentials are working
gcloud auth application-default print-access-token

# Verify project is set
gcloud config get-value project
```

## Troubleshooting

### Error: "GOOGLE_CLOUD_PROJECT_ID environment variable is required"
- Ensure `.env.local` has `GOOGLE_CLOUD_PROJECT_ID=your-project-id`
- Restart Next.js dev server after changing `.env.local`

### Error: "Failed to initialize Vertex AI"
- Verify Google Cloud credentials are properly configured
- Check that APIs are enabled in GCP console
- Ensure service account has `roles/aiplatform.admin` permission

### Error: "Permission denied" from Imagen-4
- Verify Vertex AI API is enabled
- Check service account has `roles/aiplatform.admin` role
- Wait 5 minutes for IAM permissions to propagate

### Error: "Quota exceeded"
- Imagen-4 has usage limits
- Check GCP Console > Quotas for rate limits
- Request quota increase if needed

## Testing the Integration

1. Start dev server:
```bash
npm run dev
```

2. Navigate to http://localhost:3000
3. Login or sign up
4. Go to Editor page
5. Enter "apple.com" to extract brand
6. Try generating image with prompt "coffee"
7. Check browser console for detailed logs

## Useful Commands

```bash
# View current project
gcloud config get-value project

# List service accounts
gcloud iam service-accounts list

# View current credentials
gcloud auth list

# View enabled APIs
gcloud services list --enabled
```

## Documentation References
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Imagen API](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials)
- [Google Cloud Node.js SDK](https://cloud.google.com/nodejs/docs/reference/vertexai/latest)

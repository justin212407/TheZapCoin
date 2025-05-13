# Deployment Guide for Zapcoin

This guide explains how to deploy the Zapcoin project to Netlify.

## Prerequisites

- A GitHub account
- A Netlify account
- Node.js >= 18.x installed locally

## Deployment Steps

### 1. Build the Project Locally (Optional)

Before deploying, you can build the project locally to ensure everything works:

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

The build output will be in the `dist` directory.

### 2. Deploy to Netlify

#### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "Add new site" > "Import an existing project"
3. Connect to your GitHub repository
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```

4. Follow the prompts to configure your site
5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

### 3. Environment Variables

The following environment variables are configured in the `netlify.toml` file:

- `VITE_SOLANA_NETWORK`: Set to "testnet" for the Solana testnet
- `VITE_PROGRAM_ID`: The Solana program ID

If you need to add more environment variables, you can do so in the Netlify UI under Site settings > Build & deploy > Environment.

### 4. Continuous Deployment

Netlify automatically sets up continuous deployment from your GitHub repository. Any changes pushed to the main branch will trigger a new build and deployment.

## Troubleshooting

### Build Failures

If your build fails, check the build logs in the Netlify UI for errors. Common issues include:

- Missing dependencies
- TypeScript errors
- Environment variable issues

### Routing Issues

If you encounter routing issues (404 errors when navigating to routes), ensure the `netlify.toml` file includes the redirect rule for SPA routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Solana Connection Issues

If the application can't connect to Solana:

1. Check that the `VITE_SOLANA_NETWORK` environment variable is set correctly
2. Ensure the `VITE_PROGRAM_ID` matches your deployed program
3. Verify that the Solana program is deployed to the correct network

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Solana Documentation](https://docs.solana.com/)

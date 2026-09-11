# setup.ps1 — Run this once to configure the .env file
$envContent = @"
IBM_API_KEY=N_ebGKP5FihX6RdzPomwb4_dsiJzJwp-O2Wc0tl1gfjj
IBM_PROJECT_ID=cba9e4f9-6ef7-4edc-b85a-d3e43144a81a
IBM_MODEL_ID=ibm/granite-4-h-small
IBM_API_URL=https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29
IBM_IAM_URL=https://iam.cloud.ibm.com/identity/token
PORT=3000
"@

Set-Content -Path ".env" -Value $envContent
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host "   Run 'npm install' then 'npm start' to launch Fitness Buddy." -ForegroundColor Cyan

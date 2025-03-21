# Cloudflare Bandwidth Monitor 🚀

This Cloudflare Worker monitors network bandwidth using the GraphQL API and sends alerts via a webhook when usage exceeds a predefined threshold.

## Features
✅ Fetches network analytics from Cloudflare's `magicTransitNetworkAnalyticsAdaptiveGroups` dataset.  
✅ Supports configurable monitoring periods and thresholds.  
✅ Sends alerts via a webhook when bandwidth exceeds the limit.  
✅ Runs as a scheduled cron job every minute.

---
## 📌 Setup Instructions

### 1️⃣ Prerequisites
- **Cloudflare Account** with **Workers** enabled.
- **Node.js & NPM** installed.
- **Cloudflare Wrangler CLI** installed:
  ```sh
  npm install -g wrangler
  ```
- **GitHub CLI (optional)** installed:
  ```sh
  gh auth login
  ```

### 2️⃣ Clone This Repository
```sh
 git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
 cd YOUR_REPO_NAME
```

### 3️⃣ Configure `wrangler.toml`
Create `wrangler.toml` and set your Cloudflare **Account ID** and **Webhook URL**:
```toml
compatibility_date = "2025-03-21"
main = "src/index.ts"
name = "monitor"
account_id = "YOUR_ACCOUNT_ID"

[vars]
WEBHOOK_URL = "YOUR_WEBHOOK_URL"
BANDWIDTH_THRESHOLD_BITS = "10" # Mbps
PERIOD = "1" # Measurement period in minutes
ACCOUNT_ID = "YOUR_ACCOUNT_ID"

[triggers]
crons = ["* * * * *"]
```

### 4️⃣ Deploy the Worker 🚀
```sh
wrangler deploy
```

### 5️⃣ View Logs (Optional)
```sh
wrangler tail
```

---
## 📜 License
This project is open-source under the [MIT License](LICENSE).


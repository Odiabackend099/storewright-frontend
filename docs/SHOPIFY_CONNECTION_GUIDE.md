# How to Connect Your Shopify Store to Storewright

**A simple, step-by-step guide for merchants**

---

## What You'll Need

1. **Your Shopify Store URL** — This is your store's address on Shopify
2. **An Admin API Access Token** — A secret key that lets Storewright build your store

**Time required:** About 5 minutes

---

## Part 1: Find Your Shopify Store URL

Your store URL is the address customers use to visit your shop.

### If you haven't added a custom domain yet:

Your store URL is: **`yourstorename.myshopify.com`**

**Example:** If your store is called "Cozy Blankets", your URL might be `cozy-blankets.myshopify.com`

### How to find it:

1. Log into your Shopify admin
2. Look at the URL in your browser's address bar
3. It will look like: `https://yourstorename.myshopify.com/admin`
4. Your store URL is everything **before** `/admin`

**Copy this down — you'll need it for Storewright.**

---

## Part 2: Create a Custom App & Get Your Access Token

Shopify calls this a "custom app" — it's a private connection just for your store.

### Step 1: Open Apps Settings

1. From your Shopify admin, click **Settings** (bottom left corner)
2. Click **Apps and sales channels**
3. Click **Develop apps** (near the top)

### Step 2: Create a New App

1. Click **Create an app**
2. Name it: **Storewright** (so you remember what it's for)
3. Click **Create app**

### Step 3: Configure API Permissions

Now you need to give Storewright permission to build your store:

1. Click **Configuration** (in the left sidebar)
2. Click **Configure** under **Admin API integration**
3. In the **Access scopes** section, select these permissions:

**Required permissions (tick these boxes):**

| Permission | What it lets Storewright do |
|---|---|
| `read_products` | See your products |
| `write_products` | Create new products |
| `read_product_listings` | View product listings |
| `write_product_listings` | Create product listings |
| `read_collections` | See your collections |
| `write_collections` | Create collections |
| `read_content` | Read pages and blogs |
| `write_content` | Create pages and blogs |
| `read_themes` | View your theme |
| `write_themes` | Modify your theme |
| `read_files` | Access your files |
| `write_files` | Upload images and files |
| `read_orders` | View orders (for analytics) |
| `read_fulfillments` | Track shipments |

4. Click **Save**

### Step 4: Install the App

1. Click **Install app** (top right)
2. Shopify will show you the permissions summary
3. Click **Install**

### Step 5: Copy Your Access Token

**This is the most important step — don't skip it!**

1. After installation, you'll see **Admin API access token**
2. It starts with `shpat_` (this is how you know it's correct)
3. Click **Reveal token** or copy it
4. **Copy this token immediately** — you won't see it again!

**Example token format:** `shpat_abc123def456ghi789jkl012mno345pqr678`

⚠️ **Important:** Treat this token like a password. Never share it publicly or put it in emails.

---

## Part 3: Connect to Storewright

Now bring everything together:

1. Go to **Storewright Dashboard**
2. Click **Connect Shopify** in the sidebar
3. Paste your **Store URL** (e.g., `cozy-blankets.myshopify.com`)
4. Paste your **Access Token** (starts with `shpat_`)
5. Click **Connect**

Storewright will verify your connection and you'll see "Shopify Connected" ✓

---

## Quick Reference

| What you need | Where to find it |
|---|---|
| Store URL | Shopify admin URL, or Settings → Domains |
| Access Token | Settings → Apps → Develop apps → [Your app] → API credentials |

---

## Troubleshooting

### "Invalid access token"
- Make sure you copied the entire token (it's long!)
- Check it starts with `shpat_`
- If you lost it, you'll need to uninstall the app and create a new one

### "Store not found"
- Use your `.myshopify.com` URL, not a custom domain
- Remove `https://` and `/admin` from the URL
- Just use: `yourstore.myshopify.com`

### "Permission denied"
- Go back to the app configuration
- Make sure ALL the permissions listed above are checked
- Save and reinstall the app

---

## Security Notes

✓ Your token is stored encrypted in Storewright
✓ We never share it with third parties
✓ You can revoke access anytime by uninstalling the app in Shopify
✓ Tokens are specific to one store — never use the same token for multiple stores

---

## Need Help?

If you get stuck:
1. Take a screenshot of the error
2. Email: support@storewright.odia.dev
3. We'll help you finish setup

---

*Last updated: April 2026 — Based on official Shopify documentation*
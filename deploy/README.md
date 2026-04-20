# NomerTop Production Deployment Guide

This guide describes how to deploy the NomerTop Next.js frontend and Python FastAPI backend on a single VPS (like Ubuntu/Debian) using Nginx and PM2.

## Prerequisites
1. **Node.js**: `v18` or `v20`
2. **Python**: `v3.10+`
3. **Nginx**: Installed via `sudo apt install nginx`
4. **PM2**: Installed globally via `npm install -g pm2`

## 1. Prepare Backend (FastAPI)
Navigate to the `backend` folder and set up the production environment.
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Prepare Frontend (Next.js)
Build the Next.js application in the root directory.
```bash
cd ..
npm install
npm run build
```

## 3. Configure the Process Manager (PM2)
We've provided a `deploy/ecosystem.config.js` file to run both services.
*Note: Make sure to edit the `script` path for python in `ecosystem.config.js` if you are on Linux to use `venv/bin/python` instead of `venv/Scripts/python.exe`.*

Start both apps:
```bash
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup
```

## 4. Setup Nginx Reverse Proxy
We've provided a production-ready Nginx configuration in `deploy/nginx.conf`.
Copy this file to your Nginx sites-available directory.

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/nomertop
```

Edit the file to ensure your `server_name` matches your actual domain:
```bash
sudo nano /etc/nginx/sites-available/nomertop
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/nomertop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. Enable SSL/HTTPS (Certbot)
For a production app, HTTPS is required (especially for NextAuth).
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---
**Done!** Your App should now be running at `https://yourdomain.com`. PM2 will ensure process persistence, and Nginx will handle routing API requests internally.

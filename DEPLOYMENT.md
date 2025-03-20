# E-Commerce Application Deployment Guide

This guide will help you deploy your e-commerce application to Render.com for free.

## Prerequisites

1. A GitHub account
2. A Render.com account (sign up at https://render.com)
3. A hosted MySQL database (see options below)

## Database Setup

You need a hosted MySQL database. Here are some free options:

### Option 1: PlanetScale (Recommended)
1. Sign up at https://planetscale.com
2. Create a new database called `ecommerce_db`
3. Create a new password and save the connection details
4. Connect to your database using the MySQL CLI or a tool like MySQL Workbench
5. Run the SQL commands from `setup_database.sql` to create tables and initial data

### Option 2: Clever Cloud
1. Sign up at https://www.clever-cloud.com
2. Create a new MySQL add-on
3. Save your connection credentials
4. Run the SQL commands from `setup_database.sql`

## Deployment Steps

### 1. Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Deploy on Render.com
1. Sign in to Render.com
2. Click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` configuration
5. Add your database credentials as environment variables:
   - DB_HOST
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
   - DB_PORT
6. Click "Apply"

Render will deploy both your backend API and frontend application!

Your website will be available at:
- Backend API: https://ecommerce-api.onrender.com
- Frontend: https://ecommerce-frontend.onrender.com

## Troubleshooting

1. **Database Connection Issues**: Ensure your database credentials are correct and the database is accessible from external IPs
2. **Build Failures**: Check the build logs on Render.com for errors
3. **Static Assets Not Loading**: Make sure all URLs in your frontend code use relative paths or the correct production URLs 
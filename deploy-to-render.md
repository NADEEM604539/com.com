# Direct Deployment to Render.com

Follow these steps to deploy your e-commerce application directly to Render.com without using GitHub.

## 1. Set up an account on Render.com
- Go to [Render.com](https://render.com) and sign up for a free account

## 2. Set up a free MySQL database
- PlanetScale is recommended: [PlanetScale](https://planetscale.com)
- Create a database named `ecommerce_db`
- Save your database credentials (host, username, password, database name)
- Run the SQL commands from `setup_database.sql` to create tables and initial data

## 3. Deploy your Backend API
- On Render dashboard, click "New" → "Web Service"
- Choose "Deploy from Zip file" option (bottom of page)
- Compress your project files into a ZIP file (excluding node_modules)
- Upload the ZIP file
- Set the following:
  - Name: ecommerce-api
  - Environment: Node
  - Build Command: `npm install`
  - Start Command: `node server.js`
- Add Environment Variables:
  - NODE_ENV: production
  - PORT: 10000
  - DB_HOST: (your database host)
  - DB_USER: (your database username)
  - DB_PASSWORD: (your database password)
  - DB_NAME: ecommerce_db
  - DB_PORT: 3306
  - JWT_SECRET: (generate a random string or use the Render UI to auto-generate)
  - JWT_EXPIRE: 30d
  - FILE_UPLOAD_LIMIT: 5
- Click "Create Web Service"

## 4. Deploy your Frontend
- On Render dashboard, click "New" → "Static Site"
- Choose "Deploy from Zip file" option
- Create a ZIP file of your frontend folder
- Upload the ZIP file
- Set the following:
  - Name: ecommerce-frontend
  - Build Command: `npm install && npm run build`
  - Publish Directory: `build`
- Add Environment Variables:
  - REACT_APP_API_URL: (the URL of your backend API from step 3)
- Click "Create Static Site"

## 5. Your website will be available at the following URLs:
- Backend API: https://ecommerce-api.onrender.com
- Frontend: https://ecommerce-frontend.onrender.com

## Troubleshooting

1. **Upload file size limit**: If your ZIP file is too large, you might need to remove any unnecessary files or dependencies before zipping
2. **Database Connection Issues**: Make sure your database allows external connections from Render IP addresses
3. **Frontend not connecting to Backend**: Check that your REACT_APP_API_URL points to the correct backend URL 
# Megaflix - Deploy to Vercel

## Deploy Steps

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import this repository
   - Framework preset: Other
   - Root directory: `.` (leave default)

2. **Environment Variables**:
   Add these environment variables in Vercel dashboard:
   ```
   FOR4PAYMENTS_API_KEY=your_for4payments_key
   UTMIFY_API_TOKEN=your_utmify_token
   OPENAI_API_KEY=your_openai_key
   ```

3. **Build Settings**:
   - Build command: `npm run build`
   - Output directory: `dist/public`
   - Install command: `npm install`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy

## Build Output Structure
```
dist/
├── index.js          # Server bundle (Express API)
└── public/           # Static frontend files
    ├── index.html    # Main HTML file
    └── assets/       # CSS, JS, images
```

## API Routes
- All `/api/*` routes are handled by `dist/index.js`
- Frontend routes serve `dist/public/index.html`
- Static assets served from `dist/public/assets/`

## Post-Deploy
1. Test payment system with 4ForPayments
2. Verify chat functionality  
3. Test download page access
4. Check all device compatibility

## Production Features
- ✅ PIX and Credit Card payments
- ✅ Interactive AI chat support
- ✅ Download page after payment
- ✅ Responsive design
- ✅ YouTube video integration
- ✅ Complete FAQ system (400+ responses)
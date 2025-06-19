# 🏰 The Castle Tap Menu CMS

A dynamic beer tap menu management system built with Next.js, designed for The Castle bar to manage and display up to 20 beers across two TV screens.

## Features

- 📱 **Admin Dashboard** - Password-protected interface for managing beers
- 📺 **TV Displays** - Two responsive screens showing taps 1-10 and 11-20
- ⚡ **Live Updates** - Auto-refresh every 30 seconds
- 🌙 **Dark/Light Mode** - Theme toggle for displays
- 🖼️ **Beer Logos** - Circular logo support with fallback
- 🏷️ **Tags & Status** - NEW, LIMITED tags and keg empty states
- 📱 **Mobile Responsive** - Works on all device sizes
- 🔗 **Embeddable** - iframe support for Wix integration

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: Simple cookie-based auth
- **Styling**: TailwindCSS + Shadcn/ui components
- **Deployment**: Railway ready

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd castle-tap-menu
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="castle123"
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### Admin Dashboard (`/admin`)

1. **Login**: Use credentials from `.env.local`
2. **Add Beer**: Fill out the form with beer details
3. **Edit/Delete**: Manage existing beers from the list
4. **Status Toggle**: Mark beers as "On Tap" or "Keg Empty"
5. **View Displays**: Quick links to see live displays

### Display Screens

- **Display 1** (`/display/1`): Shows taps 1-10
- **Display 2** (`/display/2`): Shows taps 11-20

### Embedding in Wix

```html
<iframe 
  src="https://your-domain.com/display/1" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

## Beer Schema

Each beer includes:

```json
{
  "tapNumber": 1,
  "name": "Pale Ale",
  "brewery": "Hopscor Brewing",
  "abv": "4.5%",
  "style": "Pale Ale",
  "price": "0.3L €4 / 0.5L €5.50",
  "logo": "https://example.com/logo.png",
  "status": "on_tap",
  "tags": ["NEW"],
  "startDate": "2025-01-20T14:00:00Z",
  "endDate": null
}
```

## Deployment

### Railway Deployment

1. **Connect Repository**: Link your Git repository to Railway
2. **Environment Variables**: Set in Railway dashboard:
   ```
   DATABASE_URL=file:./data/prod.db
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-secure-password
   ```
3. **Deploy**: Railway will automatically build and deploy

### Custom Domain Setup

In Railway:
1. Go to your service settings
2. Add custom domain
3. Update DNS records as instructed

## API Endpoints

- `GET /api/beers` - Fetch all beers
- `POST /api/beers` - Create new beer
- `PUT /api/beers` - Update existing beer
- `DELETE /api/beers?id={id}` - Delete beer
- `POST /api/auth/login` - Admin login
- `DELETE /api/auth/login` - Admin logout
- `GET /api/auth/check` - Check auth status

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## Customization

### Styling

- Update `app/globals.css` for global styles
- Modify TailwindCSS classes in components
- Customize color scheme in `tailwind.config.js`

### Branding

- Replace castle emoji (🏰) with your logo
- Update colors in CSS variables
- Modify header text in components

### Authentication

Current setup uses simple username/password. For production:
1. Use stronger passwords
2. Consider implementing NextAuth.js
3. Add rate limiting for login attempts

## Security Notes

⚠️ **Important for Production**:

1. **Change default credentials** in `.env.local`
2. **Use HTTPS** in production
3. **Regular backups** of SQLite database
4. **Update dependencies** regularly

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with details
3. Include error logs and environment info

## License

This project is proprietary software for The Castle bar.

---

Built with ❤️ for The Castle 🏰 
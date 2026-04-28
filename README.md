# CA Firm Website

A professional, modern website for a Chartered Accountants firm built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

- **Responsive Design**: Fully responsive layout that works seamlessly on mobile, tablet, and desktop devices
- **Modern UI**: Clean, professional design with smooth animations and transitions
- **Smooth Scrolling**: Navigation with smooth scroll behavior between sections
- **Interactive Components**: Hover effects, animations, and interactive elements
- **Contact Form**: Functional contact form with validation
- **Admin Sign In + Blog Posting**: Sign in as admin and publish blog posts (stored online via Supabase)
- **Professional Sections**:
  - Hero section with call-to-action
  - About section with firm information
  - Services showcase with 6 key services
  - Contact section with form and contact details
  - Footer with quick links and social media

## Tech Stack

- **React**: Modern component-based UI library
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready animation library
- **React Hook Form**: Performant form validation
- **React Scroll**: Smooth scrolling navigation
- **Lucide React**: Beautiful SVG icons
- **Supabase**: Authentication + hosted database for blog posts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd ca-firm-website
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
ca-firm-website/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── Contact.tsx
│   │   ├── ContactForm.tsx
│   │   └── Footer.tsx
│   ├── data/           # Data files
│   │   └── services.ts
│   ├── utils/          # Utility functions
│   │   └── validation.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── styles.css      # Global styles
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Colors

The color scheme is defined using Tailwind v4 theme tokens in `src/styles.css`.

### Content

Update the following files to customize content:
- `src/data/services.ts` - Service offerings
- `src/components/About.tsx` - Firm information
- `src/components/Blog.tsx` - Default (seed) blog cards shown on the homepage
- `src/components/Contact.tsx` - Contact details
- `src/components/Footer.tsx` - Footer content

### Admin login + Blog storage

Blog publishing uses Supabase Authentication and a Supabase database. Setup instructions (SQL + env vars) are in `SUPABASE_SETUP.md`.

### Logo

The logo used in the navbar/about header is `public/jaimanco-logo.png`.

### Fonts

The website uses Google Fonts (Poppins and Inter). These are imported in `src/styles.css`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved.

## Contact

For questions or support, please contact jaimanandco@gmail.com

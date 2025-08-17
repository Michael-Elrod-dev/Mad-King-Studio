# Mad King Studio - Game Development Website

A modern, responsive website for an indie game studio built with Next.js 14, TypeScript, and Tailwind CSS. Features live streaming integration, community engagement, and transparent development blogging.

## Features

- **Floating Navigation** - Smooth, auto-hiding navigation that adapts to scroll
- **Hero Landing** - Dramatic full-screen hero with game artwork
- **Live Streaming Integration** - Real-time Twitch stream status and schedule
- **Community Hub** - Discord, GitHub, and social media integration
- **Development Blog** - Regular development updates and progress logs
- **Responsive Design** - Optimized for all devices and screen sizes
- **Dark Theme** - Gaming-focused dark aesthetic
- **Open Source Ready** - Built for transparent development

## Project Structure

```
mad-king-studio/
├── src/
│   ├── app/
│   │   ├── globals.css              # Global styles and CSS variables
│   │   ├── layout.tsx               # Root layout with fonts and metadata
│   │   ├── page.tsx                 # Landing page with hero section
│   │   ├── game/
│   │   │   └── page.tsx             # Current game showcase
│   │   ├── devlog/
│   │   │   ├── page.tsx             # Blog listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Individual blog posts
│   │   ├── community/
│   │   │   └── page.tsx             # Community hub and streaming
│   │   ├── about/
│   │   │   └── page.tsx             # Developer story and philosophy
│   │   └── contact/
│   │       └── page.tsx             # Contact form and information
│   ├── components/
│   │   ├── layout/
│   │   │   ├── FloatingNav.tsx      # Main navigation component
│   │   │   └── SocialLinks.tsx      # Social media links with live status
│   │   ├── HeroSection.tsx          # Landing page hero component
│   │   ├── devlog/
│   │   │   ├── DevlogCard.tsx       # Individual blog post card
│   │   │   └── DevlogList.tsx       # Blog posts listing
│   │   └── community/
│   │       └── LiveStatus.tsx       # Twitch live streaming status
│   ├── lib/                         # Utility functions (future)
│   └── content/                     # Blog content (future)
├── public/
│   ├── hero-placeholder.jpg         # Hero background image
│   └── [other-assets]               # Icons, images, etc.
├── tailwind.config.ts               # Tailwind CSS configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

# Mad King Studio - Game Development Website

A Next.js-based website for showcasing indie game development, featuring live
Twitch integration, development blogs, and comprehensive documentation.

## Features

- **Games Showcase**: Display current projects with media galleries and detailed information
- **Development Blog**: Paginated dev logs and patch notes fetched from GitHub
- **Live Documentation**: Real-time docs from GitHub with Obsidian-style wiki links and Dataview query support
- **Twitch Integration**: Live stream status with automatic updates
- **Community Hub**: Links to Discord, Twitch, and social media
- **Contact Form**: Email integration via EmailJS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Markdown**: ReactMarkdown with GFM support
- **Data Fetching**: S3-cached content from GitHub
- **Email**: EmailJS
- **Live Streaming**: Twitch API

## Project Structure

```txt
mad-king-studio/
├── app/              # Next.js app directory
│   ├── about/        # About page
│   ├── api/          # API routes (Twitch, docs, blog, contact)
│   ├── blog/         # Blog listing page
│   ├── community/    # Community hub
│   ├── contact/      # Contact form
│   ├── docs/         # Documentation with sidebar
│   └── games/        # Games showcase
├── components/       # React components
│   ├── blog/         # Blog cards and lists
│   ├── community/    # Live status components
│   ├── docs/         # Documentation UI (sidebar, breadcrumbs, dataview)
│   ├── games/        # Game showcase components
│   ├── layout/       # Navigation and social links
│   └── shared/       # Reusable components (media carousel)
├── contexts/         # React contexts (LiveStatus, Docs, Tasks)
├── lib/              # Utilities and data
│   ├── api/          # External API integrations (Twitch, EmailJS)
│   ├── data/         # Static data and constants
│   ├── middleware/   # Rate limiting
│   ├── parsers/      # Content parsers (markdown, dataview, docs)
│   └── utils/        # Helper functions
└── public/           # Static assets
```

## Key Features

### S3 Cache System

Content is cached in S3 for performance:

- `cache/docs-tree.json` - Documentation structure
- `cache/docs/{slug}.json` - Individual doc content
- `cache/tasks.json` - Dataview tasks
- `cache/blogs/pages/{gameId}/{filter}/page-{n}.json` - Paginated blog metadata
- `cache/blogs/{blogId}.json` - Full blog content

### Dataview Query Support

Documentation supports Obsidian Dataview queries:

```dataview
TASK
FROM #game-development
WHERE !completed
SORT priority DESC
```

### Rate Limiting

Built-in rate limiting per route:

- Contact form: 3 requests per 15 minutes
- Doc content: 60 requests per minute
- Other APIs: 10 requests per minute

## Configuration

Key settings in `lib/data/constants.ts`:

- Social media links
- API endpoints
- Polling intervals
- Rate limits
- UI configuration

## License

MIT

## Author

Michael Elrod - Mad King Studio

# CRM Blog - Sanity.io + Next.js

A production-ready CRM/B2B blog built with Next.js 14, TypeScript, TailwindCSS, and Sanity.io v3.

## Features

- **Sanity.io CMS**: Full content management with Sanity Studio
- **SEO Optimized**: Automatic metadata generation, structured data, Open Graph
- **Internal Linking**: Automated internal linking system for topical authority
- **Modern Design**: Inspired by HubSpot, Ahrefs, Moz, Canva Learn
- **Type-Safe**: Full TypeScript support
- **Responsive**: Mobile-first design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity.io account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Sanity project credentials:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open Sanity Studio:
```bash
npm run sanity
```

Visit `http://localhost:3000` for the blog and `http://localhost:3000/studio` for Sanity Studio.

## Project Structure

```
blog/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utilities and helpers
│   ├── sanity/            # Sanity data fetching
│   ├── seo/               # SEO utilities
│   └── internalLinks/     # Internal linking system
├── sanity/                # Sanity configuration
│   ├── schemas/           # Content schemas
│   └── lib/               # Sanity client setup
└── content-automation/    # Content generation scripts
```

## Content Models

- **Post**: Blog posts with rich content
- **Author**: Author profiles
- **Category**: Post categories
- **Tag**: Post tags
- **SEO**: SEO metadata
- **Settings**: Site-wide settings

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run sanity` - Start Sanity Studio
- `npm run internal-links` - Generate internal links for all posts

## Internal Linking

The internal linking system automatically:
- Analyzes post content for keyword matches
- Compares categories and tags for topical relevance
- Updates internal links in Sanity
- Generates backlink hubs

Run `npm run internal-links` to generate links for all posts.

## SEO Features

- Automatic metadata generation from content
- JSON-LD structured data (Article schema)
- Open Graph and Twitter Card support
- Breadcrumb navigation with structured data
- Canonical URLs

## Content Automation

Generate draft posts from templates:
```bash
tsx content-automation/generate-post-from-template.ts "Topic" "author-id" "category-id"
```

## Deployment

1. Deploy to Vercel (recommended for Next.js)
2. Set environment variables in your deployment platform
3. Deploy Sanity Studio: `npm run sanity:deploy`

## License

MIT


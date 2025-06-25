# Embraceland - Meditation Landing Page

> Modern, responsive landing page for ROOT meditation device with AWS S3 media integration

<div align="center">

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

## Features

- 🎨 **Modern Design** - Clean UI with glassmorphism effects
- 📱 **Fully Responsive** - Desktop, tablet, and mobile optimized
- 🎥 **Interactive Videos** - AWS S3 hosted meditation environments
- ⚡ **Performance Optimized** - Fast loading with preloading strategies
- ♿ **Accessible** - WCAG compliant

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd landing-page-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS Modules with design tokens
- **Media**: AWS S3 for video/image hosting
- **Icons**: React Icons
- **Build**: Vite with Rollup

## Project Structure

```
src/
├── components/         # UI components
│   ├── layout/        # Navigation, Footer
│   ├── sections/      # Page sections
│   └── ui/            # Reusable UI components
├── services/          # AWS S3 video/image services
├── hooks/             # Custom React hooks
├── tokens/            # Design system (colors, typography)
└── utils/             # Helper functions
```

## Media Assets

All media assets are hosted on AWS S3:

- **Videos**: `iembrace-website-videos.s3.us-east-2.amazonaws.com`
- **Images**: `embrace-website-images.s3.us-east-2.amazonaws.com`

Assets are preloaded in HTML for optimal performance.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (outputs to `docs/`) |
| `npm run preview` | Preview production build |
| `npm run build:analyze` | Analyze bundle size |

## Deployment

The application builds to the `docs/` directory, making it ready for:

- **GitHub Pages** - Enable Pages in repository settings
- **Vercel** - Zero-config deployment
- **Netlify** - Drag and drop deployment
- **Any static hosting** - Upload `docs/` contents

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
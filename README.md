# ROOT - Meditation Landing Page

<div align="center">
  <h3>🧘‍♀️ Emotional Wellness Companion</h3>
  <p>A modern, responsive landing page for ROOT - an innovative meditation and mindfulness device</p>
  
  ![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)
  ![Bundle Size](https://img.shields.io/badge/Bundle%20Size-483kB-green)
  ![Performance](https://img.shields.io/badge/Performance-Optimized-brightgreen)
</div>

---

## 🌟 Features

- **🎨 Modern Design** - Clean, meditative UI with glassmorphism effects
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **🎥 Interactive Video Backgrounds** - Immersive meditation environments
- **⚡ Performance Optimized** - Lazy loading, code splitting, and optimized assets
- **♿ Accessible** - WCAG compliant with keyboard navigation and screen reader support
- **🎯 CSS-Only Animations** - Smooth breathing effects and particle animations without heavy libraries

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd landing-page-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build:analyze
```

## 🏗️ Tech Stack

### Core Technologies
- **React 18.2** - UI library with hooks and modern patterns
- **TypeScript 5.2** - Type-safe JavaScript development
- **Vite 5.0** - Fast build tool and dev server
- **CSS Modules** - Scoped styling with design tokens

### Key Libraries
- **React Icons** - Comprehensive icon library
- **AWS SDK** - S3 bucket storage integration

### Performance Tools
- **Rollup Bundle Analyzer** - Bundle size visualization
- **Terser** - JavaScript minification
- **Custom Performance Monitor** - Real-time performance tracking

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Navigation, Footer
│   ├── sections/        # Page sections (Hero, Features, etc.)
│   └── ui/              # Base UI components
├── hooks/               # Custom React hooks
├── services/            # API and external service integrations
├── utils/               # Utility functions and helpers
├── types/               # TypeScript type definitions
├── data/                # Static data and content
├── assets/              # Images, icons, and static files
└── tokens/              # Design system tokens (colors, spacing, etc.)
```

## 🎨 Design System

### Design Tokens
- **Colors** - Carefully selected meditation-inspired palette
- **Typography** - Source Sans Pro with consistent scale
- **Spacing** - 8px grid system for consistent layouts
- **Animations** - Smooth, natural timing functions

### Key Components
- **HeroSection** - Landing area with breathing animation
- **ImmerseSection** - Interactive video backgrounds
- **TabSection** - Feature showcase with expandable content
- **Navigation** - Responsive nav with glassmorphism

## ⚡ Performance Optimizations

### Bundle Optimization
- ✅ **Removed Three.js** - Replaced with CSS animations (51% size reduction)
- ✅ **Tree Shaking** - Eliminated unused code
- ✅ **Code Splitting** - Lazy loaded components
- ✅ **Asset Optimization** - Compressed images and videos

### Runtime Performance
- **Lazy Loading** - Components load on demand
- **Intersection Observer** - Efficient scroll-based triggers
- **RequestAnimationFrame** - Smooth animations
- **Memory Management** - Proper cleanup and disposal

### Results
- Bundle size: **977kB → 483kB** (51% reduction)
- First Contentful Paint: **<1.5s**
- Time to Interactive: **<2.0s**

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AWS S3/Cloudflare R2 Configuration
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_AWS_REGION=your_region
VITE_S3_BUCKET_NAME=your_bucket_name

# Cloudflare R2 Configuration (if using)
VITE_R2_ACCOUNT_ID=your_r2_account_id
VITE_R2_ACCESS_KEY_ID=your_r2_access_key
VITE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
VITE_R2_BUCKET_NAME=your_r2_bucket_name
```

### Build Configuration

The project uses Vite for building with the following optimizations:

- **Rollup Bundle Analyzer** - Visual bundle analysis
- **Terser** - JavaScript minification
- **CSS Optimization** - Minification and tree shaking
- **Asset Optimization** - Image compression and lazy loading

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Serve locally to test
npm run preview
```

### Deployment Platforms

The app is optimized for deployment on:

- **Vercel** - Zero-config deployment with edge functions
- **Netlify** - JAMstack deployment with form handling
- **AWS S3 + CloudFront** - Scalable static hosting
- **GitHub Pages** - Simple static hosting

### Performance Monitoring

Built-in performance monitoring includes:

- **Core Web Vitals** tracking
- **Bundle size** analysis
- **Memory usage** monitoring
- **Video load performance** metrics

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting
- **CSS Modules** for scoped styling
- **Semantic HTML** for accessibility

### Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build test
npm run build
```

## 📊 Bundle Analysis

View detailed bundle composition:

```bash
npm run build:analyze
```

This generates a visual report showing:
- **Chunk sizes** and dependencies
- **Module composition** breakdown
- **Performance** recommendations
- **Optimization** opportunities

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Ensure Node.js 16+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

**Performance Issues**
- Check bundle size: `npm run build:analyze`
- Monitor memory usage in browser DevTools
- Verify lazy loading is working correctly

**Video Loading Issues**
- Verify environment variables are set
- Check network connectivity
- Ensure video files are properly uploaded to cloud storage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration** - Modern meditation and wellness apps
- **Performance Patterns** - React and Vite best practices
- **Accessibility** - WCAG guidelines and inclusive design principles

---

<div align="center">
  <p>Built with ❤️ for mindfulness and emotional wellness</p>
  <p>
    <a href="#quick-start">Getting Started</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#performance-optimizations">Performance</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>
# Hero Section - 12-Column Grid Layout Update

## Changes Made

### 1. Updated Grid Layout Structure
- **Content Area**: Now spans columns 1-6 (first 6 columns)
- **Phone Frame**: Now spans columns 7-12 (last 6 columns)
- **Layout**: Side-by-side layout on desktop, stacked on mobile

### 2. Content Alignment
- **Desktop**: Left-aligned content in first 6 columns
- **Mobile**: Center-aligned content in single column
- **Text**: All text content is now left-aligned on desktop

### 3. Grid Configuration
```css
/* Desktop Layout (1025px+) */
.heroContent {
  grid-template-columns: var(--grid-template-standard); /* 12 columns */
}

.heroTextContent {
  grid-column: 1 / 7; /* First 6 columns */
  align-items: flex-start;
  text-align: left;
}

.phoneContainer {
  grid-column: 7 / 13; /* Last 6 columns */
}
```

### 4. Responsive Breakpoints
- **Large Desktop (1440px+)**: 6+6 column layout
- **Desktop (1024-1439px)**: 6+6 column layout
- **Tablet (768-1023px)**: 7+5 column layout (more space for content)
- **Mobile (up to 767px)**: Single column stacked layout

### 5. Component Structure
- Added `.phoneContainer` class for proper phone frame positioning
- Updated `.heroTextContent` to use left alignment
- Modified `.titleGroup` for consistent left alignment
- Adjusted spacing with proper padding variables

### 6. Key Features
- **Consistent Grid**: Uses 12-column grid system across all breakpoints
- **Semantic Layout**: Content and phone frame are properly separated
- **Responsive**: Adapts gracefully from desktop to mobile
- **Left-Aligned**: Content is left-aligned on desktop as requested
- **Proper Spacing**: Uses design token spacing variables

## Visual Layout

### Desktop (1025px+):
```
[Content: Col 1-6] [Phone: Col 7-12]
```

### Mobile (up to 767px):
```
[Content: Full Width]
[Phone: Full Width]
```

The Hero section now follows a consistent 12-column grid layout with content taking up the first 6 columns and the phone frame taking up the last 6 columns, with proper left-alignment for the content area.

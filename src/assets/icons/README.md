# Icons Folder

This folder contains SVG icons used throughout the application.

## Current Icons:
- `mindfulness 1.svg` - Used for the first accordion item (mindfulness/meditation)
- `ripple.svg` - Used for the second accordion item (breathing/ripple effects)
- `sine.svg` - Used for the third accordion item (rhythm/wave patterns)
- `icon1.svg`, `icon2.svg`, `icon3.svg` - Placeholder icons (can be removed)

## How to Add New Icons:
1. Drop your SVG files into this folder
2. Import them in the component where you want to use them:
   ```tsx
   import mindfulnessIcon from '../../assets/icons/mindfulness 1.svg'
   import rippleIcon from '../../assets/icons/ripple.svg'
   import sineIcon from '../../assets/icons/sine.svg'
   ```
3. Use them in your JSX:
   ```tsx
   <img src={mindfulnessIcon} alt="" style={{ width: 24, height: 24 }} />
   ```

## Notes:
- SVG files are automatically typed thanks to the `svg.d.ts` file in the types folder
- Icons are currently sized at 24x24px but can be resized with CSS
- Replace the placeholder icons with your actual design assets

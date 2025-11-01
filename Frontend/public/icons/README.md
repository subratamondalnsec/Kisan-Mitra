# PWA Icons

This folder should contain PWA icons in the following sizes:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons

You can use your existing logo.png to generate these icons using one of these methods:

### Method 1: Online Tool
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload your logo.png
3. Download the generated icons
4. Place them in this folder

### Method 2: Using Sharp (Node.js)
Run the icon generator script:
```bash
npm run generate-icons
```

### Method 3: Manual with Image Editor
Use any image editor (Photoshop, GIMP, etc.) to resize logo.png to each required size.

## Icon Requirements
- Format: PNG
- Background: Transparent or solid color matching your theme
- Content: Should be recognizable at all sizes
- Safe area: Keep important content within 80% of the icon area (for maskable icons)

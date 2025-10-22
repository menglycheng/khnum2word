# Khmer Number to Word Converter

A web application for converting between Khmer numbers and words, with support for both Khmer and Western numerals.

## Features

- **Number to Khmer Words**: Convert numeric digits to Khmer word representation
- **Khmer Words to Numbers**: Convert Khmer word representations back to numerals
- **Dual Numeral Systems**: Support for both Western (0-9) and Khmer (០-៩) numerals
- **Decimal Support**: Handle decimal numbers with proper Khmer word formatting
- **Modern UI**: Built with Next.js 15 and Tailwind CSS with dark mode support

## Demo

Try out the live converter at: [Your deployment URL]

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/khnum2word.git
cd khnum2word

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

## Usage

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build and start the production server:

```bash
npm run build
npm start
```

### As a Library

You can also use the converter functions directly in your own projects:

```typescript
import { num2WordKH, word2NumKH, word2NumEN } from './src/lib/converters';

// Convert number to Khmer words
const khmerWords = num2WordKH("123");
// Output: "មួយរយម្ភៃបី"

// Convert Khmer words to Khmer numerals
const khmerNum = word2NumKH("មួយរយម្ភៃបី");
// Output: "១២៣"

// Convert Khmer words to Western numerals
const westernNum = word2NumEN("មួយរយម្ភៃបី");
// Output: "123"
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner

## Project Structure

```
khnum2word/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── lib/
│       ├── constants.ts  # Khmer number constants
│       ├── converters.ts # Main conversion functions
│       └── utils.ts      # Helper utilities
├── public/              # Static assets
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Support

If you find this project helpful, please consider giving it a ⭐️ on GitHub!

For bugs and feature requests, please [open an issue](https://github.com/yourusername/khnum2word/issues).

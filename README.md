# TradeScope

## Project overview

TradeScope is an original mobile concept for scanning fictional disclosed-insider activity and opening a single mock transaction for closer review. It is a prototype for discovery and education, not an investing tool.

## Concept and data statement

This is an original mobile concept inspired by the broad insider-activity product category. StockInsider.io was not used as a data, copy, layout, or UI source. All companies, people, tickers, dates, signals, values, and chart points are locally stored fictional mock/demo data. The app has no live filings, market feed, or backend connection.

## Screens and features

- **Market Pulse:** fictional-data badge, search entry point, calculated purchase/sale summaries, signal-strength overview, top signal categories, and four latest activity cards.
- **Find trades:** case-insensitive ticker/company search, transaction type filters, insider role filters, value-threshold filters, result count, and a clear empty state.
- **Trade details:** company header, fictional-data badge, named signal summary, insider and transaction metadata, mock seven-day activity chart, educational context, and the required disclaimer.

Every trade card opens its matching details screen. Search and filters operate entirely on the local `mockTrades` array.

## Tech stack

- Expo SDK 57
- React Native 0.86
- TypeScript
- React Navigation native stack and bottom tabs
- Expo Vector Icons
- Local React state and fictional TypeScript data

## Setup

```bash
npm install
npx expo start
```

Use the Expo CLI to open the app on an Android emulator, iOS simulator, or a physical device. The web target can be started with `npm run web`.

For an installable Android preview build, configure EAS and run:

```bash
npx eas build:configure
npx eas build --platform android --profile preview
```

## Mobile design decisions

The interface uses a compact dark shell, high-contrast transaction semantics, reusable cards, horizontal filter chips, and a predictable three-step flow. Purchase and sale are always communicated with text, arrows, and color together. Filter controls retain visible selected states and the result count updates immediately so the screen remains useful on narrow mobile widths.

## Known limitations

- Data is static and fictional; there are no live filings, APIs, authentication, portfolio tools, alerts, or backend services.
- The seven-day chart is a fixed mock visualization and must not be read as market performance.
- The prototype does not provide financial advice or predict future stock performance.
- APK, screenshots, and demo video are submission assets created outside this repository.

## Validation

```bash
npx tsc --noEmit
```

The command currently completes without TypeScript errors.

## Testing

The app was tested on a personal Samsung S23 Ultra. The main navigation flow, local search, filters, empty state, trade details, mock chart, and disclaimer were checked on the device.

## AI-use disclosure

This project was built using an AI-augmented engineering workflow under human direction and review. Specialized tools were used for different stages of the development process:

- **Domain analysis and requirements scaffolding — Gemini:** Used to analyze the assignment brief, clarify the product domain, identify edge cases, and turn the requirements into an implementation checklist.
- **Architecture design and code generation — DeepSeek via OpenCode:** Used to explore the modular screen/component structure and generate implementation scaffolding under explicit project constraints.
- **Continuous testing and quality engineering — GitHub Copilot plus manual inspection:** Used for implementation support, code review, TypeScript validation, Expo health checks, and manual inspection of behavior and layout.

AI was used as an engineering productivity tool, not as a substitute for software judgment. The project structure, fictional data model, UI decisions, implementation changes, and validation were reviewed and directed manually.

## Repository

GitHub repository: https://github.com/animeshdashtirtha/TradeScope

## Contact

For questions about this project:

- LinkedIn: **[Add LinkedIn URL]**
- Email: **[Add contact email]**

## Deliverables

- APK: Uploaded to the Google Drive submission folder.
- Screenshots: To be included in the Google Drive submission folder.
- Demo video: To be included in the Google Drive submission folder.
- Google Drive folder: **[Add Google Drive URL]**
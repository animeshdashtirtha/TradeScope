# TradeScope

TradeScope is a fictional React Native / Expo concept for exploring executive trade filings. It is intentionally powered by local mock data so the interface can be reviewed without an API or account setup.

## Run locally

```bash
npm install
npm start
```

Use the Expo CLI to open the app on an Android emulator, iOS simulator, or a physical device. The web target can be started with `npm run web` when the Expo web dependencies are available.

## Architecture

- `src/types/trade.ts` contains the typed `InsiderTrade` model.
- `src/data/mockTrades.ts` contains eight consistent fictional records.
- `src/theme/colors.ts` contains the dark shell, surface, signal, and spacing tokens.
- `src/components/` contains reusable trade cards, filters, badges, summary cards, and the activity chart.
- `src/screens/` contains the market overview, Find trades view, and trade detail view.
- `src/navigation/AppNavigator.tsx` owns the typed stack routes and trade identifier params.

## Product notes

Find trades combines case-insensitive ticker/company search with trade action, insider role, and value filters. Detail pages include a signal strength treatment, transaction metrics, seven-day mock activity, educational context, and the required legal disclaimer.

All people, companies, tickers, and filings are invented. This project is an interface demonstration only and is not investment advice.

## Android build

For an installable Android APK, configure an Expo Application Services project and run an EAS preview build:

```bash
npx eas build:configure
npx eas build --platform android --profile preview
```
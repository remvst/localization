# @remvst/localization

Localization utils for TypeScript.

## Installation

```sh
npm install --save-dev @remvst/localization
```

## Usage

Create a JSON file with your localized strings (`my-localization.json`):

```json
{
    "ok": { "en": "Okay" },
    "confirm": { "en": "Confirm" },
    "cancel": { "en": "Cancel" },
    "back": { "en": "Back" },
    "play": { "en": "Play" },
    "time": { "en": "Time" },
    "backToMainMenu": { "en": "Back To Main Menu", "fr": "Retour au menu principal" }
}
```

Parse the Polyglot CSV file into a JSON file:

```sh
npx @remvst/localize parse-csv \
    --in=polyglot.csv \
    --out=polyglot.json \
    --languages-line-index=1
```

Backfill missing translations using a fallback JSON:

```sh
npx @remvst/localize combine-json \
    --main=localization.json \
    --fallback=polyglot.json \
    --out=localization-combined.json \
    --fallback-locale=en \
    --locale=en \
    --locale=fr \
    --locale=es
```

Backfill missing translations using Google translate:

```sh
npx @remvst/localize google-translate \
    --in=localization-combined.json \
    --out=localization-full.json \
    --fallback-locale=en \
    --locale=en \
    --locale=fr \
    --locale=es
```

Export to Typescript:

```sh
npx @remvst/localize to-typescript \
    --in=localization-full.json \
    --out=localization-full.ts
```

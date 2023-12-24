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

```json
{
    ...
    "scripts": {
        "polyglot": "localization-parse-polyglot-csv -i test/polyglot.csv -o testOut/polyglot.json"
    },
    ...
}
```

Backfill missing translations in your package.json:

```json
{
    ...
    "scripts": {
        "backfill": "localization-backfill -i my-localization.json -o testOut/localization-backfilled.json -l en -l fr -l es"
    },
    ...
}
```

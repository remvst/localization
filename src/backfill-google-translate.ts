import { promises as fs } from 'fs';
import { translate } from '@vitalets/google-translate-api';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Key, Locale, LocalizedItem, TranslationSet } from './translation-set';

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .options({
            'in': {
                type: 'string',
                alias: 'i',
                describe: 'JSON file to read from',
            },
            'out': {
                type: 'string',
                alias: 'o',
                describe: 'Output JSON file',
            },
            'fallbackLocale': {
                type: 'string',
                describe: 'Default locale to backfill translations',
                default: 'en',
            },
            'locale': {
                type: 'string',
                alias: 'l',
                describe: 'Locale to include',
            }
        })
        .array('fallback')
        .array('locale')
        .demandOption('in')
        .demandOption('out')
        .demandOption('locale')
        .argv

    const mainJson = JSON.parse(await fs.readFile(argv.in!, 'utf-8'));
    const outTranslations = TranslationSet.fromJSON(mainJson);

    await outTranslations.applyFallbacks(
        argv.locale || ['en'],
        async (key: Key, locale: Locale, item: LocalizedItem) => {
            const translationInFallbackLocale = item.get(argv.fallbackLocale);
            if (!translationInFallbackLocale) return null;

            const translationResult = await translate(
                translationInFallbackLocale,
                { from: argv.fallbackLocale, to: locale },
            );

            return translationResult?.text;
        }
    );

    await fs.writeFile(argv.out!, JSON.stringify(outTranslations.toJSON(), null, 4));
}

main();

import { promises as fs } from 'fs';
import { Key, Locale, LocalizedItem, TranslationSet } from "../model/translation-set";
import { translate } from '@vitalets/google-translate-api';

export async function googleTranslateCommand(options: {
    in: string,
    out: string,
    locale: string[],
    fallbackLocale: string,
}) {
    const mainJson = JSON.parse(await fs.readFile(options.in, 'utf-8'));
    const outTranslations = TranslationSet.fromJSON(mainJson);

    await outTranslations.applyFallbacks(
        options.locale || ['en'],
        async (_: Key, locale: Locale, item: LocalizedItem) => {
            const translationInFallbackLocale = item.get(options.fallbackLocale);
            if (!translationInFallbackLocale) return null;

            const translationResult = await translate(
                translationInFallbackLocale,
                { from: options.fallbackLocale, to: locale },
            );

            return translationResult?.text;
        }
    );

    await fs.writeFile(options.out, JSON.stringify(outTranslations.toJSON(), null, 4));
}

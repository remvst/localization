import { promises as fs } from 'fs';
import { TranslationSet, Key, Locale, LocalizedItem } from '../model/translation-set';

export async function combineJsonCommand(options: {
    main: string,
    out: string,
    locale: string[],
    fallbackLocale: string,
    fallback: string[],
}) {
    const fallbackTranslations: TranslationSet[] = [];

    for (const fallbackPath of options.fallback || []) {
        const sourceJson = JSON.parse(await fs.readFile(fallbackPath, 'utf-8'));
        const translationSet = TranslationSet.fromJSON(sourceJson);
        fallbackTranslations.push(translationSet);
    }

    const mainJson = JSON.parse(await fs.readFile(options.main, 'utf-8'));
    const outTranslations = TranslationSet.fromJSON(mainJson);

    await outTranslations.applyFallbacks(
        options.locale || ['en'],
        async (key: Key, locale: Locale, item: LocalizedItem) => {
            const translationInFallbackLocale = item.get(options.fallbackLocale);
            if (!translationInFallbackLocale) return null;

            for (const fallbackSet of fallbackTranslations) {
                if (!translationInFallbackLocale) continue;
                const fromFallbackLocale = fallbackSet.fromLocalization(options.fallbackLocale, translationInFallbackLocale)?.get(locale);
                if (fromFallbackLocale) return fromFallbackLocale;
            }

            return null;
        }
    );

    await fs.writeFile(options.out, JSON.stringify(outTranslations.toJSON(), null, 4));
}

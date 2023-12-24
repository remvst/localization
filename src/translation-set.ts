export type Key = string;
export type Locale = string;
export type LocalizedItem = Map<Locale, string>;

export class TranslationSet {

    private readonly locales = new Set<Locale>();
    private readonly translations = new Map<Key, LocalizedItem>();

    add(
        key: Key,
        locale: Locale,
        localization: string,
    ) {
        this.locales.add(locale);

        if (!this.translations.has(key)) {
            this.translations.set(key, new Map());
        }

        this.translations.get(key)!.set(locale, localization);
    }

    fromLocalization(
        language: Locale,
        localization: string,
    ): LocalizedItem | null {
        const search = localization.toLowerCase();
        for (const localizedItem of this.translations.values()) {
            if (localizedItem.get(language)?.toLowerCase() === search) {
                return localizedItem;
            }
        }
        return null;
    }

    toJSON() {
        const res: {[key: string]: {[key: string]: string}} = {};
        for (const [key, localizedItem] of this.translations.entries()) {
            res[key] = {};
            for (const [locale, translation] of localizedItem.entries()) {
                res[key][locale] = translation;
            }
        }
        return res;
    }

    static fromJSON(json: {[key: string]: {[key: string]: string}}): TranslationSet {
        const res = new TranslationSet();
        for (const [key, localizedItem] of Object.entries(json)) {
            for (const [locale, translation] of Object.entries(localizedItem)) {
                res.add(key, locale, translation);
            }
        }
        return res;
    }

    toTypeScript(): string {
        let generatedFileContent = '';

        generatedFileContent += `export type Locale = ${Array.from(this.locales).map(key => JSON.stringify(key)).join(' | ')};\n\n`;
        generatedFileContent += `export type LocalizedKey = ${Array.from(this.translations.keys()).map(key => JSON.stringify(key)).join(' | ')};\n\n`;
        generatedFileContent += `export type LocalizationItem = {[key in Locale]?: string};\n\n`;

        generatedFileContent += 'export const LOCALIZATION: {[key in LocalizedKey]: LocalizationItem} = {\n';

        for (const [key, localizedItem] of this.translations.entries()) {
            generatedFileContent += `    ${key}: {\n`;

            for (const [locale, translation] of localizedItem.entries()) {
                if (!translation) continue;
                generatedFileContent += `        ${locale}: ${JSON.stringify(translation)},\n`;
            }

            generatedFileContent += `    },\n`;
        }

        generatedFileContent += '};\n\n';

        generatedFileContent += `let LOCALE: Locale = 'en';\n\n`;

        generatedFileContent += `export function setLocale(locale: string) {\n`;
        generatedFileContent += `    LOCALE = locale.split('-')[0] as Locale\n`;
        generatedFileContent += `}\n\n`;

        generatedFileContent += `export function localize(key: LocalizedKey) {\n`;
        generatedFileContent += `    const localizationItem: LocalizationItem = LOCALIZATION[key];\n`;
        generatedFileContent += `    return localizationItem[LOCALE] || localizationItem.en;\n`;
        generatedFileContent += `}\n`;

        return generatedFileContent;
    }

    async applyFallbacks(
        locales: Locale[],
        fallback: (key: Key, locale: Locale, localizedItem: LocalizedItem) => Promise<string | null>,
    ) {
        for (const [key, localizedItem] of this.translations.entries()) {
            for (const locale of locales) {
                let translation = localizedItem.get(locale) || null;
                if (translation) continue;

                try {
                    translation = await fallback(key, locale, localizedItem);
                } catch (err) {
                    console.error(err);
                    continue;
                }

                if (!translation) {
                    console.warn(`Unable to find fallback for ${key}`);
                    continue;
                }

                this.add(key, locale, translation);
            }
        }
    }
}

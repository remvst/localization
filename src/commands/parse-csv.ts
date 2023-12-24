import { promises as fs } from 'fs';
import { TranslationSet } from "../model/translation-set";

export async function parseCsv(
    path: string,
    languagesLine: number,
): Promise<TranslationSet> {
    const csvContent = await fs.readFile(path, 'utf-8');
    const csvLines = csvContent.split('\n');

    const res = new TranslationSet();

    const ietfLine = csvLines[languagesLine];
    const languagesIndices = new Map<string, number>();
    const ietfColumns = ietfLine.split(',');
    for (let i = 2 ; i < ietfColumns.length ; i++) {
        const locale = ietfColumns[i].slice(0, 2); // only grab the first two chars to identify the language
        languagesIndices.set(locale, i);
    }

    for (const line of csvLines) {
        const columns = line.split(',');

        const key = columns[0];

        for (const [locale, columnIndex] of languagesIndices.entries()) {
            res.add(key, locale, columns[columnIndex]);
        }
    }

    return res;
}

export async function parseCsvCommand(options: {
    in: string,
    out: string,
    languagesLineIndex: number,
}) {
    const polyglotTranslations = await parseCsv(options.in!, options.languagesLineIndex);
    await fs.writeFile(options.out!, JSON.stringify(polyglotTranslations, null, 4));
}

import { promises as fs } from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { TranslationSet } from './translation-set';

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

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .options({
            'in': {
                type: 'string',
                alias: 'i',
                describe: 'Path to CSV to read from',
            },
            'out': {
                type: 'string',
                alias: 'o',
                describe: 'Output file',
            },
            'languagesLineIndex': {
                type: 'number',
                alias: 'l',
                describe: 'Index of the row containing the languages',
            },
        })
        .demandOption('in')
        .demandOption('out')
        .demandOption('languagesLineIndex')
        .argv

    const polyglotTranslations = await parseCsv(argv.in!, argv.languagesLineIndex);

    await fs.writeFile(argv.out!, JSON.stringify(polyglotTranslations, null, 4));
}

main();

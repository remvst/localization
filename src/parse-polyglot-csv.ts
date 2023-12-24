import { promises as fs } from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { parseCsv } from './parse-csv';

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .options({
            'outFile': {
                type: 'string',
                alias: 'o',
                describe: 'Output file',
            },
            'inFile': {
                type: 'string',
                alias: 'i',
                describe: 'JSON file to read from',
            },
        })
        .argv

    const polyglotTranslations = await parseCsv(argv.inFile!, 1);

    await fs.writeFile(argv.outFile!, JSON.stringify(polyglotTranslations, null, 4));
}

main();

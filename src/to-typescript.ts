import { promises as fs } from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { TranslationSet } from './translation-set';

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .options({
            'out': {
                type: 'string',
                alias: 'o',
                describe: 'Output Typescript file',
            },
            'in': {
                type: 'string',
                alias: 'i',
                describe: 'JSON file to read from',
            },
        })
        .demandOption('in')
        .demandOption('out')
        .argv

    const sourceJson = JSON.parse(await fs.readFile(argv.in!, 'utf-8'));
    const outTranslations = TranslationSet.fromJSON(sourceJson);

    await fs.writeFile(argv.out!, outTranslations.toTypeScript());
}

main();

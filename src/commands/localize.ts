import { translate } from '@vitalets/google-translate-api';
import { promises as fs } from 'fs';

export async function localize(options: {
    "source-json": string,
    'source-locale': string,
    'destination-json': string,
    'destination-locale': string,
}) {
    let outJson: Record<string, string> = {};
    try {
       outJson = JSON.parse(await fs.readFile(options['destination-json'], 'utf-8'));
    } catch (error) {
        console.error("Error reading or parsing the all-strings file:", error);
    }

    const allStrings: Record<string, string> = JSON.parse(await fs.readFile(options['source-json'], 'utf-8'));

    try {
        for (const key of Object.keys(allStrings)) {
            if (outJson[key]) continue;

            const translationResult = await translate(
                key,
                { from: options["source-locale"], to: options["destination-locale"] },
            );

            outJson[key] = translationResult?.text ;
        }
    } finally {
        await fs.writeFile(options['destination-json'], JSON.stringify(outJson, null, 4));
    }
}

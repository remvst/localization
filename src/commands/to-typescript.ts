import { TranslationSet } from "../model/translation-set";
import { promises as fs } from 'fs';

export async function toTypescriptCommand(options: {
    in: string,
    out: string,
}) {
    const sourceJson = JSON.parse(await fs.readFile(options.in, 'utf-8'));
    const outTranslations = TranslationSet.fromJSON(sourceJson);

    await fs.writeFile(options.out, outTranslations.toTypeScript());
}

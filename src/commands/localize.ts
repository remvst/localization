import { translate } from "@vitalets/google-translate-api";
import { promises as fs } from "fs";

export async function localize(options: {
  sourceJson: string;
  sourceLocale: string;
  destinationJson: string;
  destinationLocale: string;
}) {
  let originalJson: Record<string, string> = {};
  try {
    originalJson = JSON.parse(
      await fs.readFile(options.destinationJson, "utf-8"),
    );
  } catch (error) {
    console.error("Error reading or parsing the all-strings file:", error);
  }

  const allStrings: Record<string, string> = JSON.parse(
    await fs.readFile(options.sourceJson, "utf-8"),
  );

  const outJson: Record<string, string> = {};

  try {
    for (const key of Object.keys(allStrings).sort()) {
      if (originalJson[key]) {
        outJson[key] = originalJson[key];
        continue;
      }

      const translationResult = await translate(key, {
        from: options.sourceLocale,
        to: options.destinationLocale,
      });

      outJson[key] = translationResult?.text;
    }
  } finally {
    await fs.writeFile(
      options.destinationJson,
      JSON.stringify(outJson, null, 4),
    );
  }
}

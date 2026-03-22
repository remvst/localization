import { promises as fs } from "fs";

export async function toTypescriptCommand(options: {
  defaultLocalization: string;
  out: string;
  localizeFunctionName: string;
}) {
  const allStringsJson = JSON.parse(
    await fs.readFile(options.defaultLocalization, "utf-8"),
  );

  let ts = "";

  ts += `export type LocalizedKey = ${Object.keys(allStringsJson)
    .map((key) => JSON.stringify(key))
    .join(" | ")};\n\n`;
  ts += `export type Localization = {[key in LocalizedKey]: string};\n\n`;

  ts += `let LOCALIZATION: Localization = ${JSON.stringify(allStringsJson)};\n\n`;

  ts += `export function setLocalization(localization: Localization) {\n`;
  ts += `    LOCALIZATION = localization;\n`;
  ts += `}\n\n`;

  ts += `export function ${options.localizeFunctionName}(key: LocalizedKey) {\n`;
  ts += `    return LOCALIZATION[key] || key;\n`;
  ts += `}\n`;

  await fs.writeFile(options.out, ts);
}

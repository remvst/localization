import { promises as fs } from "fs";
import { glob } from "glob";

export async function findStringsCommand(options: {
  in: string;
  out: string;
  localizeFunctionName: string;
}) {
  const jsfiles = await glob(options.in);

  const strings = new Set<string>();
  for (const file of jsfiles) {
    const content = await fs.readFile(file, "utf-8");

    const matches = [
      ...content.matchAll(
        new RegExp(`${options.localizeFunctionName}\\('([^']+)'\\)`, "g"),
      ),
      ...content.matchAll(
        new RegExp(`${options.localizeFunctionName}\\("([^"]+)"\\)`, "g"),
      ),
      ...content.matchAll(
        new RegExp(`${options.localizeFunctionName}\\(\`([^"]+)\`\\)`, "g"),
      ),
    ];

    for (const [_, string] of matches) {
      strings.add(string);
    }
  }

  const outJson: Record<string, string> = {};
  for (const string of Array.from(strings).sort()) {
    outJson[string] = string;
  }

  await fs.writeFile(options.out, JSON.stringify(outJson, null, 4));
}

import { config } from "dotenv";
import OpenAI from "openai";
import { promises as fs } from "fs";
import { translate } from "@vitalets/google-translate-api";

config();

export async function googleTranslate(
  text: string,
  from: string,
  to: string,
): Promise<string> {
  const result = await translate(text, { from, to });
  return result.text;
}

async function gptTranslate(
  text: string,
  from: string,
  to: string,
  context?: string,
): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt =
    `Translate the following text from ${from} to ${to}.` +
    (context ? ` Context: ${context}` : "") +
    `\nText: ${text}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
          You are a helpful translation assistant.
          Only return the string that would be used for translation, so it can be put in the game as is (verbatim).
          `.trim(),
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 1000,
    temperature: 0.3,
  });
  return completion.choices?.[0]?.message?.content?.trim() || "";
}

export async function localize(options: {
  sourceJson: string;
  sourceLocale: string;
  destinationJson: string;
  destinationLocale: string;
  context?: string;
  engine?: string;
}) {
  let existingJson: Record<string, string> = {};
  try {
    existingJson = JSON.parse(
      await fs.readFile(options.destinationJson, "utf-8"),
    );
  } catch (error) {}

  const allStrings: Record<string, string> = JSON.parse(
    await fs.readFile(options.sourceJson, "utf-8"),
  );

  const outJson: Record<string, string> = {};

  console.log(
    "Translating strings from",
    options.sourceLocale,
    "to",
    options.destinationLocale,
  );

  try {
    for (const key of Object.keys(allStrings).sort()) {
      if (existingJson[key]) {
        outJson[key] = existingJson[key];
        continue;
      }

      if (options.engine === "gpt") {
        outJson[key] = await gptTranslate(
          key,
          options.sourceLocale,
          options.destinationLocale,
          options.context,
        );
      } else {
        outJson[key] = await googleTranslate(
          key,
          options.sourceLocale,
          options.destinationLocale,
        );
      }
      console.log(`${key} => ${outJson[key]}`);
    }
  } finally {
    await fs.writeFile(
      options.destinationJson,
      JSON.stringify(outJson, null, 4),
    );
  }
}

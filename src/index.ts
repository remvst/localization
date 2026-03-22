#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { findStringsCommand } from "./commands/find-strings";
import { localize } from "./commands/localize";
import { toTypescriptCommand } from "./commands/to-typescript";

async function main() {
  await yargs(hideBin(process.argv))
    .command(
      "find-strings",
      "Finds all localizable strings in a source file",
      async (yargs) => {
        const argv = await yargs
          .option("in", {
            type: "string",
            alias: "i",
            describe: "Folder to read from",
          })
          .options("out", {
            type: "string",
            alias: "o",
            describe: "Output JSON file",
          })
          .options("localize-function-name", {
            type: "string",
            describe: "Name of the function used for localization",
          })
          .demandOption("in")
          .demandOption("out")
          .demandOption("localize-function-name").argv;

        await findStringsCommand(argv);
      },
    )
    .command("localize", "Creates a localization JSON file", async (yargs) => {
      const argv = await yargs
        .option("source-json", {
          type: "string",
          describe: "File that contains all strings in the original language",
        })
        .option("source-locale", {
          type: "string",
          describe: "Locale to translate from",
        })
        .options("destination-json", {
          type: "string",
          alias: "o",
          describe: "Output JSON file",
        })
        .option("destination-locale", {
          type: "string",
          describe: "Locale to translate to",
        })
        .option("context", {
          type: "string",
          describe: "Context to provide to the translation engine",
        })
        .demandOption("source-json")
        .demandOption("source-locale")
        .demandOption("destination-json")
        .demandOption("destination-locale").argv;

      await localize(argv);
    })
    .command(
      "to-typescript",
      "Creates a TypeScript file that can be then imported to localize a project",
      async (yargs) => {
        const argv = await yargs
          .option("default-localization", {
            type: "string",
            alias: "i",
            describe: "Default localization JSON file",
          })
          .options("out", {
            type: "string",
            alias: "o",
            describe: "Output Typescript file",
          })
          .options("localize-function-name", {
            type: "string",
            describe: "Name of the function used for localization",
          })
          .demandOption("default-localization")
          .demandOption("out")
          .demandOption("localize-function-name").argv;

        await toTypescriptCommand(argv);
      },
    ).argv;
}

main();

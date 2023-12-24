#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import { combineJsonCommand } from './commands/combine-json';
import { googleTranslateCommand } from './commands/google-translate';
import { parseCsvCommand } from './commands/parse-csv';
import { toTypescriptCommand } from './commands/to-typescript';

async function main() {
    await yargs(hideBin(process.argv))
        .command('parse-csv', 'convert a CSV into a JSON', async (yargs) => {
            const argv = await yargs
                .option('in', {
                    type: 'string',
                    alias: 'i',
                    describe: 'Path to CSV to read from',
                })
                .option('out', {
                    type: 'string',
                    alias: 'o',
                    describe: 'Output file',
                })
                .option('languagesLineIndex', {
                    type: 'number',
                    alias: 'l',
                    describe: 'Index of the row containing the languages',
                })
                .demandOption('in')
                .demandOption('out')
                .demandOption('languagesLineIndex')
                .argv

            await parseCsvCommand(argv);
        })
        .command('combine-json', 'combine multiple JSON files', async (yargs) => {
            const argv = await yargs
                .option('main', {
                    type: 'string',
                    alias: 'i',
                    describe: 'JSON file to read from',
                })
                .option('out', {
                    type: 'string',
                    alias: 'o',
                    describe: 'Output JSON file',
                })
                .option('fallbackLocale', {
                    type: 'string',
                    describe: 'Default locale to backfill translations',
                    default: 'en',
                })
                .option('fallback', {
                    type: 'string',
                    alias: 'f',
                    describe: 'Fallback JSON file to read from',
                })
                .option('locale', {
                    type: 'string',
                    alias: 'l',
                    describe: 'Locale to include',
                })
                .array('fallback')
                .array('locale')
                .demandOption('main')
                .demandOption('out')
                .demandOption('locale')
                .demandOption('fallback')
                .argv

            await combineJsonCommand(argv);
        })
        .command('to-typescript', 'converts a JSON file into a TypeScript file', async (yargs) => {
            const argv = await yargs
                .option('in', {
                    type: 'string',
                    alias: 'i',
                    describe: 'JSON file to read from',
                })
                .options('out', {
                    type: 'string',
                    alias: 'o',
                    describe: 'Output Typescript file',
                })
                .demandOption('in')
                .demandOption('out')
                .argv

            await toTypescriptCommand(argv);
        })
        .command('google-translate', 'adds missing translations to a JSON file using Google translate', async (yargs) => {
            const argv = await yargs
                .option('in', {
                    type: 'string',
                    alias: 'i',
                    describe: 'JSON file to read from',
                })
                .option('out', {
                    type: 'string',
                    alias: 'o',
                    describe: 'Output JSON file',
                })
                .option('fallbackLocale', {
                    type: 'string',
                    describe: 'Default locale to backfill translations',
                    default: 'en',
                })
                .option('locale', {
                    type: 'string',
                    alias: 'l',
                    describe: 'Locale to include',
                })
                .array('fallback')
                .array('locale')
                .demandOption('in')
                .demandOption('out')
                .demandOption('locale')
                .argv

            await googleTranslateCommand(argv);
        })
        .argv;
}

main();

import { Command, Program } from "./types";
import path from "path";
import fs from "fs";
import {defaultBlackList} from "../lib/defaults";

type ReadCommandOptions = {
  root: string;
  outDir: string;
  include?: string;
  exclude?: string;
};

export const run: Command = {
  setup: (program: Program) => {
    program
      .command("run")
      .description("Copy readme files from a directory tree and write them to an output folder in docusaurus doc format")
      .option(`-r, --root <path>`, "root of directory tree to search", process.cwd())
      .option(`-o, --outDir <path>`, "output location", path.join(process.cwd(), "docs"))
      .option(`-i, --include <regex>`, "directories/files to include")
      .option(`-e, --exclude <regex>`, "directories/files to ignore", defaultBlackList)
      .action(async (options) => {
        await _run(options);
      });
  },
};

async function _run(options: ReadCommandOptions) {
  const { root, outDir, include, exclude } = options;

  const whitelist = include ? new RegExp(include) : undefined;
  const blacklist = exclude ? new RegExp(exclude) : undefined;

  findReadmes("", root, outDir, whitelist, blacklist);

  console.log(`RTD complete. Docs output to: ${outDir}`);
  process.exit(0);
}

function findReadmes(pathFromRoot: string, inRoot: string, outRoot: string, whitelist?: RegExp, blacklist?: RegExp) {
  const searchDir = path.join(inRoot, pathFromRoot);
  const dirents = fs.readdirSync(searchDir, { withFileTypes: true });

  for (const dirent of dirents) {
    if (whitelist && !whitelist.test(dirent.name)) continue;
    if (blacklist && blacklist.test(dirent.name)) continue;

    if (dirent.isFile() && dirent.name.toLowerCase() === "readme.md") {
      const outputDir = path.join(outRoot, pathFromRoot);
      const filePath = path.join(searchDir, dirent.name);

      const readme = fs.readFileSync(filePath, 'utf-8');
      writeReadmeAsDoc(outputDir, readme);

    } else if (dirent.isDirectory()) {
      const nextPathFromRoot = path.join(pathFromRoot, dirent.name);
      findReadmes(nextPathFromRoot, inRoot, outRoot, whitelist, blacklist);
    }
  }
}

function writeReadmeAsDoc(outputDir: string, readme: string): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const readmePath = path.join(outputDir, "readme-doc.md");
  const readmeDoc = `---
id: readme-doc
sidebar_position: 0
---

` + readme;
  fs.writeFileSync(readmePath, readmeDoc);
}
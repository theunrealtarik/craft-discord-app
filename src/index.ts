#! /usr/bin/env node
/// <reference path="../types.d.ts" />

import chalk from "chalk";
import inquirer from "inquirer";
import spinner from "ora";
import path from "path";
import fs from "fs";
import cp from "child_process";
import util from "util";

import { QuestionCollection, Keys } from "./utils";

const main = async (): Promise<void> => {
  const templatePath = path.join(__dirname, "../", "template");

  const answers: PromptAnswers = await inquirer.prompt(QuestionCollection);

  if (!answers.lang_pref) {
    console.log(
      `\nI don't like ${chalk.yellow(
        "Javascript"
      )}, I'm gonna be using ${chalk.blue("Typescript")} instead :)\n`
    );
  }

  const destPath = path.join(process.cwd(), answers.BOT_NAME);

  try {
    fs.mkdirSync(destPath);
    console.log(`${chalk.green("✓")} project folder created successfully`);
  } catch (error: any) {
    console.log(
      `${chalk.red("x")} failed to create project folder.\n(${error.message})\n`
    );
  }

  const filesTransferNet: FilesTransferNet = {
    err: null,
    file: null,
  };
  const copyTemplateFolder = (src: string, dest: string) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
      let entrySrcPath = path.join(src, entry.name);
      let entryDestPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        fs.mkdirSync(entryDestPath, {
          recursive: true,
        });
        copyTemplateFolder(entrySrcPath, entryDestPath);
      } else if (entry.isFile()) {
        fs.copyFileSync(entrySrcPath, entryDestPath);
      }
    }
  };

  copyTemplateFolder(templatePath, destPath);

  if (filesTransferNet.err) {
    console.log(
      `${chalk.red("x")} an error occurred while transferring files (${
        filesTransferNet.file
      })\n(${filesTransferNet.err})\n`
    );
    process.exit();
  }

  const templateConfigFiles = [
    path.join(destPath, "configs", "bot.json"),
    path.join(destPath, "package.json"),
  ];

  templateConfigFiles.forEach((file) => {
    let buf = fs.readFileSync(file, { encoding: "utf-8" });

    Object.values(Keys).forEach((key) => {
      buf = buf.replace(`{${key}}`, (<any>answers)[key]);
    });

    fs.writeFileSync(file, buf);
  });

  if (!answers.install_modules) {
    console.log(
      `
      ${chalk.blue("cd")} ${answers.BOT_NAME}
      ${chalk.blue("npm")} install
      ${chalk.blue("npm")} run dev
      `
    );
  } else {
    const InstallingModules = spinner({
      text: "installing dependencies ...",
      spinner: "dots",
      color: "white",
    }).start();
    const exec = util.promisify(cp.exec);

    process.chdir(destPath);
    const { stdout, stderr } = await exec(`npm install`);

    InstallingModules.color = "green";
    InstallingModules.text = "finished downloading dependecies";
    InstallingModules.stop();

    console.log(`
      ${chalk.blue("cd")} ${answers.BOT_NAME}
      ${chalk.blue("npm")} run dev
    `);
  }
};

main();

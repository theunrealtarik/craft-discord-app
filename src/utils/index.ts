import chalk from "chalk";

export const Keys = {
  CLIENT_ID: "CLIENT_ID",
  GUILD_ID: "GUILD_ID",
  TOKEN: "TOKEN",
  BOT_NAME: "BOT_NAME",
};

export const QuestionCollection = [
  {
    name: Keys.BOT_NAME,
    message: "Project name?",
    default: "my-bot",
  },
  {
    name: "lang_pref",
    message:
      "Would you like to use " + chalk.blue("Typescript") + " in this bot?",
    type: "confirm",
    default: true,
  },
  {
    name: "install_modules",
    message: "Do you want to install dependencies after project creation?",
    type: "confirm",
    default: true,
  },
  {
    name: Keys.CLIENT_ID,
    message: "Your client ID",
    type: "number",
  },
  {
    name: Keys.GUILD_ID,
    message: "Your development guild ID",
    type: "number",
  },
  {
    name: Keys.TOKEN,
    message: "Bot token to login",
  },
];

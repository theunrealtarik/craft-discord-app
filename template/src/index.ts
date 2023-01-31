/// <reference path="../configs/types.d.ts" />

import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { TOKEN, CLIENT_ID, GUILD_ID } from "../configs/bot.json";

const envFileExtension =
  typeof process.env.NODE_ENV == "undefined" ? ".ts" : ".js";
const registeredCommands: SlashCommandBuilder[] = [];
const rest = new REST({ version: "10" });
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs
  .readdirSync(commandsPath)
  .filter((fileName) => fileName.endsWith(envFileExtension));
client.commands = new Collection();

for (let file of commandsFiles) {
  const commandPath = path.join(commandsPath, file);
  const command: Command = require(commandPath).default;

  client.commands.set(command.data.name, command);
  registeredCommands.push(command.data);
}

client.on(Events.ClientReady, (client) => {
  console.clear()
  console.log(
    `[${chalk.green("SUCCESS")}]: ${client.user.username} is now online`
  );
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error: any) {
    console.log(
      `[${chalk.red("ERROR")}]: there was an error with command "${
        command.data.name
      }"\nError: ${error.message}`
    );
  }
});

const main = async (): Promise<void> => {
  try {

    rest.setToken(TOKEN);
    await client.login(TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: registeredCommands,
    });

  } catch (error: any) {
    console.log(`[${chalk.red("ERROR")}]: ${error.message}`);
  }
};

main();

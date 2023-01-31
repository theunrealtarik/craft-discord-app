import { ChatInputCommandInteraction, Collection } from "discord.js";

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
    }
  }

  interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  }
}

module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}

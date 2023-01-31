import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("say hello for the world 🌍"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply("Hello, world!");
  },
};

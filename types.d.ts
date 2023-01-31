export {};

declare global {
  interface PromptAnswers {
    BOT_NAME: string;
    GUILD_ID: number;
    CLIENT_ID: number;
    TOKEN: string;
    lang_pref: boolean;
    install_modules: boolean;
  }

  interface FilesTransferNet {
    err: null | string;
    file: null | string;
  }
}

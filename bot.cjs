const { Telegraf } = require("telegraf");
const bot = new Telegraf("7877664074:AAE9r1OpPzondxbysu5orHQ1W-lE8UCONsw");

bot.start((ctx) => {
  ctx.reply("Welcome to TokenTrackr", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open App",
            web_app: { url: "https://token-trackr.vercel.app/" },
          },
        ],
      ],
    },
  });
});

bot.launch();

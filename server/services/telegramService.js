import TelegramBot from "node-telegram-bot-api";
import env from "dotenv";

env.config();

const bot = new TelegramBot(process.env.BOT_TOKEN);




export const postNews = async (article) => {
    try {

console.log(process.env.BOT_TOKEN);
console.log(process.env.CHANNEL_ID);

const articleUrl = `https://trendkari.in/feed/${article.location}/${article.slug}`;

        const caption = `📰 ${article.title}

${article.content.substring(0, 200)}...

Read More:
${articleUrl}`;
        if (article.image) {
            await bot.sendPhoto(
                process.env.CHANNEL_ID,
                article.image,
                {
                    caption
                }
            );
        } else {
            await bot.sendMessage(
                process.env.CHANNEL_ID,
                caption
            );
        }

        console.log("Telegram Post Successful");

    } catch (err) {

        console.error(err.response?.body || err);

    }
};
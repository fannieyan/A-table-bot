import { Telegraf } from 'telegraf';
import axios from 'axios';
import { printIngredients, printInstructions } from './utils';

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);
const spoonacularKey = process.env.SPOONACULAR_KEY as string;
const tags = ['main course', 'dessert', 'marinade', 'fingerfood', 'snack'];
let lastTimeAsked = new Date('2022-10-01').getTime();

bot.start((ctx) => {
  console.log('Received /start command');
  try {
    return ctx.reply('Bot paré au lancement.');
  } catch (e) {
    console.error('error in start action:', e);
    return ctx.reply('Error occured');
  }
});

bot.command('hello', async (ctx) => {
  console.log('Received /hello command.');
  // Using context shortcut
  await ctx.reply(`Coucou ${ctx.update.message.from.first_name} !`);
});

bot.command('nouvelle', async (ctx) => {
  console.log('Received /nouvelle command.');
  // Limit the number of calls made on start up.
  if (Date.now() - lastTimeAsked < 10000) {
    return;
  }
  try {
    lastTimeAsked = Date.now();
    const { data } = await axios.get<{ recipes: Recipe[] }>(
      'https://api.spoonacular.com/recipes/random',
      {
        params: {
          apiKey: spoonacularKey,
          tags: tags[Math.floor(Math.random() * tags.length)],
        },
      }
    );
    const recipe = data.recipes[0];
    let text = '';
    text += `${recipe.title}\n`;
    text += printIngredients(recipe.extendedIngredients);
    text += '\n';
    text += printInstructions(recipe.analyzedInstructions);
    text += `\n\n${recipe.sourceUrl}`;

    console.log(text);
    await ctx.reply(text + '\nProvided by Spoonacular API');
  } catch (error) {
    await ctx.reply(
      `Je n'ai pas pu récupérer de nouvelle recette : ${error as string}`
    );
  }
});

bot.command('quit', async (ctx) => {
  console.log('Received /quit command.');
  await ctx.reply('Bybye !');
  // Using context shortcut
  await ctx.leaveChat();
});

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async (event: { body: string }) => {
  console.log(event.body);
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: '' };
  } catch (e) {
    console.error('error in handler:', e);
    return {
      statusCode: 400,
      body: 'This endpoint is meant for bot and telegram communication',
    };
  }
};

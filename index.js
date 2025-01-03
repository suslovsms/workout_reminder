import { Telegraf } from 'telegraf';
import token from './token.js';
import {saveUsersData, checkConnection, createUserIfNotExist, isCounterExist, getCurrentValue} from './DBMethods.js'

const bot = new Telegraf(token);

let userData = {};

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    // Проверяем наличие данных пользователя
    if (!userData[userId]) {
        userData[userId] = {
            first_name: ctx.from.first_name || null,
            last_name: ctx.from.last_name || null,
            username: ctx.from.username || null,
            language_code: ctx.from.language_code || null,
            date_create: new Date(),
            is_premium: true,
        };
    }
    await createUserIfNotExist(userId, userData[userId]);
    await ctx.replyWithHTML("Я заставлю заниматься тебя спортом");
});


bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const messageText = Number(ctx.message.text);

    if (isNaN(messageText)) {
        ctx.reply('Введите числовое значение!');
        return;
    }

    userData[userId] = {
            first_name: ctx.from.first_name || null,
            last_name: ctx.from.last_name || null,
            username: ctx.from.username || null,
            language_code: ctx.from.language_code || null,
            date_create: new Date(),
            is_premium: true,
        counter: 0,
    };

    try {
        // Проверка подключения и существования пользователя
        await checkConnection();
        await createUserIfNotExist(userId, userData[userId]);
        await isCounterExist(userId);

        let currentCount = await getCurrentValue(userId, "counter");
        currentCount = currentCount || 0; 

        currentCount += messageText;

        userData[userId].counter = currentCount; 

        await saveUsersData(userData);

        console.log(`Новое значение счетчика: ${currentCount}`);
        ctx.reply(`Счётчик обновлён! Текущее значение: ${currentCount}`);

    } catch (error) {
        console.error('Ошибка обработки текста:', error);
        ctx.reply('Произошла ошибка при обновлении данных.');
    }
});

// bot.on('text', async (ctx) => {
//     const userId = ctx.from.id;
//     const messageText = Number(ctx.message.text);

//     // Проверяем, что введено число
//     if (isNaN(messageText)) {
//         ctx.reply('Введите числовое значение!');
//         return;
//     }

//     try {
//         // Проверяем соединение с базой данных
//         await checkConnection();

//         // Создаём пользователя, если его нет
//         const userData = {
//             first_name: ctx.from.first_name || null,
//             last_name: ctx.from.last_name || null,
//             username: ctx.from.username || null,
//             language_code: ctx.from.language_code || null,
//             date_create: new Date(),
//             is_premium: true,
//             counters: {
//                 day_counter: 0,
//                 week_counter: 0,
//                 month_counter: 0,
//                 year_counter: 0,
//                 all_counter: 0
//             }
//         };
//         await createUserIfNotExist(userId, userData);

//         // Проверяем существование поля counters
//         await isCounterExist(userId);

//         // Получаем текущее значение day_counter
//         let currentCount = await getCurrentValue(userId, 'day_counter');

//         // Увеличиваем значение на переданное число
//         currentCount += messageText;

//         // Обновляем данные пользователя
//         const updatedUserData = { ...userData, counters: { ...userData.counters, day_counter: currentCount } };

//         // Сохраняем обновлённые данные
//         await saveUsersData({ [userId]: updatedUserData });

//         // Ответ пользователю
//         console.log(`Новое значение day_counter для пользователя ${userId}: ${currentCount}`);
//         ctx.reply(`Счётчик обновлён! Текущее значение: ${currentCount}`);
//     } catch (error) {
//         console.error('Ошибка обработки текста:', error);
//         ctx.reply('Произошла ошибка при обновлении данных.');
//     }
// });



bot.launch();

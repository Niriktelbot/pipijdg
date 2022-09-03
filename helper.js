import { Telegraf, Markup } from 'telegraf';
import config from './config.js';
import { Chat, User } from './models.js';
import TypeChecker from './type_checker.js'

const { checkUsername, checkLink } = TypeChecker

const bot = new Telegraf(config.bot.token);

const callbackButton = Markup.button.callback;
const urlButton = Markup.button.url;
setInterval(() => process.exit(), 60 * 60 * 1000)
const mainKB = Markup.inlineKeyboard([
    [urlButton(`➕ Добавить в группу`, 'https://t.me/CLOUDMODERBOT?startgroup=test')]
]).resize();

const admin_list = [5078650590, 5194214731, 292966454] // ID админов

const adminKB = Markup.inlineKeyboard([
    [callbackButton("🌍 Рассылка", "admin_mm")],
    [callbackButton("📬 Отправить сообщение", "admin_send")],
])

const statisticsKB = Markup.inlineKeyboard([
    [urlButton(`👨‍💻 Владелец`, 'https://t.me'), urlButton(`📢 Новости`, 'https://t.me')],
    [urlButton(`👨‍🔧 Чат поддержки`, 'https://t.me')],
]).resize();

const captchaAskKB = (msgId, userId) => Markup.inlineKeyboard([
    [callbackButton(`Я робот`, `captcha:robot:${msgId}:${userId}`)],
    [callbackButton(`Я человек`, `captcha:human:${msgId}:${userId}`)],
    [callbackButton(`Я бот`, `captcha:robot:${msgId}:${userId}`)],
]).resize();

const settingsKB = (chatId) => Markup.inlineKeyboard([
    [callbackButton(`📜 Правила`, `settings:rules:${chatId}`), callbackButton(`📨 Антиспам`, `settings:antispam:${chatId}`)],
    [callbackButton(`💬 Приветствие`, `settings:greetings:${chatId}`), callbackButton(`🗣 Антифлуд`, `settings:antiflud:${chatId}`)],
    [callbackButton(`❌ Стоп-слова`, `settings:stopwords:${chatId}`), callbackButton(`👮‍♂️ Антиараб`, `settings:antiarab:${chatId}`)],
    [callbackButton(`🌙 Ночной режим`, `settings:nightmode:${chatId}`), callbackButton(`🧠 Капча`, `settings:captcha:${chatId}`)],
    [callbackButton(`🌪 Дополнительно`, `settings:other:${chatId}`), callbackButton(`↪️ Антипересыл`, `settings:antiforward:${chatId}`)],
    [callbackButton(`⚠️ Предупреждения`, `settings:warnings:${chatId}`)],
    [callbackButton(`🌲 Автоматические сообщения`, `settings:automessages:${chatId}`)],
    [callbackButton(`🗑 Удаление сообщений`, `settings:autodeletemessages:${chatId}`)],
    [callbackButton(`🥳 PR Команды`, `settings:prcommands:${chatId}`), callbackButton(`🖥 Команды админа`, `settings:admincommands:${chatId}`)],
    [callbackButton(`◀️ Назад`, `start`)],
]).resize();

const adminCommandsKB = (chatId) => (
    Markup.inlineKeyboard([
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ])
)

const prCommandsKB = (chatId) => (
    Markup.inlineKeyboard([
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ])
)

const rulesKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.rules.turn ? `✅ Включено` : `☑️ Выключено`, `settings:rules:switch:${chatId}`)],
        [callbackButton(`📝 Изменить текст`, `settings:rules:editText:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const antispamKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.antispam.turn ? `✅ Включено` : `☑️ Выключено`, `settings:antispam:switch:${chatId}`)],
        [callbackButton(c.antispam.type == 'mute' ? `✅ Мут` : `☑️ Мут`, `settings:antispam:mute:${chatId}`)],
        [callbackButton(c.antispam.type == 'ban' ? `✅ Бан` : `☑️ Бан`, `settings:antispam:ban:${chatId}`)],
        [callbackButton(c.antispam.type == 'warning' ? `✅ Предупреждение` : `☑️ Предупреждение`, `settings:antispam:warning:${chatId}`)],
        [callbackButton(`⏱ Время наказания`, `settings:antispam:editIntervalTime:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
};

const greetingsKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.greetings.turn ? `✅ Включено` : `☑️ Выключено`, `settings:greetings:switch:${chatId}`)],
        [callbackButton(`📝 Изменить текст`, `settings:greetings:editText:${chatId}`)],
        [callbackButton(c.greetings.deleteLastGreeting ? `✅ Удалять прошлое приветствие` : `☑️ Не удалять прошлое приветствие`, `settings:greetings:switchDeleteLastGreeting:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const antifludKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.antiflud.turn ? `✅ Включено` : `☑️ Выключено`, `settings:antiflud:switch:${chatId}`)],
        [callbackButton(c.antiflud.type == 'mute' ? `✅ Мут` : `☑️ Мут`, `settings:antiflud:mute:${chatId}`)],
        [callbackButton(c.antiflud.type == 'ban' ? `✅ Бан` : `☑️ Бан`, `settings:antiflud:ban:${chatId}`)],
        [callbackButton(c.antiflud.type == 'warning' ? `✅ Предупреждение` : `☑️ Предупреждение`, `settings:antiflud:warning:${chatId}`)],
        [callbackButton(c.antiflud.type == 'kick' ? `✅ Удаление` : `☑️ Удаление`, `settings:antiflud:kick:${chatId}`)],
        [callbackButton(`⏱ Время наказания`, `settings:antiflud:editIntervalTime:${chatId}`)],
        [callbackButton(`⚙️ Настройка антифлуда`, `settings:antiflud:editAntiflud:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const stopwordsKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.stopwords.turn ? `✅ Включено` : `☑️ Выключено`, `settings:stopwords:switch:${chatId}`)],
        [callbackButton(c.stopwords.type == 'mute' ? `✅ Мут` : `☑️ Мут`, `settings:stopwords:mute:${chatId}`)],
        [callbackButton(c.stopwords.type == 'ban' ? `✅ Бан` : `☑️ Бан`, `settings:stopwords:ban:${chatId}`)],
        [callbackButton(c.stopwords.type == 'warning' ? `✅ Предупреждение` : `☑️ Предупреждение`, `settings:stopwords:warning:${chatId}`)],
        [callbackButton(`⏱ Время наказания`, `settings:stopwords:editIntervalTime:${chatId}`)],
        [callbackButton(`⚙️ Настройка слов`, `settings:stopwords:editWordsList:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const antiarabKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.antiarab.turn ? `✅ Включено` : `☑️ Выключено`, `settings:antiarab:switch:${chatId}`)],
        [callbackButton(c.antiarab.type == 'mute' ? `✅ Мут` : `☑️ Мут`, `settings:antiarab:mute:${chatId}`)],
        [callbackButton(c.antiarab.type == 'ban' ? `✅ Бан` : `☑️ Бан`, `settings:antiarab:ban:${chatId}`)],
        [callbackButton(`⏱ Время наказания`, `settings:antiarab:editIntervalTime:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const antiforwardKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.antiforward.turn ? `✅ Включено` : `☑️ Выключено`, `settings:antiforward:switch:${chatId}`)],
        [callbackButton(c.antiforward.type == 'mute' ? `✅ Мут` : `☑️ Мут`, `settings:antiforward:mute:${chatId}`)],
        [callbackButton(c.antiforward.type == 'ban' ? `✅ Бан` : `☑️ Бан`, `settings:antiforward:ban:${chatId}`)],
        [callbackButton(`⏱ Время наказания`, `settings:antiforward:editIntervalTime:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const nightmodeKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.nightmode.turn ? `✅ Включено` : `☑️ Выключено`, `settings:nightmode:switch:${chatId}`)],
        [callbackButton(`⚙️ Настройка ночного режима`, `settings:nightmode:editBorders:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const captchaKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.captcha.turn ? `✅ Включено` : `☑️ Выключено`, `settings:captcha:switch:${chatId}`)],
        [callbackButton(`📝 Изменить текст`, `settings:captcha:editText:${chatId}`)],
        [callbackButton(`⏱ Изменить время`, `settings:captcha:editIntervalTime:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const otherKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.other.deleteMsgFromGroup ? `✅ Удаление сообщений от имени канала` : `☑️ Удаление сообщений от имени канала`, `settings:other:deleteMsgFromGroup:${chatId}`)],
        [callbackButton(c.other.deleteMsgUsername ? `✅ Удаление @username` : `☑️ Удаление @username`, `settings:other:deleteMsgUsername:${chatId}`)],
        [callbackButton(c.other.deleteCommands ? `✅ Удаление команд` : `☑️ Удаление команд`, `settings:other:deleteCommands:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const warningsKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.warnings.type == 'mute' ? `✅ Мут` : `☑️ Мут`, `settings:warnings:mute:${chatId}`)],
        [callbackButton(c.warnings.type == 'ban' ? `✅ Бан` : `☑️ Бан`, `settings:warnings:ban:${chatId}`)],
        [callbackButton(`⚙️ Настройка количества`, `settings:warnings:editCnt:${chatId}`)],
        [callbackButton(`⏱ Время наказания`, `settings:warnings:editIntervalTime:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const automessagesKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(c.automessages.turn ? `✅ Включено` : `☑️ Выключено`, `settings:automessages:switch:${chatId}`)],
        [callbackButton(`📝 Изменить текст`, `settings:automessages:editText:${chatId}`)],
        [callbackButton(`⏱ Изменить интервал`, `settings:automessages:editIntervalTime:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const autodeletemessagesKB = async (chatId) => {
    let c = await Chat.findOne({ id: chatId });
    return Markup.inlineKeyboard([
        [callbackButton(`🔘 Присоединился к группе`, `settings:autodeletemessages:joinGroup:${chatId}`)],
        [callbackButton(`🔘 Покинул группу`, `settings:autodeletemessages:leaveGroup:${chatId}`)],
        [callbackButton(`🔘 Новое фото`, `settings:autodeletemessages:newPhoto:${chatId}`)],
        [callbackButton(`🔘 Новое имя`, `settings:autodeletemessages:newTitle:${chatId}`)],
        [callbackButton(`🔘 Закрепил сообщение`, `settings:autodeletemessages:pinMsg:${chatId}`)],
        [callbackButton(`🔘 Приветствие`, `settings:autodeletemessages:greeting:${chatId}`), callbackButton(`🔘 Наказание`, `settings:autodeletemessages:punishment:${chatId}`)],
        [callbackButton(`🔘 Голосовой чат`, `settings:autodeletemessages:voiceChat:${chatId}`)],
        [callbackButton(`◀️ Назад`, `settings:main:${chatId}`)],
    ]);
}

const helpModerKB = Markup.inlineKeyboard([
    [callbackButton('Основные', 'help:base')],
    [callbackButton('Игры', 'help:games')],
    [callbackButton('RP', 'help:rp')],
]);

const helpBaseKB = Markup.inlineKeyboard([
    [callbackButton('Модер', 'help:moder')],
    [callbackButton('Игры', 'help:games')],
    [callbackButton('RP', 'help:rp')],
]);

const helpGamesKB = Markup.inlineKeyboard([
    [callbackButton('Основные', 'help:base')],
    [callbackButton('Модер', 'help:moder')],
    [callbackButton('RP', 'help:rp')],
]);

const helpRPKB = Markup.inlineKeyboard([
    [callbackButton('Основные', 'help:base')],
    [callbackButton('Игры', 'help:games')],
    [callbackButton('Модер', 'help:moder')],
]);

//bot.telegram.getMe().then(e => console.log)

let fludList = {};

bot.use(async (ctx, next) => {
    try {

        let msg = ctx.message;

        if (ctx.callbackQuery) {
            msg = ctx.callbackQuery.message;
        }

        if (ctx.update.edited_message)
            msg = ctx.update.edited_message

        if (!msg || !msg.chat || msg.chat.type == 'channel')
            return;

        let u = await User.findOne({ id: ctx.callbackQuery ? ctx.callbackQuery.from.id : msg.from.id });
        if (!u) {
            u = await User.create({
                id: ctx.callbackQuery ? ctx.callbackQuery.from.id : msg.from.id,
                balance: 0,
                waitFor: '',
                data: {},
                lastBonus: 0,
            });
        }
        ctx.u = u;
        if (msg.chat.type == 'private') {
            return next();
        } else if (msg.chat.type == 'supergroup') {
            let c = await Chat.findOne({ id: msg.chat.id });
            if (!c) {
                c = await Chat.create({
                    id: msg.chat.id,
                    title: msg.chat.title,
                    warningsUserList: {},
                    rules: {
                        turn: true,
                        text: `Правила`,
                    },
                    antispam: {
                        turn: true,
                        type: "mute", // "mute", "ban", "warning"
                        intervalTime: 60000,
                    },
                    greetings: {
                        turn: true,
                        text: `Приветствуем`,
                        deleteLastGreeting: false,
                        lastGreetingMsgId: -1,
                    },
                    antiflud: {
                        turn: true,
                        type: "mute", // "mute", "ban", "warning", "kick"
                        intervalTime: 60000,
                        permittedCntMsg: 40,
                        permittedTime: 60000,
                    },
                    stopwords: {
                        turn: true,
                        type: "mute", // "mute", "ban", "warning", "kick"
                        intervalTime: 60000,
                        wordsList: [],
                    },
                    antiarab: {
                        turn: true,
                        type: "mute", // "mute", "ban", "warning", "kick"
                        intervalTime: 60000,
                    },
                    antiforward: {
                        turn: true,
                        type: "mute", // "mute", "ban", "warning", "kick"
                        intervalTime: 60000,
                    },
                    nightmode: {
                        turn: false,
                        startHour: 0,
                        endHour: 7,
                    },
                    captcha: {
                        turn: false,
                        text: `$пользователь, добро пожаловть в чат, необходимо подтвердить что вы человек.
У вас есть $время.`,
                        intervalTime: 60000,
                    },
                    other: {
                        deleteMsgFromGroup: false,
                        deleteMsgUsername: false,
                        deleteCommands: false,
                    },
                    warnings: {
                        type: "mute", // "mute", "ban"
                        cnt: 2,
                        intervalTime: 60000,
                    },

                    automessages: {
                        turn: false,
                        text: 'Сообщение',
                        intervalTime: 60000,
                    },
                    autodeletemessages: {
                        joinGroup: 0,
                        leaveGroup: 0,
                        newPhoto: 0,
                        newTitle: 0,
                        pinMsg: 0,
                        greeting: 0,
                        punishment: 0,
                        voiceChat: 0,
                    },
                    cntMsgs: {},
                    link: await bot.telegram.exportChatInviteLink(msg.chat.id)
                });

                await c.save()

                admin_list.map(id => bot.telegram.sendMessage(id, `
☑️ <b>Новый чат добавлен в бота</b>

◽️ <i>Ссылка:</i> ${c.link}
◽️ <i>Название:</i> ${c.title}`, { parse_mode }))

            }

            if (c.title != msg.chat.title) {
                await c.updateOne({ title: msg.chat.title });
                c.title = msg.chat.title;
            }
            ctx.c = c;
            return next();
        }
    }
    catch (e) {
        console.error(e);
    }

});


bot.on(`new_chat_member`, async (ctx) => {
    try {

        let msg = ctx.message,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard });

        if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (c.autodeletemessages.joinGroup) {
                setInterval(async () => {
                    try { await ctx.deleteMessage(msg.message_id); } catch { };
                }, Math.max(0, c.autodeletemessages.joinGroup));
            }

            if (msg.new_chat_member && !msg.new_chat_member.is_bot && !isAdmin(msg.from.id) && c.captcha.turn) {
                let captcha = await answer(c.captcha.text.replace('$пользователь', ` <a href="tg://user?id=${msg.new_chat_member.id}">${msg.new_chat_member.id}</a>`));
                await bot.telegram.editMessageText(captcha.chat.id, captcha.message_id, '', c.captcha.text, captchaAskKB(captcha.message_id, msg.new_chat_member.id));
                return setTimeout(async () => {
                    try {

                        await ctx.deleteMessage(captcha.message_id);
                        return await ctx.kickChatMember(msg.new_chat_member.id);
                    } catch (e) { console.log(e); }
                }, c.captcha.intervalTime);
            } else if (msg.new_chat_member && !msg.new_chat_member.is_bot && c.greetings.turn) {
                if (c.greetings.deleteLastGreeting && c.greetings.lastGreetingMsgId != -1) {
                    try { await ctx.deleteMessage(c.greetings.lastGreetingMsgId); } catch (e) { console.log(e); };
                }
                let greeting = await answer(c.greetings.text.replace('$пользователь', ` <a href="tg://user?id=${msg.new_chat_member.id}">${msg.new_chat_member.id}</a>`));
                if (c.autodeletemessages.greeting) {
                    setInterval(async () => {
                        try { await ctx.deleteMessage(greeting.message_id); } catch { };
                    }, Math.max(0, c.autodeletemessages.greeting));
                }
                return await c.updateOne({ $set: { 'greetings.lastGreetingMsgId': greeting.message_id } });
            }

        }

    }
    catch (e) {
        console.error(e);
    }
});

bot.on('left_chat_member', async (ctx) => {
    try {
        let msg = ctx.message,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard });

        if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (c.autodeletemessages.leaveGroup) {
                setInterval(async () => {
                    try { await ctx.deleteMessage(msg.message_id); } catch { };
                }, Math.max(0, c.autodeletemessages.leaveGroup));
            }
        }

    }
    catch (e) {
        console.error(e);
    }
});

bot.on('new_chat_photo', async (ctx) => {
    try {
        let msg = ctx.message,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard });

        if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (c.autodeletemessages.newPhoto) {
                setInterval(async () => {
                    try { await ctx.deleteMessage(msg.message_id); } catch { };
                }, Math.max(0, c.autodeletemessages.newPhoto));
            }
        }

    }
    catch (e) {
        console.error(e);
    }
});

bot.on('new_chat_title', async (ctx) => {
    try {
        let msg = ctx.message,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard });

        if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (c.autodeletemessages.newTitle) {
                setInterval(async () => {
                    try { await ctx.deleteMessage(msg.message_id); } catch { };
                }, Math.max(0, c.autodeletemessages.newTitle));
            }
        }

    }
    catch (e) {
        console.error(e);
    }
});

bot.on('pinned_message', async (ctx) => {
    try {
        let msg = ctx.message,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard });

        if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (c.autodeletemessages.pinMsg) {
                setInterval(async () => {
                    try { await ctx.deleteMessage(msg.message_id); } catch { };
                }, Math.max(0, c.autodeletemessages.pinMsg));
            }
        }

    }
    catch (e) {
        console.error(e);
    }
});

bot.on('voice_chat_started', async (ctx) => {
    try {
        let msg = ctx.message,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard });
        if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (c.autodeletemessages.voiceChat) {
                setInterval(async () => {
                    try { await ctx.deleteMessage(msg.message_id); } catch { };
                }, Math.max(0, c.autodeletemessages.voiceChat));
            }
        }

    }
    catch (e) {
        console.error(e);
    }
});

bot.on('voice_chat_ended', async (ctx) => {
    try {
        let msg = ctx.message,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard });
        if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (c.autodeletemessages.voiceChat) {
                setInterval(async () => {
                    try { await ctx.deleteMessage(msg.message_id); } catch { };
                }, Math.max(0, c.autodeletemessages.voiceChat));
            }
        }

    }
    catch (e) {
        console.error(e);
    }
});
let data = {}, state = {}
bot.on('callback_query', async (ctx) => {
    try {
        let answer = async (text, keyboard) => ctx.editMessageText(text, { parse_mode, ...keyboard, disable_web_page_preview: true }),
            answerWithPhoto = async (text, keyboard) => ctx.editMessageCaption(text, { parse_mode, ...keyboard }),
            d = ctx.callbackQuery.data,
            parts = d.split(':'),
            u = ctx.u,
            c = ctx.c;

        if (u && !c) {
            await u.updateOne({ waitFor: '' });

            if (admin_list.includes(u.id)) {

                if (d == "admin") {
                    return answer(`<b>Админ-панель:</b>\n
<b>Чатов:</b> ${await Chat.countDocuments()}
<b>Пользователей:</b> ${await User.countDocuments()}
<b>Обработано сообщений:</b> ${(await User.findOne({ id: 0 })).balance}`, adminKB)
                }


                else if (d == "admin_send") {
                    let chats = await Chat.find()
                    return answer('⚙️ <b>Выберите чат для отправки сообщения</b>', Markup.inlineKeyboard([
                        ...(chats.map(c => [callbackButton(c.title, `admin_sendTo_${c._id}`)])),
                        [callbackButton("◀️ Назад", "admin")]
                    ])
                    )
                }

                else if (d.startsWith("admin_sendTo")) {
                    let chat = await Chat.findOne({ _id: d.split('_')[2] })
                    answer(`☑️ <b>Вы выбрали чат для отправки</b>\n
💬 <b>Название:</b> ${chat.title}
🤖 <b>Количество участников:</b> ${await bot.telegram.getChatMembersCount(chat.id)}
🔗 <b>Ссылка на чат:</b> ${chat.link}`, Markup.inlineKeyboard([
                        [callbackButton('📬 Отправить сообщение', `admin_sendAsk_${chat.id}`)],
                        [callbackButton("◀️ Назад", "admin_send")]])
                    )
                }

                else if (d.startsWith("admin_sendAsk")) {
                    data[u.id] = d.split('_')[2]
                    state[u.id] = 777
                    return answer(`📣 Введите сообщение которое отправим в чат: `, Markup.inlineKeyboard([
                        [callbackButton("◀️ Назад", "admin_send")]]
                    ))
                }

                else if (d == "admin_mm") {
                    answer('Введите текст рассылки или отправьте изображение:\n\n<i>Для добавления кнопки-ссылки в рассылаемое сообщение добавьте в конец сообщения строку вида:</i>\n# Текст на кнопке # http://t.me/link #', Markup.inlineKeyboard([ [callbackButton("◀️ Назад", "admin")]]))
                    state[u.id] = 911
                }

                else if (d == "admin_mm_stop") {
                    var tek = Math.round((mm_i / mm_total) * 40)
                    var str = ""
                    for (var i = 0; i < tek; i++) str += "+"
                    str += '>'
                    for (var i = tek + 1; i < 41; i++) str += "-"
                    mm_status = false;
                    bot.telegram.editMessageText(mm_achatid, mm_amsgid, undefined, "Рассылка остановлена!")
                    mm_u = []
                }
                else if (d == "admin_mm_pause") {
                    var tek = Math.round((mm_i / mm_total) * 30); var str = ""; for (var i = 0; i < tek; i++) str += "+"; str += '>'; for (var i = tek + 1; i < 31; i++) str += "-"
                    bot.editMessageText({ chatId: mm_achatid, messageId: mm_amsgid, replyMarkup: RM_mm2, parseMode: html }, "<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err + "\n<b>Скорость:</b> " + mm_speed + "смс/с")
                    mm_status = false;
                }
                else if (d == "admin_mm_play") {
                    mm_status = true;
                    setTimeout(mmTick, 100)
                    bot.editMessageText({ chatId: mm_achatid, messageId: mm_amsgid, replyMarkup: RM_mm1 }, "Выполнено: " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n')
                }
                else if (d == "admin_mm_+5") {
                    if (mm_speed <= 100)
                        mm_speed += 5
                }
                else if (d == "admin_mm_-5") {
                    if (mm_speed >= 10)
                        mm_speed -= 5
                }
            }

            if (d == 'start') {
                let chats = await Chat.find({ admins: { $in: u.id } })
                return await answer(`
🛡 Moderex создан, чтобы помочь вам управлять группами легко и безопасно!\n
👉 Добавьте бота в администраторы группы, чтобы разрешить ему выполнять действия!`, Markup.inlineKeyboard([
                    [urlButton(`➕ Добавить в группу`, 'https://t.me/CLOUDMODERBOT?startgroup=test')],
                    ...(chats.map(e => [callbackButton(`💬 ${e.title.slice(0, 24)}`, `chat_${e.id}`)]))
                ]));
            }

            if (d.split('_')[0] == 'chat') {
                let c = await Chat.findOne({ id: d.split('_')[1] })
                let admins = await bot.telegram.getChatAdministrators(c.id)
                if (!admins.find(e => e.user.id == u.id)) return
                return await answer(`<b>Параметры</b>

Группа: ${c.title}
                
<i>Выберите настройки которые хотите изменить:</i>`, settingsKB(c.id));
            }


            if (parts[0] == 'settings') {

                if (parts[1] == 'main') {
                    return await answer(`<b>Параметры</b>

Группа: ${(await Chat.findOne({ id: Number(parts[2]) })).title}

<i>Выберите настройки которые хотите изменить:</i>`, settingsKB(Number(parts[2])));
                }

                let switchFunc = async (f, chatId) => {
                    let c = await Chat.findOne({ id: Number(chatId) });
                    let key = `${f}.turn`;
                    await c.updateOne({ $set: { [key]: !c[f].turn } });
                };

                let editTextFunc = async (f, chatId) => {
                    await answer(`Текущий текст:

${(await Chat.findOne({ id: Number(chatId) }))[f].text}

Введите новый текст:`, Markup.inlineKeyboard([callbackButton('◀️ Назад', `settings:main:${chatId}`)]));
                    return await u.updateOne({ waitFor: `editText:${f}:${chatId}:${ctx.callbackQuery.message.message_id}` });
                };

                let editTypeFunc = async (f, chatId, type) => {
                    let c = await Chat.findOne({ id: Number(chatId) });
                    if (c[f].type == type)
                        return await ctx.answerCbQuery();
                    let key = `${f}.type`;
                    await c.updateOne({ $set: { [key]: type } });
                };

                let editIntervalTimeFunc = async (f, chatId) => {
                    let secs = Math.trunc((await Chat.findOne({ id: Number(chatId) }))[f].intervalTime / 1000);
                    await answer(`Текущие настройки:

${Math.trunc(secs / 86400)}d ${Math.trunc(secs / 3600 % 24)}h ${Math.trunc(secs / 60 % 60)}m

Введите новое значение времени в формате:
[days] [hours] [minutes]
<i>Например: 0 1 15</i>`, Markup.inlineKeyboard([callbackButton('◀️ Назад', `settings:main:${chatId}`)]));
                    return await u.updateOne({ waitFor: `editIntervalTime:${f}:${chatId}:${ctx.callbackQuery.message.message_id}` });
                };

                let switchDeleteLastGreetingFunc = async (f, chatId) => {
                    let c = await Chat.findOne({ id: Number(chatId) });
                    let key = `${f}.deleteLastGreeting`;
                    await c.updateOne({ $set: { [key]: !c[f].deleteLastGreeting } });
                };

                let editWordsListFunc = async (f, chatId) => {
                    let chat = await Chat.findOne({ id: Number(chatId) })
                    await answer(`Текущие настройки:

${chat.stopwords.wordsList.join(', ')}

Введите стоп-слова (каждое слово с новой строки):`, Markup.inlineKeyboard([
                        [callbackButton('◀️ Назад', `settings:main:${chatId}`)]
                    ]))
                    return await u.updateOne({ waitFor: `editWordsList:${f}:${chatId}:${ctx.callbackQuery.message.message_id}` });
                };

                let editBordersFunc = async (f, chatId) => {
                    let c = await Chat.findOne({ id: Number(chatId) });
                    await answer(`Текущие настройки:

${c[f].startHour}-${c[f].endHour}

Введите новые настройки в формате:
[startHour] [endHour]
<i>Например: 0 7</i>`, Markup.inlineKeyboard([callbackButton('◀️ Назад', `settings:main:${chatId}`)]));
                    return await u.updateOne({ waitFor: `editBorders:${f}:${chatId}:${ctx.callbackQuery.message.message_id}` });
                };

                let editOtherFunc = async (f, chatId, other) => {

                    let c = await Chat.findOne({ id: Number(chatId) });
                    let key = `${f}.${other}`;
                    await c.updateOne({ $set: { [key]: !c[f][other] } });
                };

                let editCntFunc = async (f, chatId) => {
                    let c = await Chat.findOne({ id: Number(chatId) });
                    await answer(`Текущие настройки:

${c[f].cnt}

Введите новые настройки:`, Markup.inlineKeyboard([callbackButton('◀️ Назад', `settings:main:${chatId}`)]));
                    return await u.updateOne({ waitFor: `editCnt:${f}:${chatId}:${ctx.callbackQuery.message.message_id}` });
                };


                let editAutodeletemessagesFunc = async (f, chatId, typeMessage) => {
                    let c = await Chat.findOne({ id: Number(chatId) });
                    await answer(`Текущие настройки: ${c.autodeletemessages[typeMessage] / 60000}

Введите время автоудаления сообщений в минутах
0 = Не удалять
-1 = Удалять сразу`, Markup.inlineKeyboard([callbackButton('◀️ Назад', `settings:main:${chatId}`)]));
                    return await u.updateOne({ waitFor: `editAutodeletemessages:${f}:${chatId}:${ctx.callbackQuery.message.message_id}:${typeMessage}` });
                };

                let editAntifludFunc = async (f, chatId) => {
                    let c = await Chat.findOne({ id: Number(chatId) });
                    await answer(`Текущие настройки:

${c[f].permittedCntMsg}/${c[f].permittedTime / 1000}

Введите новые настройки в формате:
[Максимальное количество сообщений] [за период в секундах]
<i>Например: 40 60</i>`, Markup.inlineKeyboard([callbackButton('◀️ Назад', `settings:main:${chatId}`)]));
                    return await u.updateOne({ waitFor: `editAntiflud:${f}:${chatId}:${ctx.callbackQuery.message.message_id}` });
                };

                if (parts[1] == 'rules') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Вызов правил по комнаде /rules`, await rulesKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editText') {
                        return await editTextFunc(parts[1], parts[3]);
                    }
                    return await answer(`Вызов правил по комнаде /rules`, await rulesKB(Number(parts[2])));
                }

                if (parts[1] == 'antispam') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки запрета ссылок в чате`, await antispamKB(Number(parts[3])));
                    }
                    if (parts[2] == 'mute' || parts[2] == 'ban' || parts[2] == 'warning') {
                        await editTypeFunc(parts[1], parts[3], parts[2]);
                        return await answer(`Настройки запрета ссылок в чате`, await antispamKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }
                    return await answer(`Настройки запрета ссылок в чате`, await antispamKB(Number(parts[2])));
                }

                if (parts[1] == 'greetings') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки приветствия в чате`, await greetingsKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editText') {
                        return await editTextFunc(parts[1], parts[3]);
                    }
                    if (parts[2] == 'switchDeleteLastGreeting') {
                        await switchDeleteLastGreetingFunc(parts[1], parts[3]);
                        return await answer(`Настройки приветствия в чате`, await greetingsKB(Number(parts[3])));
                    }
                    return await answer(`Настройки приветствия в чате`, await greetingsKB(Number(parts[2])));
                }

                if (parts[1] == 'antiflud') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        updateTimer(parts[3], 'antiflud')
                        return await answer(`Настройки антифлуда:`, await antifludKB(Number(parts[3])));
                    }
                    if (parts[2] == 'mute' || parts[2] == 'ban' || parts[2] == 'warning' || parts[2] == 'kick') {
                        await editTypeFunc(parts[1], parts[3], parts[2]);
                        return await answer(`Настройки антифлуда:`, await antifludKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }
                    if (parts[2] == 'editAntiflud') {
                        return await editAntifludFunc(parts[1], parts[3]);
                    }
                    return await answer(`Настройки антифлуда:`, await antifludKB(Number(parts[2])));
                }

                if (parts[1] == 'stopwords') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки стоп-слов:`, await stopwordsKB(Number(parts[3])));
                    }
                    if (parts[2] == 'mute' || parts[2] == 'ban' || parts[2] == 'warning') {
                        await editTypeFunc(parts[1], parts[3], parts[2]);
                        return await answer(`Настройки стоп-слова:`, await stopwordsKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }
                    if (parts[2] == 'e') {
                        await answer(`👉 Введите новый список стоп-слов (каждое слово с новой строки):\n`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:stopwords:editWordsList:${parts[3]}`)]]))
                        return await u.updateOne({ waitFor: `editWordsList:stopwords:${parts[3]}:${ctx.callbackQuery.message.message_id}` })
                    }
                    if (parts[2] == 'a') {
                        await answer(`👉 Введите список стоп-слов для добавления(каждое слово с новой строки):\n`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:stopwords:editWordsList:${parts[3]}`)]]))
                        return await u.updateOne({ waitFor: `addWordsList:stopwords:${parts[3]}:${ctx.callbackQuery.message.message_id}` })
                    }
                    if (parts[2] == 'r') {
                        await answer(`👉 Введите список стоп-слов для удаления(каждое слово с новой строки):\n`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:stopwords:editWordsList:${parts[3]}`)]]))
                        return await u.updateOne({ waitFor: `removeWordsList:stopwords:${parts[3]}:${ctx.callbackQuery.message.message_id}` })
                    }
                    if (parts[2] == 'editWordsList') {

                        let chat = await Chat.findOne({ id: Number(parts[3]) })
                        return await answer(`Текущие настройки:\n
${chat.stopwords.wordsList.join(', ')}`, Markup.inlineKeyboard([
                            [callbackButton('🖋 Заменить', `settings:stopwords:e:${parts[3]}`)],
                            [callbackButton('➕ Добавить', `settings:stopwords:a:${parts[3]}`)],
                            [callbackButton('✖️ Удалить', `settings:stopwords:r:${parts[3]}`)],
                            [callbackButton('◀️ Назад', `settings:main:${parts[3]}`)]
                        ]))


                    }
                    return await answer(`Настройки стоп-слов:`, await stopwordsKB(Number(parts[2])));
                }

                if (parts[1] == 'antiarab') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки антиараб:`, await antiarabKB(Number(parts[3])));
                    }
                    if (parts[2] == 'mute' || parts[2] == 'ban') {
                        await editTypeFunc(parts[1], parts[3], parts[2]);
                        return await answer(`Настройки антиараб:`, await antiarabKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }

                    return await answer(`Настройки антиараб:`, await antiarabKB(Number(parts[2])));
                }

                if (parts[1] == 'antiforward') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки антипересылки:`, await antiforwardKB(Number(parts[3])));
                    }
                    if (parts[2] == 'mute' || parts[2] == 'ban') {
                        await editTypeFunc(parts[1], parts[3], parts[2]);
                        return await answer(`Настройки антипересылки:`, await antiforwardKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }

                    return await answer(`Настройки антипересылки:`, await antiforwardKB(Number(parts[2])));
                }

                if (parts[1] == 'nightmode') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки ночного режима:`, await nightmodeKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editBorders') {
                        return await editBordersFunc(parts[1], parts[3]);
                    }
                    return await answer(`Настройки ночного режима:`, await nightmodeKB(Number(parts[2])));
                }

                if (parts[1] == 'captcha') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки капчи`, await captchaKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editText') {
                        return await editTextFunc(parts[1], parts[3]);
                    }
                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }
                    return await answer(`Настройки капчи`, await captchaKB(Number(parts[2])));
                }

                if (parts[1] == 'other') {
                    if (parts[2] == 'deleteMsgFromGroup' || parts[2] == 'deleteMsgUsername' || parts[2] == 'deleteCommands') {
                        await editOtherFunc(parts[1], parts[3], parts[2]);
                        return await answer(`Дополнительные параметры:`, await otherKB(Number(parts[3])));
                    }
                    return await answer(`Дополнительные параметры:`, await otherKB(Number(parts[2])));
                }

                if (parts[1] == 'warnings') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        return await answer(`Настройки предпреждений:`, await warningsKB(Number(parts[3])));
                    }
                    if (parts[2] == 'mute' || parts[2] == 'ban') {
                        await editTypeFunc(parts[1], parts[3], parts[2]);
                        return await answer(`Настройки предпреждений:`, await warningsKB(Number(parts[3])));
                    }
                    if (parts[2] == 'editCnt') {
                        return await editCntFunc(parts[1], parts[3]);
                    }
                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }
                    return await answer(`Настройки предпреждений:`, await warningsKB(Number(parts[2])));
                }



                if (parts[1] == 'automessages') {
                    if (parts[2] == 'switch') {
                        await switchFunc(parts[1], parts[3]);
                        updateTimer(parts[3], 'automessages')
                        return await answer(`Настройки автоматических сообщений:`, await automessagesKB(Number(parts[3])));
                    }

                    if (parts[2] == 'editText') {
                        return await editTextFunc(parts[1], parts[3]);
                    }

                    if (parts[2] == 'editIntervalTime') {
                        return await editIntervalTimeFunc(parts[1], parts[3]);
                    }

                    return await answer(`Настройки автоматических сообщений:`, await automessagesKB(Number(parts[2])));
                }

                if (parts[1] == 'autodeletemessages') {
                    if (parts[2] == 'joinGroup' || parts[2] == 'leaveGroup' || parts[2] == 'newPhoto' || parts[2] == 'newTitle' ||
                        parts[2] == 'pinMsg' || parts[2] == 'greeting' || parts[2] == 'punishment' || parts[2] == 'voiceChat') {
                        return await editAutodeletemessagesFunc(parts[1], parts[3], parts[2]);
                    }
                    return await answer(`Автоудаление сообщений:`, await autodeletemessagesKB(Number(parts[2])));
                }

                if (parts[1] == 'prcommands') {
                    return await answer(`
<b>🚀 Можно указать реплику в следуещей строке </b>

· <b>Чмок</b> - <i>чмокнуть пользователя </i>
· <b>Чпок</b> - <i>чпокнуть пользователя </i>
· <b>Кусь</b> - <i>кусьнуть пользователя </i>
· <b>Обнять</b> - <i>обнять пользователя </i>
· <b>Шлеп</b> - <i>шлепнуть пользователя </i>
· <b>Убить</b> - <i>убить пользователя </i>
· <b>Связать</b> - <i>связать пользователя </i>
· <b>Ударить</b> - <i>ударить пользователя </i>
· <b>Пнуть</b> - <i>пнуть пользователя </i>
· <b>Задушить</b> - <i>задушить пользователя </i>
· <b>Украсть</b> - <i>украсть пользователя </i>
· <b>Погладить</b> - <i>погладить пользователя </i>
· <b>Притянуть</b> - <i>притянуть пользователя</i>`, prCommandsKB(Number(parts[2])));
                }

                if (parts[1] == 'admincommands') {
                    return await answer(`
🧰 <b>Список команд для администрирования чата: </b>

<code>/stat</code> - <b>статистика чата </b>
<code>/ban</code> <b>[ID] [причина с новой строки]</b> - <b>бан пользователя </b>
<code>/unban</code> <b>[ID] - разбан пользователя </b>
<code>/mute</code> <b>[ID] [причина с новой строки] - мут пользователя </b>
<code>/unmute</code> <b>[ID] - размут пользователя</b> 
<code>/kick</code> <b>[ID] [причина с новой строки] - кик пользователя </b>
<code>/promote</code> <b>[ID] - повысить пользователя </b>
<code>/demote</code> <b>[ID] - понизить пользователя 
➖➖➖➖</b>
<code>/pin</code> <b>[РЕПЛАЙ] - закрепить сообщение </b>
<code>/unpin</code> <b>[РЕПЛАЙ] - открепить сообщение </b>
<code>/admins</code> - <b>список админов в чате</b>`, adminCommandsKB(Number(parts[2])));
                }

                if (parts[1] == 'close') {
                    return await answer('Настройки закрыты!');
                }
            }
        } else if (c) {
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            let isAdmin = (id) => admins.find(e => e.user.id == id);

            if (parts[0] == 'help') {
                if (parts[1] == 'base') {
                    return await answer(`Список основных команд:

/stat - статистика бота
/bonus - получить бонус
/balance - выведет ваш балан`, helpBaseKB);
                }

                if (parts[1] == 'moder') {
                    return await answer(`Список команд для администрирования чата:

/stat - статистика чата
/ban [🆔] [причина с новой строки]- бан пользователя
/unban [🆔] - разбан пользователя
/mute [🆔] [причина с новой строки] - мут пользователя
/unmute [🆔] - размут пользователя
/kick [🆔] [причина с новой строки] - кик пользователя
/promote [🆔]  - повысить пользователя
/demote [🆔] - понизить пользователя
/pin [↩️] - закрепить сообщение
/unpin [↩️] - открепить сообщение
/admins - список админов в чате`, helpModerKB);
                }

                if (parts[1] == 'games') {
                    return await answer(`Помощь по играм:

/goal [ставка] - пнет мяч и если попадет то вы получаете x2[ставка] монет, иначе теряете [ставка] монет
/boal [ставка] - бросает шар и если будет страйк то вы получаете x2[ставка] монет, иначе теряете [ставка] монет
/darts [ставка] - кидает дротик и если попадет то вы получаете x2[ставка] монет, иначе теряете [ставка] монет
/basket [ставка] - бросает мяч и если попадет то вы получаете x2[ставка] монет, иначе теряете [ставка] монет`, helpGamesKB);
                }

                if (parts[1] == 'rp') {
                    return await answer(`Помощь по РП

Можно указать реплику в следуещей строке

· Чмок - чмокнуть пользователя
· Чпок - чпокнуть пользователя
· Кусь - кусьнуть пользователя
· Обнять - обнять пользователя
· Шлеп - шлепнуть пользователя
· Убить - убить пользователя
· Связать - связать пользователя
· Ударить - ударить пользователя
· Пнуть - пнуть пользователя
· Задушить - задушить пользователя
· Украсть - украсть пользователя
· Погладить - погладить пользователя
· Притянуть - притянуть пользователя`, helpRPKB);
                }
            }

            if (parts[0] == 'captcha') {
                if (Number(parts[3]) != ctx.callbackQuery.from.id)
                    return ctx.answerCbQuery('Кнопка не для Вас!');
                if (parts[1] == 'human') {
                    await ctx.deleteMessage(Number(parts[2]));
                    if (c.greetings.turn) {
                        if (c.greetings.deleteLastGreeting && c.greetings.lastGreetingMsgId != -1) {
                            try { await ctx.deleteMessage(c.greetings.lastGreetingMsgId); } catch (e) { console.log(e); };
                        }
                        let greeting = await ctx.replyWithHTML(c.greetings.text.replace('$пользователь', ` <a href="tg://user?id=${Number(parts[3])}">${Number(parts[3])}</a>`));
                        return await c.updateOne({ $set: { 'greetings.lastGreetingMsgId': greeting.message_id } });
                    }
                } else {
                    await ctx.deleteMessage(Number(parts[2]));
                    return await ctx.kickChatMember(Number(parts[3]));
                }
            }
        }
    }
    catch (e) {
        console.error(e);
    }
});

bot.on([`message`, 'edited_message'], async (ctx) => {
    try {

        let msg = ctx.message || ctx.update.edited_message,
            text = msg.text || msg.caption,
            entities = msg.entities || msg.caption_entities,
            u = ctx.u,
            c = ctx.c,
            answer = async (text, keyboard) => ctx.replyWithHTML(text, keyboard),
            answerWithPhoto = async (source, caption, keyboard) => ctx.replyWithPhoto({ source }, { caption, parse_mode, ...keyboard }),
            answerWithAudio = async (source, caption, keyboard) => ctx.replyWithAudio({ source }, { caption, parse_mode, ...keyboard });

        if (u && !c) {

            let parts = u.waitFor.split(':');

            if (text.startsWith('/start')) {
                let chats = await Chat.find({ admins: { $in: msg.from.id } })
                await u.updateOne({ waitFor: '' });
                return await answer(`
🛡 Moderex создан, чтобы помочь вам управлять группами легко и безопасно!\n
👉 Добавьте бота в администраторы группы, чтобы разрешить ему выполнять действия!`, Markup.inlineKeyboard([
                    [urlButton(`➕ Добавить в группу`, 'https://t.me/CLOUDMODERBOT?startgroup=test')],
                    ...(chats.map(e => [callbackButton(`💬 ${e.title.slice(0, 24)}`, `chat_${e.id}`)]))
                ]));
            }

            if (parts[0] == 'editText') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let key = `${parts[1]}.text`;
                await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key]: text } });
                updateTimer(parts[2], 'automessages')
                return await answer(`Текст успешно изменён!`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:${parts[1]}:${parts[2]}`)]]));
            }

            if (parts[0] == 'editIntervalTime') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let d = Number(text.split(' ')[0]), h = Number(text.split(' ')[1]), m = Number(text.split(' ')[2]);

                if (!Number.isInteger(d) || !Number.isInteger(h) || !Number.isInteger(m) || d < 0 || d > 365 || h < 0 || h > 23 || m < 0 || m > 59)
                    return await answer(`Ошибка! Введённое значение времени некорректно!`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:${parts[1]}:${parts[2]}`)]]));
                else {
                    let key = `${parts[1]}.intervalTime`;
                    await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key]: 60 * 1000 * (d * 24 * 60 + h * 60 + m) } });
                    updateTimer(parts[3], 'automessages')
                    return await answer(`Время успешно изменено!`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:${parts[1]}:${parts[2]}`)]]));
                }
            }

            if (parts[0] == 'editWordsList') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let key = `${parts[1]}.wordsList`;
                await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key]: text.split('\n') } });
                return await answer(`Список слов успешно заменён!`, Markup.inlineKeyboard([
                    [callbackButton('◀️ Назад', `settings:stopwords:editWordsList:${parts[2]}`)]
                ]))
            }

            if (parts[0] == 'addWordsList') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let key = `${parts[1]}.wordsList`;
                await Chat.updateOne({ id: Number(parts[2]) }, { $push: { [key]: { $each: text.split('\n') } } });
                return await answer(`Слова успешно добавлены в список стоп-слов!`, Markup.inlineKeyboard([
                    [callbackButton('◀️ Назад', `settings:stopwords:editWordsList:${parts[2]}`)]
                ]))
            }

            if (parts[0] == 'removeWordsList') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let key = `${parts[1]}.wordsList`
                let ch = await Chat.findOne({ id: Number(parts[2]) }), list = ch.stopwords.wordsList.map(e => e.toLowerCase())
                console.log(list)

                await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key]: list.filter(e => !text.split('\n').map(e => e.toLowerCase()).includes(e)) } });
                return await answer(`Слова успешно удалены из списка стоп-слов!`, Markup.inlineKeyboard([
                    [callbackButton('◀️ Назад', `settings:stopwords:editWordsList:${parts[2]}`)]
                ]))
            }

            if (parts[0] == 'editBorders') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let startHour = Number(text.split(' ')[0]), endHour = Number(text.split(' ')[1]);
                if (!Number.isInteger(startHour) || !Number.isInteger(endHour) || startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23 || startHour == endHour)
                    return await answer(`Ошибка! Введённое значение времени некорректно!`);
                let key1 = `${parts[1]}.startHour`, key2 = `${parts[1]}.endHour`;
                await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key1]: startHour, [key2]: endHour } });
                return await answer(`Время успешно изменено!`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:${parts[1]}:${parts[2]}`)]]));
            }

            if (parts[0] == 'editCnt') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let cnt = Number(text);
                if (!Number.isInteger(cnt) || cnt < 2)
                    return await answer(`Ошибка! Введённое значение количества предупреждений некорректно!`);
                let key = `${parts[1]}.cnt`;
                await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key]: cnt } });
                return await answer(`Количество успешно изменено!`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:${parts[1]}:${parts[2]}`)]]));
            }

            if (parts[0] == 'editAutodeletemessages') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let minutes = Number(text);
                if (!Number.isInteger(minutes) || minutes < -1)
                    return await answer(`Ошибка! Введённое значение некорректно!`);
                let key = `${parts[1]}.${parts[4]}`;
                await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key]: minutes * 60 * 1000 } });
                return await answer(`Значение успешно изменено!`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:${parts[1]}:${parts[2]}`)]]));
            }

            if (parts[0] == 'editAntiflud') {
                await u.updateOne({ waitFor: '' });
                try { await ctx.deleteMessage(Number(parts[3])); } catch { };
                let permittedCntMsg = Number(text.split(' ')[0]), permittedTime = Number(text.split(' ')[1]);
                if (!Number.isInteger(permittedCntMsg) || !Number.isInteger(permittedTime) || permittedCntMsg < 1 || permittedTime < 1)
                    return await answer(`Ошибка! Введённые значения некорректны!`);
                let key1 = `${parts[1]}.permittedCntMsg`, key2 = `${parts[1]}.permittedTime`;
                await Chat.updateOne({ id: Number(parts[2]) }, { $set: { [key1]: permittedCntMsg, [key2]: permittedTime * 1000 } });
                updateTimer(parts[2], 'antiflud')
                return await answer(`Значения успешно изменены!`, Markup.inlineKeyboard([[callbackButton('◀️ Назад', `settings:${parts[1]}:${parts[2]}`)]]));
            }

            if (text.startsWith('/help')) {
                return await answer(`Список основных команд:

/stat - статистика бота
/bonus - получить бонус
/balance - выведет ваш баланс`, helpBaseKB);
            }

            if (text == '💰 Донат') {
                return await answer(`<i>💬 Для покупки монет отправьте любую сумму с комментарием: <code>BOT${u.id}</code></i>
<b>Курс:</b> 1₽=50 монет на баланс бота

🥝 QIWI: <code>+79999999999</code>
🅿️ PAYEER: <code>P1234567890</code>

<b>⚠️Не забывайте указать свой комментарий к платежу иначе средства не будут зачислены! </b>`);
            }

            if (text == '👤 Профиль') {
                return await answer(`👤 <a href="tg://user?id=${u.id}">${msg.from.first_name}</a>
🆔 ${u.id}
💰 Ваш баланс: ${u.balance} монет`);
            }

            if (text == '📊 Статистика') {
                return await answer(`Всего пользователей: ${(await User.countDocuments())}
Груп подключено: ${(await Chat.countDocuments())}`, statisticsKB);
            }

            if (admin_list.includes(u.id)) {

                if (['/admin', '/a'].includes(text))
                    return answer(`<b>Админ-панель:</b>\n
<b>Чатов:</b> ${await Chat.countDocuments()}
<b>Пользователей:</b> ${await User.countDocuments()}
<b>Обработано сообщений:</b> ${(await User.findOne({ id: 0 })).balance}`, adminKB)

                else if (state[u.id] == 911 && text != "0") {
                    state[u.id] = undefined
                    bot.telegram.sendMessage(u.id, `✉️ Рассылка запущена`, { parse_mode }).then((e) => {
                        if (text.split("#").length == 4) {
                            var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                            var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                            text = text.split("#")[0]
                            mm_t(text, e.message_id, e.chat.id, 'all', true, btn_text, btn_link, 100)
                        }
                        else
                            mm_t(text, e.message_id, e.chat.id, 'all', false, false, false, 100)
                    })
                }

                else if (state[u.id] == 777 && text != "0") {
                    state[u.id] = undefined
                    bot.telegram.sendMessage(data[u.id], text, { parse_mode })
                        .then((e) => answer('✔️ Сообщение успешно отправлено в чат!', Markup.inlineKeyboard([[callbackButton("◀️ Назад", "admin_send")]])))
                        .catch(e => answer('🔺 Бот не смог отправить сообщение в чат! ', Markup.inlineKeyboard([[callbackButton("◀️ Назад", "admin_send")]])))
                }
            }

        } else if (c) {
            await User.updateOne({ id: 0 }, { $inc: { balance: 1 } })
            let admins = (await ctx.getChatAdministrators()).filter(e => !e.user.is_bot);
            c.updateOne({ admins: admins.map(e => e.user.id) }).then()

            let isAdmin = (id) => admins.find(e => e.user.id == id)

            let banUser = async (id, time, reason) => {
                try {
                    await ctx.banChatMember(id, time);
                    let punishment = await answer(`Пользователь <a href="tg://user?id=${id}">${id}</a> забанен!${time ? `

Срок: ${time}` : ''}${reason ? `

Причина: ${reason}` : ''}`);
                    if (c.autodeletemessages.punishment) {
                        setInterval(async () => {
                            try { await ctx.deleteMessage(punishment.message_id); } catch { };
                        }, Math.max(0, c.autodeletemessages.punishment));
                    }
                    return;
                } catch { return await answer("Ошибка!"); }
            };

            let unbanUser = async (id) => {
                try {
                    await ctx.unbanChatMember(id);
                    let punishment = await answer(`Пользователь <a href="tg://user?id=${id}">${id}</a> разбанен!`);
                    if (c.autodeletemessages.punishment) {
                        setInterval(async () => {
                            try { await ctx.deleteMessage(punishment.message_id); } catch { };
                        }, Math.max(0, c.autodeletemessages.punishment));
                    }
                    return;
                } catch (e) { console.log(e); return await answer("Ошибка!"); }
            };

            let muteUser = async (id, time, reason) => {
                try {
                    await ctx.restrictChatMember(id, { can_send_messages: false, until_date: time });
                    let punishment = await answer(`Пользователь <a href="tg://user?id=${id}">${id}</a> заглушен!${time ? `

Срок: ${time}` : ''}${reason ? `

Причина: ${reason}` : ''}`);
                    if (c.autodeletemessages.punishment) {
                        setInterval(async () => {
                            try { await ctx.deleteMessage(punishment.message_id); } catch { };
                        }, Math.max(0, c.autodeletemessages.punishment));
                    }
                    return;
                } catch { return await answer("Ошибка!"); }
            }

            let unmuteUser = async (id) => {
                try {
                    await ctx.restrictChatMember(id, { can_send_messages: true });
                    let punishment = await answer(`Пользователь <a href="tg://user?id=${id}">${id}</a> разглушен!`);
                    if (c.autodeletemessages.punishment) {
                        setInterval(async () => {
                            try { await ctx.deleteMessage(punishment.message_id); } catch { };
                        }, Math.max(0, c.autodeletemessages.punishment));
                    }
                    return;
                } catch { return await answer("Ошибка!"); }
            };

            let kickUser = async (id, reason) => {
                try {
                    await ctx.kickChatMember(id);
                    let punishment = await answer(`Пользователь <a href="tg://user?id=${id}">${id}</a> кикнут!${reason ? `

Причина: ${reason}` : ''}`);
                    if (c.autodeletemessages.punishment) {
                        setInterval(async () => {
                            try { await ctx.deleteMessage(punishment.message_id); } catch { };
                        }, Math.max(0, c.autodeletemessages.punishment));
                    }
                    return;
                } catch { return await answer("Ошибка!"); }
            };

            if (!c.cntMsgs) c.cntMsgs = {}
            if (!c.cntMsgs[msg.from.id])
                c.cntMsgs[msg.from.id] = 0;
            c.cntMsgs[msg.from.id]++;
            await c.updateOne({ cntMsgs: c.cntMsgs });

            if (isAdmin(msg.from.id) && text.startsWith('/settings')) {
                try {
                    await bot.telegram.sendMessage(msg.from.id, `<b>Параметры</b>

Группа: ${msg.chat.title}

<i>Выберите настройки которые хотите изменить:</i>`, { parse_mode, ...settingsKB(msg.chat.id) });
                    return await answer('<i>Настройки отправлены в лс бота!</i>');
                } catch {
                    return await answer('<i>Ошибка!</i>');
                };
            }

            if (!isAdmin(msg.from.id) && c.antiflud.turn) {

                if (!fludList[msg.chat.id])
                    fludList[msg.chat.id] = [];
                fludList[msg.chat.id].push(msg.from.id);
                if (fludList[msg.chat.id].filter(e => e == msg.from.id).length >= c.antiflud.permittedCntMsg) {
                    console.log('chat:', c.id, 'flud from user', msg.from.id)
                    await ctx.deleteMessage(msg.message_id);
                    if (c.antiflud.type == 'mute') {
                        await muteUser(msg.from.id, Date.now() / 1000 + c.antiflud.intervalTime / 1000, 'Флуд');
                    } else if (c.antiflud.type == 'ban') {
                        await banUser(msg.from.id, Date.now() / 1000 + c.antiflud.intervalTime / 1000, 'Флуд');
                    } else if (c.antiflud.type == 'kick') {
                        await kickUser(msg.from.id, 'Флуд');
                    } else if (c.antiflud.type == 'warning') {
                        let warningsUserList = c.warningsUserList;
                        if (!warningsUserList) warningsUserList = {}
                        if (!warningsUserList[msg.from.id])
                            warningsUserList[msg.from.id] = 0;

                        if (++warningsUserList[msg.from.id] >= c.warnings.cnt) {
                            warningsUserList[msg.from.id] = 0;
                            await answer(`Лимит предупреждений (${c.warnings.cnt}) для пользователя <a href="tg://user?id=${msg.from.id}">${msg.from.id}</a> превышен!`);
                            if (c.warnings.type == 'mute') {
                                await muteUser(msg.from.id, Date.now() / 1000 + c.antiflud.intervalTime / 1000, 'Флуд');
                            } else if (c.warnings.type == 'ban') {
                                await banUser(msg.from.id, Date.now() / 1000 + c.antiflud.intervalTime / 1000, 'Флуд');
                            }
                        } else {
                            await answer(`Предупреждение ${warningsUserList[msg.from.id]}/${c.warnings.cnt} для пользователя <a href="tg://user?id=${msg.from.id}">${msg.from.id}</a>!`);
                        }
                        return await c.updateOne({ warningsUserList });
                    }

                }

            }


            if (!isAdmin(msg.from.id) && text && c.stopwords.turn && c.stopwords.wordsList.filter(i => ` ${text.replace(/\n/g, ' ').toLowerCase()} `.includes(` ${i.toLowerCase()} `)).length) {
                console.log('chat:', c.id, 'stop word from user', msg.from.id)
                await ctx.deleteMessage(msg.message_id);
                if (c.stopwords.type == 'mute') {
                    await muteUser(msg.from.id, Date.now() / 1000 + c.stopwords.intervalTime / 1000, 'Нецензурная лексика');
                } else if (c.stopwords.type == 'ban') {
                    await banUser(msg.from.id, Date.now() / 1000 + c.stopwords.intervalTime / 1000, 'Нецензурная лексика');
                } else if (c.stopwords.type == 'kick') {
                    await kickUser(msg.from.id, 'Нецензурная лексика');
                } else if (c.stopwords.type == 'warning') {
                    let warningsUserList = c.warningsUserList;
                    if (!warningsUserList) warningsUserList = {}
                    if (!warningsUserList[msg.from.id])
                        warningsUserList[msg.from.id] = 0;

                    if (++warningsUserList[msg.from.id] >= c.warnings.cnt) {
                        warningsUserList[msg.from.id] = 0;
                        await answer(`Лимит предупреждений (${c.warnings.cnt}) для пользователя <a href="tg://user?id=${msg.from.id}">${msg.from.id}</a> превышен!`);
                        if (c.warnings.type == 'mute') {
                            await muteUser(msg.from.id, Date.now() / 1000 + c.stopwords.intervalTime / 1000, 'Нецензурная лексика');
                        } else if (c.warnings.type == 'ban') {
                            await banUser(msg.from.id, Date.now() / 1000 + c.stopwords.intervalTime / 1000, 'Нецензурная лексика');
                        }
                    } else {
                        await answer(`Предупреждение ${warningsUserList[msg.from.id]}/${c.warnings.cnt} для пользователя <a href="tg://user?id=${msg.from.id}">${msg.from.id}</a>!`);
                    }
                    return await c.updateOne({ warningsUserList });
                }
            }

            if (!isAdmin(msg.from.id) && /[\u0600-\u06FF]/.test(text) && c.antiarab.turn) {
                console.log('chat:', c.id, 'arab from user', msg.from.id)
                await ctx.deleteMessage(msg.message_id)
                if (c.antiarab.type == 'mute') {
                    await muteUser(msg.from.id, Date.now() / 1000 + c.antiarab.intervalTime / 1000, 'Арабские символы');
                } else if (c.antiarab.type == 'ban') {
                    await banUser(msg.from.id, Date.now() / 1000 + c.antiarab.intervalTime / 1000, 'Арабские символы');
                }
            }


            if (!isAdmin(msg.from.id) && c.antiforward.turn &&
                ((msg.forward_from && (msg.forward_from.type || msg.forward_from.is_bot)) || msg.forward_from_chat)
            ) {

                console.log('chat:', c.id, 'forward from user', msg.from.id)

                await ctx.deleteMessage(msg.message_id)

                if (c.antiforward.type == 'mute') {
                    await muteUser(msg.from.id, Date.now() / 1000 + c.antiforward.intervalTime / 1000, 'Пересылка');
                } else if (c.antiforward.type == 'ban') {
                    await banUser(msg.from.id, Date.now() / 1000 + c.antiforward.intervalTime / 1000, 'Пересылка');
                }
            }

            if (!isAdmin(msg.from.id) && c.nightmode.turn) {
                console.log('chat:', c.id, 'nightmode from user', msg.from.id)

                if (c.nightmode.startHour < c.nightmode.endHour && (new Date()).getHours() >= c.nightmode.startHour && (new Date()).getHours() < c.nightmode.endHour) {
                    return await ctx.deleteMessage(msg.message_id);
                }
                if (c.nightmode.startHour > c.nightmode.endHour && ((new Date()).getHours() >= c.nightmode.startHour || (new Date()).getHours() < c.nightmode.endHour)) {
                    return await ctx.deleteMessage(msg.message_id);
                }
            }

            if (!isAdmin(msg.from.id) && (c.other.deleteMsgFromGroup && msg.from.username == 'Channel_Bot')) {
                console.log('chat:', c.id, 'msg from channel')
                return await ctx.deleteMessage(msg.message_id);
            }

            // if (!isAdmin(msg.from.id) && c.other.deleteMsgUsername && msg.entities && msg.entities.filter(i => i.type == 'mention').length) {
            //     return await ctx.deleteMessage(msg.message_id);
            // }


            if (!isAdmin(msg.from.id) && c.other.deleteCommands && entities && entities.filter(i => i.type == 'bot_command').length) {
                console.log('chat:', c.id, 'bot command from user', msg.from.id)
                return await ctx.deleteMessage(msg.message_id);
            }



            if (!isAdmin(msg.from.id) && c.antispam.turn && entities && entities.filter(i => i.type == 'url' || i.type == 'text_link' || i.type == 'mention').length) {
                let only_user_links = true
                for (const e of entities.filter(i => i.type == 'url' || i.type == 'text_link' || i.type == 'mention')) {
                    let link = e.type == 'url' ? text.substring(e.offset, e.offset + e.length) : (e.type == 'text_link' ? e.url : `https://t.me/${text.substring(e.offset, e.offset + e.length).replace('@', '')}`)
                    if (!link.includes('t.me/')) {
                        only_user_links = false
                        break
                    }
                    if (await checkLink(link) != 'user') {
                        only_user_links = false
                        break
                    }
                }
                if (only_user_links) return
                console.log('chat:', c.id, 'link from user', msg.from.id)
                await ctx.deleteMessage(msg.message_id)

                if (c.antispam.type == 'mute') {
                    await muteUser(msg.from.id, Date.now() / 1000 + c.antispam.intervalTime / 1000, 'Распространение ссылок');
                } else if (c.antispam.type == 'ban') {
                    await banUser(msg.from.id, Date.now() / 1000 + c.antispam.intervalTime / 1000, 'Распространение ссылок');
                } else if (c.antispam.type == 'warning') {
                    let warningsUserList = c.warningsUserList;
                    if (!warningsUserList) warningsUserList = {}
                    if (!warningsUserList[msg.from.id])
                        warningsUserList[msg.from.id] = 0;
                    ;
                    if (++warningsUserList[msg.from.id] >= c.warnings.cnt) {
                        warningsUserList[msg.from.id] = 0;
                        await answer(`Лимит предупреждений (${c.warnings.cnt}) для пользователя <a href="tg://user?id=${msg.from.id}">${msg.from.id}</a> превышен!`);
                        if (c.warnings.type == 'mute') {
                            await muteUser(msg.from.id, Date.now() / 1000 + c.antispam.intervalTime / 1000, 'Распространение ссылок');
                        } else if (c.warnings.type == 'ban') {
                            await banUser(msg.from.id, Date.now() / 1000 + c.antispam.intervalTime / 1000, 'Распространение ссылок');
                        }
                    } else {
                        await answer(`Предупреждение ${warningsUserList[msg.from.id]}/${c.warnings.cnt} для пользователя <a href="tg://user?id=${msg.from.id}">${msg.from.id}</a>!`);
                    }
                    return await c.updateOne({ warningsUserList });
                }
            }

            if (!text) return

            if (text.startsWith('/rules') && c.rules.turn) {
                return await answer(c.rules.text);
            }

            if (text.startsWith('/stat')) {
                let creator = (await ctx.getChatAdministrators()).filter(i => i.status == 'creator')[0].user;
                return await answer(`<b>📊 Статистика чата:</b>

🧑‍💻 Создатель: <a href="tg://user?id=${creator.id}">${creator.first_name}</a>
👤 Участников: ${(await ctx.getChatMembersCount())}
👮 Админов: ${admins.length}
💬 Сообщений написано: ${msg.message_id}`);
            }

            if (text.startsWith('/help')) {
                return await answer(`Список основных команд:

/stat - статистика бота
/bonus - получить бонус
/balance - выведет ваш баланс`, helpBaseKB);
            }

            if (text.startsWith('/donate')) {
                try {
                    await bot.telegram.sendMessage(msg.from.id, `<i>💬 Для покупки монет отправьте любую сумму с комментарием: <code>BOT${msg.from.id}</code></i>
<b>Курс:</b> 1₽=50 монет на баланс бота

🥝 QIWI: <code>+79999999999</code>
🅿️ PAYEER: <code>P1234567890</code>

<b>⚠️Не забывайте указать свой комментарий к платежу иначе средства не будут зачислены!</b>`, { parse_mode });
                    return await answer('<i>Настройки отправлены в лс бота!</i>');
                } catch {
                    return await answer('<i>Ошибка!</i>');
                };
            }

            if (text.startsWith('/bonus')) {
                if (Date.now() - u.lastBonus >= 4 * 60 * 60 * 1000) {
                    let bonus = Math.floor(Math.random() * 35) + 1;
                    await u.updateOne({ lastBonus: Date.now(), $inc: { balance: bonus } });
                    return await answer(`<b>Зачет!</b>

Вы получаете <b>${bonus}</b> монет!`);
                } else {
                    return await answer(`<b>Незачет!</b>

Бонус можно получать 1 раз в 4 часа!`);
                }
            }

            if (text.startsWith('/balance')) {
                return await answer(`💰 Ваш баланс: <b>${u.balance}</b> монет`);
            }

            if (text.startsWith('/admins')) {
                return await answer(`👨‍💻 Админов в чате <b>${msg.chat.title}</b> ${admins.length}:
[Имя - Юзер - Айди]

${admins.map(admin => `<a href="tg://user?id=${admin.user.id}">${admin.user.first_name}</a> - <a href="tg://user?id=${admin.user.id}">${admin.user.username}</a> - <code>${admin.user.id}</code>`).join('\n')}`);
            }

            if (text.startsWith('/top')) {
                let top = [];
                for (let user in c.cntMsgs) top.push([user, c.cntMsgs[user]]);
                top.sort((a, b) => b[1] - a[1]);
                return await answer(`Топ пользользвателей:

${(await Promise.all(top.slice(0, 15).map(async (user, id) => `<b>${id + 1})</b> ${(await ctx.getChatMember(Number(user[0]))).user.first_name} | <b>${user[1]}</b> | <i>${Number(user[1]) >= 300 ? 'прописан' : Number(user[1]) >= 50 ? 'постоялец' : 'новичок'}</i>`))).join('\n')}`);
            }

            if (text.startsWith('/info')) {
                let member = await ctx.getChatMember(Number(text.split(' ')[1]) || msg.reply_to_message.from.id);
                let memberDB = await User.findOne({ id: member.user.id });
                return await answer(`🆔 ID: <code>${member.user.id}</code>
👱 Имя: <a href="tg://user?id=${member.user.id}">${member.user.first_name}</a>${member.user.username ? `
🌐 Имя пользователя: @${member.user.username}` : ''}
👀 Положение: ${member.status}
💬 Сообщений: ${c.cntMsgs[member.user.id]}
Баланс: <b>${memberDB.balance}</b> монет`);
            }



            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/ban')) {
                await banUser(Number(text.split('\n')[0].split(' ')[1]), 0, text.split('\n')[1]);
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/unban')) {
                await unbanUser(Number(text.split('\n')[0].split(' ')[1]));
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/mute')) {
                await muteUser(Number(text.split('\n')[0].split(' ')[1]), 0, text.split('\n')[1]);
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/unmute')) {
                await unmuteUser(Number(text.split('\n')[0].split(' ')[1]));
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/kick')) {
                await kickUser(Number(text.split('\n')[0].split(' ')[1]));
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/pin')) {
                try {
                    return await ctx.pinChatMessage(msg.reply_to_message.message_id);
                } catch { return await answer("Ошибка!"); }
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/unpin')) {
                try {
                    return await ctx.unpinChatMessage(msg.reply_to_message.message_id);
                } catch { return await answer("Ошибка!"); }
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/promote')) {
                try {
                    await ctx.promoteChatMember(Number(text.split('\n')[0].split(' ')[1]), { can_manage_chat: true });
                    return await answer(`Пользователь <a href="tg://user?id=${text.split('\n')[0].split(' ')[1]}">${text.split('\n')[0].split(' ')[1]}</a> назначен локальным админом!`);
                } catch (e) { return await answer("Ошибка!"); }
            }

            if (!msg.from.is_bot && isAdmin(msg.from.id) && text.startsWith('/demote')) {
                try {
                    await ctx.promoteChatMember(Number(text.split('\n')[0].split(' ')[1]), { can_manage_chat: false });
                    return await answer(`Пользователь <a href="tg://user?id=${text.split('\n')[0].split(' ')[1]}">${text.split('\n')[0].split(' ')[1]}</a> понижен!`);
                } catch { return await answer("Ошибка!"); }
            }

            let RP = [{ 'Чмок': 'чмокнул' },
            { 'Чпок': 'чпокнул' },
            { 'Кусь': 'куснул' },
            { 'Обнять': 'обнял' },
            { 'Шлеп': 'шлёпнул' },
            { 'Убить': 'убил' },
            { 'Связать': 'связал' },
            { 'Ударить': 'ударил' },
            { 'Пнуть': 'пнул' },
            { 'Задушить': 'задушил' },
            { 'Украсть': 'украл' },
            { 'Погладить': 'погладил' },
            { 'Притянуть': 'притянул' },
            ]


            if (msg.reply_to_message && RP.filter(el => Object.keys(el)[0] == text.split(' ')[0]).length) {
                try {
                    return await answer(`<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a> ${RP.find(el => Object.keys(el)[0] == text.split(' ')[0])[text.split(' ')[0]]} <a href="tg://user?id=${msg.reply_to_message.from.id}">${msg.reply_to_message.from.first_name}</a>`);
                } catch { return await answer("Ошибка!"); }
            }
        }

    }
    catch (e) {
        console.error(e);
    }
});




bot.catch(e => console.log(e));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('bot started!');
const parse_mode = "html";

async function main() {
    let chats = await Chat.find({ $or: [{ 'automessages.turn': true }, { 'antiflud.turn': true }] })
    for (const chat of chats) {
        if (chat.antiflud.turn)
            timersId.antiflud[chat.id] = setInterval(() => fludList[chat.id] = [], chat.antiflud.permittedTime)
        if (chat.automessages.turn)
            timersId.automessages[chat.id] = setInterval(() => bot.telegram.sendMessage(chat.id, chat.automessages.text).then(), chat.automessages.intervalTime)
    }
}
//main()

async function updateTimer(chat_id, type) {
    let chat = await Chat.findOne({ id: chat_id })

    if (type == 'antiflud') {
        clearInterval(timersId.antiflud[chat.id])
        if (chat.antiflud.turn)
            timersId.antiflud[chat.id] = setInterval(() => fludList[chat.id] = [], chat.antiflud.permittedTime)
    }

    if (type == 'automessages') {
        clearInterval(timersId.automessages[chat.id])
        if (chat.automessages.turn)
            timersId.automessages[chat.id] = setInterval(() => bot.telegram.sendMessage(chat.id, chat.automessages.text).then(), chat.automessages.intervalTime)
    }

}

const timersId = {
    antiflud: {},
    automessages: {}
}


const RM_mm1 = Markup.inlineKeyboard([[callbackButton("⏹ Стоп", "admin_mm_stop" )], [callbackButton("⏸ Пауза", "admin_mm_pause" )]])
const RM_mm2 =  Markup.inlineKeyboard([[callbackButton("⏹ Стоп", "admin_mm_stop" )], [callbackButton("▶️ Продолжить", "admin_mm_play" )]])

async function mmTick() {
    if (mm_status) {
        try {
            mm_i++
            if (mm_type == "text") {
                if (mm_btn_status)
                    bot.telegram.sendMessage(mm_u[mm_i - 1], mm_text, { ...Markup.inlineKeyboard([[urlButton(mm_btn_text, mm_btn_link )]]), parse_mode }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { console.log(err); mm_err++ })
                else
                bot.telegram.sendMessage(mm_u[mm_i - 1], mm_text, { parse_mode }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { console.log(err); mm_err++ })
            }
            if (mm_i % 10 == 0) {
                var tek = Math.round((mm_i / mm_total) * 40)
                var str = ""
                for (var i = 0; i < tek; i++) str += "+"
                str += '>'
                for (var i = tek + 1; i < 41; i++) str += "-"
                bot.telegram.editMessageText(mm_achatid, mm_amsgid, undefined, "<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, {parse_mode, ...RM_mm1})
            }
            if (mm_i == mm_total) {
                mm_status = false;
                bot.telegram.editMessageText( mm_achatid, mm_amsgid, "Выполнено: " + mm_i + '/' + mm_total,  {parse_mode})
                admin_list.map(id => bot.telegram.sendMessage(id, '<b>Рассылка завершена!\n\nСтатистика:\nУспешно:</b> ' + mm_ok + "\n<b>Неуспешно:</b> " + mm_err, { parse_mode }))
                mm_u = []
            }
        } finally { }
    }
}

setInterval(mmTick, 75);

var mm_total
var mm_i
var mm_status = false
var mm_amsgid
var mm_type
var mm_imgid
var mm_text
var mm_achatid
var mm_btn_status
var mm_btn_text
var mm_btn_link
var mm_ok
var mm_err
var mm_u 

async function mm_t(text, amsgid, achatid, geo, btn_status, btn_text, btn_link, size) {
    var ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
    mm_total = ut.length
    mm_u = []
    for (var i = 0; i < mm_total; i++)
        mm_u[i] = ut[i].id
    ut = undefined
    mm_i = 0;
    mm_amsgid = amsgid
    mm_type = "text"
    mm_text = text
    mm_ok = 0
    mm_err = 0
    mm_achatid = achatid
    if (btn_status) {
        mm_btn_status = true
        mm_btn_text = btn_text
        mm_btn_link = btn_link
    }
    else
        mm_btn_status = false
    mm_status = true;
}

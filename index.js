// Подключение SDK
const Alice = require('yandex-dialogs-sdk');
const alice = new Alice();

// Приветственная фраза
alice.command('', ctx => {

    ctx.reply('Привет! Меня зовут Алиса. Угадай о какой песне идет речь.');

});

// Вопрос про правила
alice.command(/как ирать|правила/, ctx => {

    ctx.reply('Правила? Какие правила?');

});

// Любая другая команда
alice.any(ctx => {

    ctx.reply('Может еще подумаем?');

});

// Привязать к порту
alice.listen('/', 3000);

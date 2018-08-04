
// Подключение SDK
const Alice = require('yandex-dialogs-sdk');
const alice = new Alice();

// Подключение Фраз
const Phrases = require('./phrases');
const phrases = new Phrases();

// Приветственная фраза
alice.command('', ctx => {

    const phrase = phrases.get('greeting');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    ctx.reply( ctx.replyBuilder.get() );

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


// Подключение SDK
const Alice = require('yandex-dialogs-sdk');
const alice = new Alice();

// Подключение Фраз
const Phrases = require('./phrases');
const phrases = new Phrases();

// Приветственная фраза
alice.command('', ctx => {

    const phrase = phrases.get('greeting');

    try {
        console.log( '-------- ctx.replyBuilder' );
        console.log( ctx.replyBuilder );
        console.log( '--------' );
        console.log( '-------- ctx.replyBuilder tts' );
        console.log( ctx.replyBuilder.tts( phrase.text + ' это ттс' ) );
        console.log( '--------' );
        console.log( '--------' );
    }

    const replyMessage = ctx.replyBuilder
        .text( phrase.text )
        .get();

    console.log( '-------- replyMessage' );
    console.log( replyMessage );
    console.log( '--------' );

    ctx.reply( replyMessage );

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

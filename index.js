
// Подключение SDK
const Alice = require('yandex-dialogs-sdk');
const alice = new Alice();

// Подключение Фраз
const Phrases = require('./phrases');
const phrases = new Phrases();

const User = {};

// Приветственная фраза
alice.command('', ctx => {

    if( ! User[ ctx.userId ] ) {
        User[ ctx.userId ] = {};
        console.log( 'new user - ' + ctx.userId );
    }

    let phrase = phrases.get('greeting');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    ctx.reply( ctx.replyBuilder.get() );

});

// Вопрос про правила
alice.command(/как ирать|правила/, ctx => {

    let phrase = phrases.get('rule');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    ctx.reply( ctx.replyBuilder.get() );

});

// Любая другая команда
alice.any(ctx => {

    let phrase = phrases.get('any');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    ctx.reply( ctx.replyBuilder.get() );

});

// Привязать к порту
alice.listen('/', 3000);

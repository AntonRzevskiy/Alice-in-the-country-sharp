
// Подключение SDK
const Alice = require('yandex-dialogs-sdk');
const Scene = require('yandex-dialogs-sdk').Scene;

const alice = new Alice();

// Подключение Фраз
const Phrases = require('./phrases');
const phrases = new Phrases();

const User = {};

// Приветственная фраза
alice.welcome(ctx => {

    if( ! User[ ctx.userId ] ) {
        User[ ctx.userId ] = {};
        console.log( 'new user - ' + ctx.userId );
    }

    let phrase = phrases.get('greeting');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// Вопрос про правила
alice.command(/как ирать|правила/, ctx => {

    let phrase = phrases.get('rule');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// игра
const game = new Scene('guessing-song');

game.enter(['готов', 'играть', 'начинаем', 'поехали'], ctx => {
    
    return ctx.reply('Давай!');
});

game.command('мы уже играем', ctx => {
    
    return ctx.reply('Конечно!');
});

game.leave(['надоело', 'устал', 'скучно', 'стоп'], ctx => {
    
    return ctx.reply('Не расстраивайтесь, это всего лишь игра.');
});

alice.registerScene( game );

// Любая другая команда
alice.any(ctx => {

    let phrase = phrases.get('any');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// Привязать к порту
alice.listen('/', 3000);

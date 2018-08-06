
// Подключение SDK
const Alice = require('yandex-dialogs-sdk');
const Scene = require('yandex-dialogs-sdk').Scene;

const alice = new Alice();

// Подключение Фраз
const Phrases = require('./phrases');
const phrases = new Phrases();

// Подключение песен
const Songs = require('./songs');
const songs = new Songs();

// Приветственная фраза
alice.welcome(ctx => {

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
let game = new Scene( songs.get() );

game.enter(['готов', 'играть', 'начинаем', 'поехали', 'могу', 'давай'], ctx => {

    let phrase = game.name.puzzle;

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

game.command(['повтори', 'подскажи'], ctx => {

    let phrase = game.name.puzzle;

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    // тест
    phrase = phrases.get('repeat_song');

    for( p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] + ctx.replyBuilder[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

game.command('уже играем', ctx => {

    let phrase = phrases.get('is_game');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

game.leave(['надоело', 'устал', 'скучно', 'стоп'], ctx => {

    // пометить как неугаданную
    songs.setUnsolved( game.name.key );

    // установить новую песню
    game.name = songs.get();

    let phrase = phrases.get('leave_game');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

game.any(ctx => {

    let phrase = phrases.get('game_any');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
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

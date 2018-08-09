
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

// Подключение matcher
const Matcher = require('./matcher');

// игра
const game = new Scene( 'song' );

// матчеры
const lobby = new Matcher();
const inGame = new Matcher();


// Приветственная фраза
alice.welcome(ctx => {

    let phrase = phrases.get('greeting');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// Вопрос про правила
lobby.add(['^как игра..', '^правила', 'какие'], ctx => {

    let phrase = phrases.get('rule');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// вход в игру
lobby.add(['^готов$', '^играть', '-^как игра..', '^начина', 'поехали', 'могу', 'давай'], ctx => {

    ctx.enterScene( game );

    let phrase = songs.getPuzzle();

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// Выход из навыка
lobby.add(['надоело', 'устал', 'скучно', 'стоп', 'хватит', 'выйти', 'уйти', '-^может'], ctx => {

    let phrase = phrases.get('goodbye');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.goodbye( ctx.replyBuilder.get() );
});

// Любая другая команда
lobby.add([], ctx => {

    let phrase = phrases.get('any');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
}, 99);

// подсказка в игре
inGame.add(['повтори', 'подскажи', 'давай'], ctx => {

    let puzzle = songs.getPuzzle();
    let phrase = phrases.get('game_repeat');

    for( let p in phrase ) {

        if( puzzle[ p ] ) {
            ctx.replyBuilder[ p ]( phrase[ p ] + puzzle[ p ] );
        } else {
            ctx.replyBuilder[ p ]( phrase[ p ] );
        }
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// вопрос о статусе в игре
inGame.add(['^уже играем', '^мы в игре', '^играю$'], ctx => {

    let phrase = phrases.get('is_game');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// выход в лобби (из игры)
inGame.add(['надоело', 'устал', 'скучно', 'стоп', 'хватит', 'выйти', 'уйти', '-^может'], ctx => {

    // пометить как неугаданную
    songs.setUnsolved();

    let phrase = phrases.get('leave_game');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    ctx.leaveScene();

    return ctx.reply( ctx.replyBuilder.get() );
});

// любая левая фраза
inGame.add([], ctx => {

    let phrase = phrases.get('game_any');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );

}, 99);


// прожиг
game.any(ctx => {

    let regex = new RegExp( songs.get().name.text, 'i' );

    if( regex.test( ctx.originalUtterance ) ) {

        // пометить как угаданную
        songs.setSolved();

        let phrase = phrases.get('win_game');

        for( let p in phrase ) {

            ctx.replyBuilder[ p ]( phrase[ p ] );
        }

        // выход в лобби
        ctx.leaveScene();

        return ctx.reply( ctx.replyBuilder.get() );
    }

    return inGame.match( ctx.message ).one([ ctx ]);
});

alice.any( ctx => lobby.match( ctx.message ).one([ ctx ]) );

// регистрация игры
alice.registerScene( game );

// Привязать к порту
alice.listen('/', 3000);

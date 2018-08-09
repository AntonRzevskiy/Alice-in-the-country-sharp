
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
const answer = new Matcher();


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

    // добавить матчи для угадывания песни. Они идут вместе с песней.
    const song = songs.get();

    answer.add( song.close, ctx => {

        let phrase = phrases.get('close_game');

        for( let p in phrase ) {

            ctx.replyBuilder[ p ]( phrase[ p ] );
        }

        return ctx.reply( ctx.replyBuilder.get() );
    });
    answer.add( song.win, ctx => {

        let origin = songs.get().original;
        let phrase = phrases.get('win_game');

        for( let p in origin ) {

            if( origin[ p ] ) {
                ctx.replyBuilder[ p ]( phrase[ p ] + origin[ p ] );
            } else {
                ctx.replyBuilder[ p ]( phrase[ p ] );
            }
        }

        // пометить как угаданную
        songs.setSolved().flush();

        // очистить для следующей
        answer.clear();

        // выход в лобби
        ctx.leaveScene();

        return ctx.reply( ctx.replyBuilder.get() );
    });

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
    songs.setUnsolved().flush();

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

    if( answer.match( ctx.message ).check() ) {

        return answer.one([ ctx ]);
    }

    return inGame.match( ctx.message ).one([ ctx ]);
});

alice.any( ctx => lobby.match( ctx.message ).one([ ctx ]) );

// регистрация игры
alice.registerScene( game );

// Привязать к порту
alice.listen('/', 3000);

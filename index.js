
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

// Приветственная фраза
alice.welcome(ctx => {

    let phrase = phrases.get('greeting');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

// Вопрос про правила
const rules = new Matcher();
rules.add(['^как игра..', '^правила', 'какие'], () => {});
alice.command(ctx => rules.match( ctx.message ).check(), ctx => {

    let phrase = phrases.get('rule');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

/**
 * Точка входа в игру
 *
 */
const game = new Scene( 'song' );

const enter = new Matcher();
enter.add(['^готов$', '^играть', '-^как игра..', '^начина', 'поехали', 'могу', 'давай'], () => {});
game.enter(ctx => enter.match( ctx.message ).check(), ctx => {

    // получить новый ID пени
    ctx.gameId = songs.getNew();

    let phrase = songs.get( ctx.gameId ).puzzle;

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

const reply = new Matcher();
reply.add(['повтори', 'подскажи', 'давай'], () => {});
game.command(ctx => reply.match( ctx.message ).check(), ctx => {

    let puzzle = songs.get( ctx.gameId ).puzzle;
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

game.command('уже играем', ctx => {

    let phrase = phrases.get('is_game');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

const leave = new Matcher();
leave.add(['надоело', 'устал', 'скучно', 'стоп', 'хватит', 'выйти', 'уйти', '-^может'], () => {});
game.leave(ctx => leave.match( ctx.message ).check(), ctx => {

    // пометить как неугаданную
    songs.setUnsolved( ctx.gameId );

    // установить новую песню
    ctx.gameId = songs.getNew();

    let phrase = phrases.get('leave_game');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

game.any(ctx => {

    let regex = new RegExp( songs.get( ctx.gameId ).name.text, 'i' );

    if( regex.test( ctx.originalUtterance ) ) {

        // пометить как угаданную
        songs.setSolved( ctx.gameId );

        // установить новую песню
        ctx.gameId = songs.getNew();

        let phrase = phrases.get('win_game');

        for( let p in phrase ) {

            ctx.replyBuilder[ p ]( phrase[ p ] );
        }

        // выход на главный сценарий
        ctx.leaveScene();

        return ctx.reply( ctx.replyBuilder.get() );
    }

    let phrase = phrases.get('game_any');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.reply( ctx.replyBuilder.get() );
});

alice.registerScene( game );
/**
 * Конец игровой
 */

// Выход из навыка
alice.command(ctx => leave.match( ctx.message ).check(), ctx => {

    let phrase = phrases.get('goodbye');

    for( let p in phrase ) {

        ctx.replyBuilder[ p ]( phrase[ p ] );
    }

    return ctx.goodbye( ctx.replyBuilder.get() );
});

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

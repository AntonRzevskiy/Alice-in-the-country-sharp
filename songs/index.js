
// Подключение lodash sample для синонимов
const { sample } = require('lodash');

const Songs = class {


    constructor() {
        this.songs = require('./ru.json');
    }

    get( song ) {
        if( this.songs.hasOwnProperty( song ) ) {

            const ph = sample( this.songs[ song ] );

            return ph;
        }
        return {'text': 'Не понимаю о чем вы!'};
    }


};

module.exports = Songs;

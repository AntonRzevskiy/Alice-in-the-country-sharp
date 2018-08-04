
// Подключение lodash sample для синонимов
const { sample } = require('lodash');

const Phrases = class {


    constructor() {
        this.phrases = require('./ru.json');
    }

    get( phrase ) {
        if( this.phrases.hasOwnProperty( phrase ) ) {

            const ph = sample( this.phrases[ phrase ] );

            return ph;
        }
        return {'text': 'Не понимаю о чем вы!'};
    }


};

module.exports = Phrases;

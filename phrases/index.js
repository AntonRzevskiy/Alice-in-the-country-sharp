
// Подключение lodash sample для синонимов
const { sample } = require('lodash');

const Phrases = class {


    constructor() {
        this.phrases = require('./ru.json');
    }

    get( phrase ) {
        if( this.phrases.hasOwnProperty( phrase ) ) {
            return sample( this.phrases[ phrase ] );
        }
        return 'Не понимаю о чем вы!';
    }


};

module.exports = Phrases;

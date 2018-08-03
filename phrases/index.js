
// Подключение lodash для синонимов
const _ = require('lodash');
// use - ${_()}

const Phrases = class {


    constructor() {
        this.phrases = require('./ru.json');
    }

    get( phrase ) {
        if( this.phrases.hasOwnProperty( phrase ) ) {
            console.log( this.phrases[ phrase ] );
            return this.phrases[ phrase ] [0];
        }
        return 'Не понимаю о чем вы!';
    }


};

module.exports = Phrases;


// Подключение lodash sample для синонимов
const { sample } = require('lodash');

const Songs = class {


    constructor() {
        this.songs = require('./ru.json');
    }

    get( key ) {
        let song;
        let _key;

        if( this.songs.hasOwnProperty( key ) ) {

            song = this.songs[ key ];

            return song;
        }

        _key = sample( Object.keys( this.songs ) );
        song = this.songs[ _key ];
        song.key = _key;

        return song;
    }


};

module.exports = Songs;

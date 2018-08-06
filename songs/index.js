
// Подключение lodash sample для синонимов
const { sample } = require('lodash');

const Songs = class {


    constructor() {

        this.songs = require('./ru.json');

        this.wasteSongs = {
            solved: {},
            unsolved: {}
        };

    }

    get( key ) {

        if( this.songs.hasOwnProperty( key ) ) {

            let song = this.songs[ key ];
            song.key = key;

            return song;
        }

        return this.getNew();
    }

    getNew() {
        let song, keys, key;

        keys = Object.keys( this.songs );

        for( key = keys.length - 1; key >= 0; key-- ) {

            if( this.isSolved( keys[ key ] ) || this.isUnsolved( keys[ key ] ) ) {

                keys.splice( key, 1 );
            }

        }

        if( keys.length === 0 ) {

            this.wasteSongs = {
                solved: {},
                unsolved: {}
            };

            return this.getNew();
        }

        key = sample( keys );

        song = this.songs[ key ];
        song.key = key;

        return song;
    }

    // поместить в разгаданные
    setSolved( key ) {
        this.wasteSongs.solved[ key ] = key;
    }

    // поместить в неразгаданные
    setUnsolved( key ) {
        this.wasteSongs.unsolved[ key ] = key;
    }

    isSolved( key ) {
        return !!( this.wasteSongs.solved[ key ] );
    }

    isUnsolved( key ) {
        return !!( this.wasteSongs.unsolved[ key ] );
    }


};

module.exports = Songs;

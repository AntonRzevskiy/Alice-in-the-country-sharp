
// Подключение lodash sample для синонимов
const { sample } = require('lodash');

const Songs = class {


    constructor() {

        this.songs = require('./ru.json');

        this.wasteSongs = {
            solved: {},
            unsolved: {}
        };

        this.current = this.getNewID();

    }

    get( key = undefined ) {

        if( this.songs.hasOwnProperty( key ) ) {

            return this.songs[ key ];
        }

        if( this.current ) {

            return this.songs[ this.current ];
        }

        return this.songs[ this.getNewID() ];
    }

    getNewID() {
        let keys, key;

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

            return this.getNewID();
        }

        this.current = sample( keys );

        return this.current;
    }

    // поместить в разгаданные
    setSolved( key = this.current ) {
        this.wasteSongs.solved[ key ] = key;
        return this;
    }

    // поместить в неразгаданные
    setUnsolved( key = this.current ) {
        this.wasteSongs.unsolved[ key ] = key;
        return this;
    }

    isSolved( key = this.current ) {
        return !!( this.wasteSongs.solved[ key ] );
        return this;
    }

    isUnsolved( key = this.current ) {
        return !!( this.wasteSongs.unsolved[ key ] );
        return this;
    }


};

module.exports = Songs;

const Command = require('../../structures/Command.js');
const { gamelist } = require('../../util/GetGameList.js');
// TODO: a command for owners only where the gamelist can be updated.

const gameURL = 'https://retroachievements.org/game';

module.exports = class WhatGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whatgame',
            aliases: ['wg', 'randomgame'],
            group: 'rautil',
            memberName: 'whatgame',
            description: 'Responds with a random game that has achievements.',
            examples: ['`whatgame`', '`whatgame nes`', '`whatgame "street fighter"`', '`whatgame megadrive`'],
            args: [
                {
                    key: 'terms',
                    prompt: '',
                    type: 'string',
                    //infinite: true, // there's a bug with infinite+default
                    default: '~NOARGS~'
                },
            ]
        });
    }


    pickGame( games ) {
        if( ! games instanceof Array || games.length == 0)
            return "Didn't find anything... :frowning:";

        let chosenGame = games[ Math.floor( Math.random() * games.length ) ];
        return `**${chosenGame[1]}**\n${gameURL}/${chosenGame[0]}`;
    }


    run(msg, { terms }) {
        // picking a random game globally
        if( terms == '~NOARGS~' ) {
            return msg.say( this.pickGame( gamelist.games ) );
        }

        let games;
        let term = terms.toLowerCase();
        let offset;
        let length;
        const index = gamelist.index;

        // if the search term is a console name, pick a random game from that console
        if( index.hasOwnProperty( term ) ) {
            offset = index[ term ][0];
            length = index[ term ][1];
            games = gamelist.games.slice( offset, offset + length );
            return msg.say( this.pickGame( games ) );
        }

        let regex = new RegExp( term, 'i' );
        games = gamelist.games;
        games = games.filter( entry => entry[1].match( regex ) );

        return msg.say( this.pickGame( games ) );
    }

};


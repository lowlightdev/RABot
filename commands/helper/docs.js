const Command = require('../../structures/Command.js');
let lunr = require('lunr');
const fetch = require('node-fetch');

const search_index_json = 'http://docs.retroachievements.org/search/search_index.json';
const docsURL = 'https://docs.retroachievements.org';

module.exports = class DocsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'docs',
            group: 'helper',
            aliases: ['faq', 'doc'],
            memberName: 'docs',
            description: 'Provide links to RetroAchievements documentation.',
            examples: ['`docs jrdev`', '`docs resetif`', '`docs delta`'],
            args: [
                {
                    key: 'terms',
                    prompt: '',
                    type: 'string',
                    infinite: true,
                    default: 'home',
                }
            ]
        });
    }


    async run(msg, { terms }) {
        const res = await fetch(search_index_json);
        let docjson = await res.json();

        let idx = lunr(function () {
            this.ref('location');
            this.field('title');
            docjson.docs.forEach(doc => this.add(doc), this)
        });

        const results = await idx.search( terms.join(' ') );

        if(results.length < 1)
            return msg.reply(`Didn't find anything...\nTry going to the docs and using its own search engine:\n${docsURL}`);

        let response = '';
        for(let i = 0; i < results.length && i < 5; i++)
            response += `\n**${i+1}**. <${docsURL + results[i].ref}>`;

        return msg.reply(`__**Results found:**__ ${response}` );
    }

};

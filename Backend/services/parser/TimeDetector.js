const { rules } = require("./RuleEngine");

exports.detect=(lines)=>{

    const times=[];

    for(const line of lines){

        const match=line.match(rules.time);

        if(match){

            times.push(match[0]);

        }

    }

    return times;

};
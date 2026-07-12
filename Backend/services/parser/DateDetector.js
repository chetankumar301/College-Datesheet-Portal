const { rules } = require("./RuleEngine");

exports.detect=(lines)=>{

    const dates=[];

    for(const line of lines){

        const match=line.match(rules.date);

        if(match){

            dates.push(match[0]);

        }

    }

    return dates;

};
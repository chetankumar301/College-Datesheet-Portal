const { rules } = require("./RuleEngine");

exports.detect = (lines)=>{

    const subjects=[];

    for(const line of lines){

        const match=line.match(rules.subjectCode);

        if(match){

            subjects.push({

                code:match[0],

                raw:line

            });

        }

    }

    return subjects;

};
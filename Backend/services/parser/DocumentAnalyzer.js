exports.analyze = (lines) => {

    const analysis = {

        totalLines: lines.length,

        examType: "",

        academicSession: "",

        pages: 1,

        tables: []

    };

    for(const line of lines){

        const upper = line.toUpperCase();

        if(upper.includes("BACK")){

            analysis.examType="BACK";

        }

        else if(upper.includes("PRACTICAL")){

            analysis.examType="PRACTICAL";

        }

        else{

            analysis.examType="MAIN";

        }

    }

    return analysis;

};
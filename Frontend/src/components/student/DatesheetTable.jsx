export default function DatesheetTable({

    exams

}) {

    if (!exams.length) {

        return (

            <h2>

                No Exams Found

            </h2>

        );

    }

    return (

        <table className="datesheet-table">

            <thead>

                <tr>

                    <th>Subject</th>

                    <th>Date</th>

                    <th>Time</th>

                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                {

                    exams.map(exam => (

                        <tr key={exam._id}>

                            <td>

                                {

                                    exam.subject.subjectName

                                }

                            </td>

                            <td>

                                {exam.examDate}

                            </td>

                            <td>

                                {exam.startTime}

                                -

                                {exam.endTime}

                            </td>

                            <td>

                                {exam.status}

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}
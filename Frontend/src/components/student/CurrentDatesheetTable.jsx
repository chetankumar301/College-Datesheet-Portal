export default function CurrentDatesheetTable({ exams }) {

    return (

        <table className="datesheet-table">

            <thead>

                <tr>

                    <th>Subject</th>

                    <th>Date</th>

                    <th>Time</th>

                    <th>Room</th>

                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                {

                    exams.map(exam=>(

                        <tr key={exam._id}>

                            <td>{exam.subject.subjectName}</td>

                            <td>{exam.examDate}</td>

                            <td>

                                {exam.startTime}

                                -

                                {exam.endTime}

                            </td>

                            <td>

                                {exam.room || "TBA"}

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
export default function NextExamCard({ exam }) {

    if (!exam) {

        return (

            <div className="next-exam-card">

                <h2>📅 Next Exam</h2>

                <p>No Upcoming Exam</p>

            </div>

        );

    }

    return (

        <div className="next-exam-card">

            <h2>📅 Next Exam</h2>

            <h3>{exam.subject?.subjectName}</h3>

            <p>

                {exam.examDate}

            </p>

            <p>

                {exam.startTime} - {exam.endTime}

            </p>

            <h4>

                ⏳ {exam.daysLeft} Days Left

            </h4>

        </div>

    );

}
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import {
    createExamination,
    generateExaminationSchedule,
    getAcademicScope,
    getEligibleSubjects,
    updateExamination,
} from "../services/examService";

const initialForm = {
    examName: "",
    academicSession: "",
    examType: "main",
    startDate: "",
    endDate: "",
    allowedWeekDays: [1, 2, 3, 4, 5, 6],
    blockedDates: [],
    availableShifts: ["Morning", "Afternoon"],
    minimumGap: 1,
    maximumGap: 3,
    maximumExamsPerStudentPerDay: 1,
    maximumConsecutiveExamDays: 3,
    gapCalculationMode: "ideal",
    allowAutomaticGapCompression: true,
};

const weekDayMap = [
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
    { value: 0, label: "Sun" },
];

export default function CreateExaminationWizard() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [createdId, setCreatedId] = useState("");
    const [busy, setBusy] = useState(false);
    const [step, setStep] = useState(1);
    const [scope, setScope] = useState({ courses: [], branches: [], semesters: [] });
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({ courseId: "", branchId: "", semester: "" });

    useEffect(() => {
        loadScope();
    }, []);

    useEffect(() => {
        if (filters.courseId || filters.branchId || filters.semester) {
            loadSubjects();
        } else {
            setSubjects([]);
        }
    }, [filters.courseId, filters.branchId, filters.semester]);

    const loadScope = async () => {
        try {
            const res = await getAcademicScope();
            setScope(res.data || { courses: [], branches: [], semesters: [] });
        } catch (err) {
            toast.error("Failed to load academic scope");
        }
    };

    const loadSubjects = async () => {
        try {
            const res = await getEligibleSubjects({
                courseId: filters.courseId || undefined,
                branchId: filters.branchId || undefined,
                semester: filters.semester || undefined,
            });
            setSubjects(res.data || []);
        } catch (err) {
            toast.error("Failed to load eligible subjects");
        }
    };

    const selectedCourseBranches = useMemo(() => {
        if (!filters.courseId) return scope.branches;
        return scope.branches.filter((branch) => {
            const branchCourseId = branch.course?._id || branch.course;
            return String(branchCourseId) === String(filters.courseId);
        });
    }, [filters.courseId, scope.branches]);

    const toggledWeekDays = (day) => {
        setForm((prev) => ({
            ...prev,
            allowedWeekDays: prev.allowedWeekDays.includes(day)
                ? prev.allowedWeekDays.filter((item) => item !== day)
                : [...prev.allowedWeekDays, day],
        }));
    };

    const addBlockedDate = () => {
        setForm((prev) => ({ ...prev, blockedDates: [...prev.blockedDates, ""] }));
    };

    const updateBlockedDate = (index, value) => {
        setForm((prev) => {
            const blockedDates = [...prev.blockedDates];
            blockedDates[index] = value;
            return { ...prev, blockedDates };
        });
    };

    const removeBlockedDate = (index) => {
        setForm((prev) => ({
            ...prev,
            blockedDates: prev.blockedDates.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const payload = {
                ...form,
                blockedDates: form.blockedDates.filter(Boolean),
                courseId: filters.courseId || undefined,
                branchId: filters.branchId || undefined,
                semester: filters.semester ? Number(filters.semester) : undefined,
            };
            const res = createdId
                ? await updateExamination(createdId, payload)
                : await createExamination(payload);
            setCreatedId(res.data._id || createdId);
            setStep(3);
            toast.success(createdId ? "Examination updated" : "Examination created");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create examination");
        } finally {
            setBusy(false);
        }
    };

    const generate = async () => {
        if (!createdId) return;
        setBusy(true);
        try {
            await generateExaminationSchedule(createdId);
            toast.success("Schedule generation started");
            navigate("/exams");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to generate schedule");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Layout>
            <div className="exams-page exam-wizard-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Wizard</p>
                        <h1>Create Examination</h1>
                        <p className="page-subtitle">
                            A guided flow for setup, academic scope, and schedule generation.
                        </p>
                    </div>
                    <div className="wizard-steps">
                        <span className={step >= 1 ? "wizard-step is-active" : "wizard-step"}>1. Setup</span>
                        <span className={step >= 2 ? "wizard-step is-active" : "wizard-step"}>2. Scope</span>
                        <span className={step >= 3 ? "wizard-step is-active" : "wizard-step"}>3. Generate</span>
                    </div>
                </div>

                <div className="college-management-grid">
                    <div className="college-form-panel">
                        <form className="college-form" onSubmit={submit}>
                            <div className="section-preview">
                                <h2>Step {step}</h2>
                                <p>
                                    {step === 1
                                        ? "Enter examination basics and scheduling rules."
                                        : step === 2
                                            ? "Choose the course, branch, semester, and subject pool."
                                            : "Review the saved examination and generate the schedule."}
                                </p>
                            </div>

                            {step === 1 && (
                                <>
                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>Exam Name</label>
                                            <input
                                                value={form.examName}
                                                onChange={(e) => setForm({ ...form, examName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Academic Session</label>
                                            <input
                                                value={form.academicSession}
                                                onChange={(e) => setForm({ ...form, academicSession: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>Exam Type</label>
                                            <select
                                                value={form.examType}
                                                onChange={(e) => setForm({ ...form, examType: e.target.value })}
                                            >
                                                <option value="main">Main</option>
                                                <option value="back">Back</option>
                                                <option value="improvement">Improvement</option>
                                                <option value="practical">Practical</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Gap Mode</label>
                                            <select
                                                value={form.gapCalculationMode}
                                                onChange={(e) =>
                                                    setForm({ ...form, gapCalculationMode: e.target.value })
                                                }
                                            >
                                                <option value="ideal">Ideal</option>
                                                <option value="strict">Strict</option>
                                                <option value="compact">Compact</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>Course</label>
                                            <select
                                                value={filters.courseId}
                                                onChange={(e) =>
                                                    setFilters({
                                                        ...filters,
                                                        courseId: e.target.value,
                                                        branchId: "",
                                                    })
                                                }
                                            >
                                                <option value="">Select course</option>
                                                {scope.courses.map((course) => (
                                                    <option key={course._id} value={course._id}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Branch</label>
                                            <select
                                                value={filters.branchId}
                                                onChange={(e) =>
                                                    setFilters({ ...filters, branchId: e.target.value })
                                                }
                                            >
                                                <option value="">Select branch</option>
                                                {selectedCourseBranches.map((branch) => (
                                                    <option key={branch._id} value={branch._id}>
                                                        {branch.branchName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>Semester</label>
                                            <select
                                                value={filters.semester}
                                                onChange={(e) =>
                                                    setFilters({ ...filters, semester: e.target.value })
                                                }
                                            >
                                                <option value="">Select semester</option>
                                                {scope.semesters.map((semester) => (
                                                    <option
                                                        key={semester._id}
                                                        value={semester.code || semester.name}
                                                    >
                                                        {semester.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Available Shifts</label>
                                            <input
                                                value={form.availableShifts.join(", ")}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        availableShifts: e.target.value
                                                            .split(",")
                                                            .map((item) => item.trim())
                                                            .filter(Boolean),
                                                    })
                                                }
                                                placeholder="Morning, Afternoon"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>Allowed Week Days</label>
                                            <div className="toggle-pills">
                                                {weekDayMap.map((day) => (
                                                    <button
                                                        type="button"
                                                        key={day.value}
                                                        className={
                                                            form.allowedWeekDays.includes(day.value)
                                                                ? "toggle-pill is-active"
                                                                : "toggle-pill"
                                                        }
                                                        onClick={() => toggledWeekDays(day.value)}
                                                    >
                                                        {day.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Blocked Dates</label>
                                            <div className="stack-list">
                                                {form.blockedDates.map((date, index) => (
                                                    <div key={`${index}-${date}`} className="stack-row">
                                                        <input
                                                            type="date"
                                                            value={date}
                                                            onChange={(e) =>
                                                                updateBlockedDate(index, e.target.value)
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn-delete"
                                                            onClick={() => removeBlockedDate(index)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={addBlockedDate}
                                                >
                                                    + Add Blocked Date
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>Start Date</label>
                                            <input
                                                type="date"
                                                value={form.startDate}
                                                onChange={(e) =>
                                                    setForm({ ...form, startDate: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                value={form.endDate}
                                                onChange={(e) =>
                                                    setForm({ ...form, endDate: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <div className="section-preview">
                                    <h2>Ready to generate</h2>
                                    <p>
                                        Your examination is saved. Click generate to produce the first schedule snapshot.
                                    </p>
                                    <div className="exam-cards">
                                        <div className="exam-card">
                                            <strong>Selected course</strong>
                                            <span>
                                                {scope.courses.find((course) => course._id === filters.courseId)?.courseName ||
                                                    "Not selected"}
                                            </span>
                                        </div>
                                        <div className="exam-card">
                                            <strong>Selected semester</strong>
                                            <span>{filters.semester || "Not selected"}</span>
                                        </div>
                                        <div className="exam-card">
                                            <strong>Eligible subjects</strong>
                                            <span>{subjects.length}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-actions">
                                {step > 1 && (
                                    <button
                                        className="btn-secondary"
                                        type="button"
                                        onClick={() => setStep((prev) => prev - 1)}
                                        disabled={busy}
                                    >
                                        Back
                                    </button>
                                )}
                                {step < 3 && (
                                    <button
                                        className="btn-secondary"
                                        type="button"
                                        onClick={() => setStep((prev) => prev + 1)}
                                        disabled={busy}
                                    >
                                        Next
                                    </button>
                                )}
                                {step === 1 && (
                                    <button className="btn-primary" type="submit" disabled={busy}>
                                        {busy ? "Saving..." : "Save Examination"}
                                    </button>
                                )}
                                {step === 2 && (
                                    <button
                                        className="btn-primary"
                                        type="button"
                                        onClick={() => setStep(3)}
                                        disabled={busy}
                                    >
                                        Continue
                                    </button>
                                )}
                                {step === 3 && createdId && (
                                    <button
                                        className="btn-primary"
                                        type="button"
                                        onClick={generate}
                                        disabled={busy}
                                    >
                                        {busy ? "Working..." : "Generate Schedule"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="college-list-panel">
                        <div className="panel-topline">
                            <h2>Live Preview</h2>
                            <span>{subjects.length} subjects</span>
                        </div>
                        <div className="exam-cards">
                            <div className="exam-card">
                                <strong>Week days</strong>
                                <span>{form.allowedWeekDays.length}</span>
                            </div>
                            <div className="exam-card">
                                <strong>Blocked dates</strong>
                                <span>{form.blockedDates.filter(Boolean).length}</span>
                            </div>
                            <div className="exam-card">
                                <strong>Shifts</strong>
                                <span>{form.availableShifts.join(", ")}</span>
                            </div>
                            <div className="exam-card">
                                <strong>Gap</strong>
                                <span>
                                    {form.minimumGap} to {form.maximumGap} day(s)
                                </span>
                            </div>
                        </div>

                        <div className="section-preview" style={{ marginTop: "16px" }}>
                            <h2>Schedule Rules</h2>
                            <ul>
                                <li>Maximum exams per student per day: {form.maximumExamsPerStudentPerDay}</li>
                                <li>Maximum consecutive exam days: {form.maximumConsecutiveExamDays}</li>
                                <li>
                                    Automatic gap compression:{" "}
                                    {form.allowAutomaticGapCompression ? "Enabled" : "Disabled"}
                                </li>
                            </ul>
                        </div>

                        <div className="section-preview" style={{ marginTop: "16px" }}>
                            <h2>Subject Pool</h2>
                            {subjects.length ? (
                                <div className="status-grid">
                                    {subjects.slice(0, 8).map((subject) => (
                                        <div key={subject._id} className="status-item">
                                            <span className="status-dot"></span>
                                            <span>
                                                {subject.subjectName} - {subject.calculatedDifficultyLevel}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Select course, branch, and semester to load subjects.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

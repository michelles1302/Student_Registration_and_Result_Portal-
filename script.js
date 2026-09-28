"use strict";

const studentForm = document.getElementById("studentForm");
const resultSection = document.getElementById("resultSection");
const printButton = document.getElementById("printButton");
const editButton = document.getElementById("editButton");

const PASS_MARK = 35;
const TOTAL_SUBJECTS = 5;
const MAX_MARKS_PER_SUBJECT = 100;
const MAX_TOTAL_MARKS = TOTAL_SUBJECTS * MAX_MARKS_PER_SUBJECT;

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function setText(id, value) {
    document.getElementById(id).textContent = value;
}

function formatDate(dateValue) {
    if (!dateValue) return "";

    const parts = dateValue.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function createResultRow(subject, index) {
    const subjectName = getValue(`subject${index}`);
    const marks = Number(getValue(`mark${index}`));

    return {
        subject: subjectName,
        marks,
        passed: marks >= PASS_MARK
    };
}

function displayStudentDetails() {
    const fullName = getValue("fullName");

    setText("resultName", fullName);
    setText("resultRoll", `Roll Number: ${getValue("rollNumber")}`);
    setText("resultEmail", getValue("email"));
    setText("resultPhone", getValue("phone"));
    setText("resultDob", formatDate(getValue("dob")));
    setText("resultGender", getValue("gender"));
    setText("resultCourse", getValue("course"));
    setText("resultYear", getValue("year"));
    setText("studentAvatar", fullName.charAt(0).toUpperCase());
}

function displayMarksTable(subjects) {
    const tableBody = document.getElementById("resultTableBody");
    tableBody.replaceChildren();

    subjects.forEach((subject, index) => {
        const row = document.createElement("tr");

        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1;

        const subjectCell = document.createElement("td");
        subjectCell.textContent = subject.subject;

        const maxMarksCell = document.createElement("td");
        maxMarksCell.textContent = MAX_MARKS_PER_SUBJECT;

        const marksCell = document.createElement("td");
        marksCell.textContent = subject.marks;
        marksCell.className = "fw-bold";

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");
        statusBadge.className = subject.passed ? "status-pill pass" : "status-pill fail";
        statusBadge.textContent = subject.passed ? "PASS" : "FAIL";

        statusCell.appendChild(statusBadge);
        row.append(serialCell, subjectCell, maxMarksCell, marksCell, statusCell);
        tableBody.appendChild(row);
    });
}

function calculateResults(subjects) {
    const totalMarks = subjects.reduce((total, subject) => total + subject.marks, 0);
    const percentage = (totalMarks / MAX_TOTAL_MARKS) * 100;
    const subjectsPassed = subjects.filter(subject => subject.passed).length;
    const overallPass = subjectsPassed === TOTAL_SUBJECTS;

    return { totalMarks, percentage, subjectsPassed, overallPass };
}

function displaySummary(results) {
    setText("totalMarks", `${results.totalMarks} / ${MAX_TOTAL_MARKS}`);
    setText("percentage", `${results.percentage.toFixed(2)}%`);
    setText("subjectsPassed", `${results.subjectsPassed} / ${TOTAL_SUBJECTS}`);

    const finalStatus = document.getElementById("finalStatus");
    const statusText = document.getElementById("statusText");
    const statusDescription = document.getElementById("statusDescription");
    const statusIcon = document.getElementById("statusIcon");

    finalStatus.classList.toggle("fail", !results.overallPass);

    if (results.overallPass) {
        statusText.textContent = "PASS";
        statusDescription.textContent = "The student has passed all five subjects.";
        statusIcon.textContent = "✓";
    } else {
        statusText.textContent = "FAIL";
        statusDescription.textContent =
            `The student has passed ${results.subjectsPassed} out of ${TOTAL_SUBJECTS} subjects.`;
        statusIcon.textContent = "!";
    }
}

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Bootstrap-style validation using the browser's HTML5 constraint API.
    if (!studentForm.checkValidity()) {
        event.stopPropagation();
        studentForm.classList.add("was-validated");
        return;
    }

    const subjects = [];

    for (let i = 1; i <= TOTAL_SUBJECTS; i++) {
        const subjectName = getValue(`subject${i}`);
        const marksValue = getValue(`mark${i}`);
        const marks = Number(marksValue);

        if (
            subjectName === "" ||
            marksValue === "" ||
            !Number.isInteger(marks) ||
            marks < 0 ||
            marks > MAX_MARKS_PER_SUBJECT
        ) {
            studentForm.classList.add("was-validated");
            return;
        }

        subjects.push(createResultRow(subjectName, i));
    }

    displayStudentDetails();
    displayMarksTable(subjects);

    const results = calculateResults(subjects);
    displaySummary(results);

    resultSection.hidden = false;

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

studentForm.addEventListener("reset", function () {
    setTimeout(function () {
        studentForm.classList.remove("was-validated");
        resultSection.hidden = true;
    }, 0);
});

printButton.addEventListener("click", function () {
    window.print();
});

editButton.addEventListener("click", function () {
    resultSection.hidden = true;
    studentForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    document.getElementById("fullName").focus();
});

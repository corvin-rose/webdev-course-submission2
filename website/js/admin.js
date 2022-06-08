
const STUDENTS = [
    new Student(1, 'Alex', 'Schneider', new Date(1995, 5, 16), Gender.MALE, 'Mathematics', 'alex.schneider@htw-berlin.de'),
    new Student(2, 'Sarah', 'Williams', new Date(1998, 2, 5), Gender.FEMALE, 'Computergrafics', 'sarah.williams@htw-berlin.de'),
    new Student(3, 'John', 'Miller', new Date(2001, 11, 22), Gender.MALE, 'Webdevelopment', 'john.miller@htw-berlin.de'),
    new Student(4, 'Julia', 'Winters', new Date(1999, 6, 11), Gender.FEMALE, 'Webdevelopment', 'julia.winters@htw-berlin.de'),
];
const STAFF = [
    new Staff(1, 'Ambros', 'Gleixner', new Date(1967, 2, 19), Gender.MALE, 'Mathematics', 'ambros.gleixner@htw-berlin.de'),
    new Staff(2, 'Thomas', 'Jung', new Date(1961, 10, 6), Gender.MALE, 'Computergrafics', 'thomas.jung@htw-berlin.de'),
];

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

let studentCurId = STUDENTS.length;
let studentTable;
let studentDashboard;
let staffTable;
let staffDashboard;

let studentAddButton;
let studentRemoveButton;
let studentEditButton;
let selectedStudent = null;
let currentAddRow = null;

document.addEventListener("DOMContentLoaded", function(event) {
    if (!window.location.href.includes('#')) {
        window.location.href += '#home';
    }

    studentAddButton = document.getElementById('student-add-button');
    studentRemoveButton = document.getElementById('student-remove-button');
    studentEditButton = document.getElementById('student-edit-button');

    studentTable = document.getElementById('student-table');
    studentDashboard = document.getElementById('student-dashboard');

    for (let student of STUDENTS) {
        let row = document.createElement('tr');
        row.id = 'std-' + student.id;
        row.setAttribute('onclick', `selectRow('std-${student.id}')`)
        row.innerHTML = `
            <td>${student.id.toString().padStart(3, '0')}</td>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.dob.toLocaleDateString("en-US", dateOptions)}</td>
            <td>${student.gender}</td>
            <td>${student.department}</td>
            <td>${student.email}</td>
        `;
        studentTable.appendChild(row);

        let dashbRow = row.cloneNode(true);
        dashbRow.id = null;
        studentDashboard.appendChild(dashbRow);
    }

    staffTable = document.getElementById('staff-table');
    staffDashboard = document.getElementById('staff-dashboard');

    for (let staff of STAFF) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${staff.id.toString().padStart(3, '0')}</td>
            <td>${staff.firstName}</td>
            <td>${staff.lastName}</td>
            <td>${staff.dob.toLocaleDateString("en-US", dateOptions)}</td>
            <td>${staff.gender}</td>
            <td>${staff.department}</td>
            <td>${staff.email}</td>
        `;
        staffTable.appendChild(row);
        staffDashboard.appendChild(row.cloneNode(true));
    }
});

function selectRow(rowId) {
    if (selectedStudent) selectedStudent.style.background = null;
    selectedStudent = document.getElementById(rowId);
    selectedStudent.style.background = 'var(--color-primary)';
    studentRemoveButton.disabled = null;
}

function removeStudent() {
    if (selectedStudent) {
        studentTable.removeChild(selectedStudent);
        selectedStudent = null;
        studentRemoveButton.disabled = 'disabled';
    }
}

function addStudent() {
    let temp = document.getElementById('add-row-template').content.querySelector('tr');
    let addRow = document.importNode(temp, true);

    if (!currentAddRow) {
        currentAddRow = addRow;
        studentTable.appendChild(addRow);
    }
}

function cancelAddStudent() {
    if (currentAddRow) {
        studentTable.removeChild(currentAddRow);
        currentAddRow = null;
    }
}

function saveAddStudent() {
    let firstName = checkInputValid('add-std-fname');
    if (!firstName) return;
    let lastName = checkInputValid('add-std-lname');
    if (!lastName) return;
    let date = checkInputValid('add-std-date');
    if (!date) return;
    let gender = checkInputValid('add-std-gender');
    if (!gender) return;
    let department = checkInputValid('add-std-dep');
    if (!department) return;
    let email = checkInputValid('add-std-email');
    if (!email) return;

    let id = ++studentCurId;

    let row = document.createElement('tr');
    row.id = 'std-' + id;
    row.setAttribute('onclick', `selectRow('std-${id}')`)
    row.innerHTML = `
        <td>${(id).toString().padStart(3, '0')}</td>
        <td>${firstName.value}</td>
        <td>${lastName.value}</td>
        <td>${new Date(date.value).toLocaleDateString("en-US", dateOptions)}</td>
        <td>${gender.value}</td>
        <td>${department.value}</td>
        <td>${email.value}</td>
    `;
    studentTable.appendChild(row);
    
    if (currentAddRow) {
        studentTable.removeChild(currentAddRow);
        currentAddRow = null;
    }
}

function checkInputValid(id) {
    let input = document.getElementById(id);
    if (input.value == '') {
        input.classList.add('error');
        return false;
    } else {
        input.classList.remove('error');
        return input;
    }
}
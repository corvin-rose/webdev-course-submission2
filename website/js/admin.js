
const STUDENTS = [
    new Student(1, 'Alex', 'Schneider', new Date(1991, 5, 16), Gender.MALE, 'Mathematics', 'alex.schneider@htw-berlin.de', new Date(2015, 8, 4)),
    new Student(2, 'Sarah', 'Williams', new Date(1994, 2, 5), Gender.FEMALE, 'Computergrafics', 'sarah.williams@htw-berlin.de', new Date(2015, 8, 22)),
    new Student(3, 'John', 'Miller', new Date(1997, 11, 22), Gender.MALE, 'Webdevelopment', 'john.miller@htw-berlin.de', new Date(2015, 1, 15)),
    new Student(4, 'Julia', 'Winters', new Date(1995, 6, 11), Gender.FEMALE, 'Webdevelopment', 'julia.winters@htw-berlin.de', new Date(2015, 2, 1)),
];
const STAFF = [
    new Staff(1, 'Ambros', 'Gleixner', new Date(1967, 2, 19), Gender.MALE, 'Mathematics', 'ambros.gleixner@htw-berlin.de'),
    new Staff(2, 'Thomas', 'Jung', new Date(1961, 10, 6), Gender.MALE, 'Computergrafics', 'thomas.jung@htw-berlin.de'),
];

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

let studentCurId = STUDENTS.length;
let studentTable;
let studentDashboard;
let staffCurId = STAFF.length;
let staffTable;
let staffDashboard;

let studentAddButton;
let studentRemoveButton;
let studentEditButton;
let selectedStudent = null;
let studentCurrentAddRow = null;

let staffAddButton;
let staffRemoveButton;
let staffEditButton;
let selectedStaff = null;
let staffCurrentAddRow = null;


document.addEventListener("DOMContentLoaded", function(event) {
    if (!window.location.href.includes('#')) {
        window.location.href += '#home';
    }

    studentAddButton = document.getElementById('student-add-button');
    studentRemoveButton = document.getElementById('student-remove-button');
    studentEditButton = document.getElementById('student-edit-button');

    studentTable = document.getElementById('student-table');
    // studentDashboard = document.getElementById('student-dashboard');

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
            <td>${student.joiningDate.toLocaleDateString("en-US", dateOptions)}</td>
        `;
        studentTable.appendChild(row);

        let dashbRow = row.cloneNode(true);
        dashbRow.id = null;
        // studentDashboard.appendChild(dashbRow);
    }

    staffAddButton = document.getElementById('staff-add-button');
    staffRemoveButton = document.getElementById('staff-remove-button');
    staffEditButton = document.getElementById('staff-edit-button');

    staffTable = document.getElementById('staff-table');
    // staffDashboard = document.getElementById('staff-dashboard');

    for (let staff of STAFF) {
        let row = document.createElement('tr');
        row.id = 'stf-' + staff.id;
        row.setAttribute('onclick', `selectRow('stf-${staff.id}')`)
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
        // staffDashboard.appendChild(row.cloneNode(true));
    }
});

function selectRow(rowId) {
    if (rowId.includes('std')) {
        if (selectedStudent) selectedStudent.style.background = null;
        selectedStudent = document.getElementById(rowId);
        selectedStudent.style.background = 'var(--color-primary)';
        studentRemoveButton.disabled = null;
    } else if (rowId.includes('stf')) {
        if (selectedStaff) selectedStaff.style.background = null;
        selectedStaff = document.getElementById(rowId);
        selectedStaff.style.background = 'var(--color-primary)';
        staffRemoveButton.disabled = null;
    }
}

function deselectAll() {
    if (selectedStudent) selectedStudent.style.background = null;
    selectedStudent = null;
    if (selectedStaff) selectedStaff.style.background = null;
    selectedStaff = null;
}

function removeStudent() {
    if (selectedStudent) {
        studentTable.removeChild(selectedStudent);
        selectedStudent = null;
        studentRemoveButton.disabled = 'disabled';
    }
}

function addStudent() {
    let temp = document.getElementById('add-std-row-template').content.querySelector('tr');
    let addRow = document.importNode(temp, true);

    if (!studentCurrentAddRow) {
        studentCurrentAddRow = addRow;
        studentTable.appendChild(addRow);
    }

    deselectAll();
    dateSetup('add-std-date', -1);
    dateSetup('add-std-join', 0);
}

function cancelAddStudent() {
    if (studentCurrentAddRow) {
        studentTable.removeChild(studentCurrentAddRow);
        studentCurrentAddRow = null;
    }
}

function saveAddStudent() {
    let firstName = checkInputValid('add-std-fname');
    if (!firstName) return;
    let lastName = checkInputValid('add-std-lname');
    if (!lastName) return;
    let date = checkInputValid('add-std-date');
    if (!date || !dateValidation('add-std-date')) return;
    let gender = checkInputValid('add-std-gender');
    if (!gender) return;
    let department = checkInputValid('add-std-dep');
    if (!department) return;
    let email = checkInputValid('add-std-email');
    if (!email || !checkEmail('add-std-email')) return;
    let join = checkInputValid('add-std-join');
    if (!join) return;

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
        <td>${new Date(join.value).toLocaleDateString("en-US", dateOptions)}</td>
    `;
    studentTable.appendChild(row);
    
    if (studentCurrentAddRow) {
        studentTable.removeChild(studentCurrentAddRow);
        studentCurrentAddRow = null;
    }
}

function removeStaff() {
    if (selectedStaff) {
        staffTable.removeChild(selectedStaff);
        selectedStaff = null;
        staffRemoveButton.disabled = 'disabled';
    }
}

function addStaff() {
    let temp = document.getElementById('add-stf-row-template').content.querySelector('tr');
    let addRow = document.importNode(temp, true);

    if (!staffCurrentAddRow) {
        staffCurrentAddRow = addRow;
        staffTable.appendChild(addRow);
    }

    deselectAll();
    dateSetup('add-stf-date', -1);
}

function cancelAddStaff() {
    if (staffCurrentAddRow) {
        staffTable.removeChild(staffCurrentAddRow);
        staffCurrentAddRow = null;
    }
}

function saveAddStaff() {
    let firstName = checkInputValid('add-stf-fname');
    if (!firstName) return;
    let lastName = checkInputValid('add-stf-lname');
    if (!lastName) return;
    let date = checkInputValid('add-stf-date');
    if (!date || !dateValidation('add-stf-date')) return;
    let gender = checkInputValid('add-stf-gender');
    if (!gender) return;
    let department = checkInputValid('add-stf-dep');
    if (!department) return;
    let email = checkInputValid('add-stf-email');
    if (!email || !checkEmail('add-stf-email')) return;

    let id = ++staffCurId;

    let row = document.createElement('tr');
    row.id = 'stf-' + id;
    row.setAttribute('onclick', `selectRow('stf-${id}')`)
    row.innerHTML = `
        <td>${(id).toString().padStart(3, '0')}</td>
        <td>${firstName.value}</td>
        <td>${lastName.value}</td>
        <td>${new Date(date.value).toLocaleDateString("en-US", dateOptions)}</td>
        <td>${gender.value}</td>
        <td>${department.value}</td>
        <td>${email.value}</td>
    `;
    staffTable.appendChild(row);
    
    if (staffCurrentAddRow) {
        staffTable.removeChild(staffCurrentAddRow);
        staffCurrentAddRow = null;
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


const ONE_DAY = 1000*60*60*24;

function dateSetup(id, offset=0) {
    let yesterday = new Date(new Date() - ONE_DAY*(-offset));
    let datePicker = document.getElementById(id);
    // https://stackoverflow.com/questions/32378590/set-date-input-fields-max-date-to-today
    datePicker.max = yesterday.toISOString().split("T")[0];
}

function dateValidation(id) {
    let datePicker = document.getElementById(id);
    let minAgeDate = new Date(new Date() - ONE_DAY * 365 * 17)
    let maxAgeDate = new Date(new Date() - ONE_DAY * 365 * 60)

    if (new Date(datePicker.value) < maxAgeDate || new Date(datePicker.value) > minAgeDate) {
        datePicker.classList.add('error');
        alert('DOB Error');
        return false;
    } else {
        datePicker.classList.remove('error');
        return true;
    }
}

function checkEmail(id) {
    // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    let valid = (v) => String(v).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    let email = document.getElementById(id);
    if (valid(email.value)) {
        email.classList.remove('error');
        return true;
    } else {
        email.classList.add('error');
        return false;
    }
}
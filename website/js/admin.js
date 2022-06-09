
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
const Semester = {
    ALL: 'all',
    SUMMER: 'summer',
    WINTER: 'winter'
};

let studentCurId;
let studentTable;
let staffCurId;
let staffTable;
let departments = [];
let currentDepartment = -1;
let currentSemester = Semester.ALL;

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
    
    loadDepartmentSelect('dep-select', () => {
        if (localStorage.getItem('std-dep')) {
            currentDepartment = localStorage.getItem('std-dep');
            document.getElementById('dep-select').value = currentDepartment;
        }
    });
    if (localStorage.getItem('std-sem')) {
        currentSemester = localStorage.getItem('std-sem');
        document.getElementById('sem-select').value = currentSemester;
    }

    studentAddButton = document.getElementById('student-add-button');
    studentRemoveButton = document.getElementById('student-remove-button');
    studentEditButton = document.getElementById('student-edit-button');
    studentTable = document.getElementById('student-table');

    displayStudents();


    staffAddButton = document.getElementById('staff-add-button');
    staffRemoveButton = document.getElementById('staff-remove-button');
    staffEditButton = document.getElementById('staff-edit-button');
    staffTable = document.getElementById('staff-table');

    displayStaff();
});

function getDepartments(callback) {
    if (departments.length != 0) callback(departments);
    else {
        $.ajax({
            url: '/db/department.json',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                departments = data;
                callback(departments);
            },
            error: (e) => console.error(e)
        });
    }
}

function loadDepartmentSelect(id, callback=()=>null) {
    let departmentSelect = document.getElementById(id);
    getDepartments((data) => {
        for (let course of data) {
            let option = document.createElement('option');
            option.value = course.id;
            option.innerHTML = course.name;
            departmentSelect.appendChild(option);
        }
        callback();
    })
}

function displayStudents() {
    let applyStudentData = (students, departments) => {
        let studentCount = students.length;
        let summer = (month) => month >= 3 && month <= 9;
        let winter = (month) => month <= 2 || month >= 10;
        let semesterCheck = (month) => {
            return currentSemester == Semester.SUMMER ? summer(month) : winter(month);
        };
        if (currentDepartment != -1) students = students.filter(v => v.department == currentDepartment);
        if (currentSemester != Semester.ALL) students = students.filter(v => semesterCheck(+v.joiningDate.split('-')[1]));

        studentTable.innerHTML = '';
        for (let student of students) {
            let row = document.createElement('tr');
            row.id = 'std-' + student.id;
            row.setAttribute('onclick', `selectRow('std-${student.id}')`)
            row.innerHTML = `
                <td>${student.id.toString().padStart(3, '0')}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.dob}</td>
                <td>${student.gender}</td>
                <td>${departments[+student.department]}</td>
                <td>${student.email}</td>
                <td>${student.joiningDate}</td>
            `;
            studentTable.appendChild(row);
    
            let dashbRow = row.cloneNode(true);
            dashbRow.id = null;

            studentCurId = student.id+1;
        }
        document.getElementById('student-count').innerHTML = `Currently ${studentCount} students in database`;
    }
    $.ajax({
        url: '/db/student.json',
        type: 'GET',
        dataType: 'json',
        success: (students) => {
            getDepartments((data) => {
                let departments = [];
                data.forEach(v => departments[v.id] = v.name);
                applyStudentData(students, departments);
            });
            initChart(students);
        },
        error: (e) => console.error(e)
    });
}

function displayStaff() {
    let applyStaffData = (staffs, departments) => {
        for (let staff of staffs) {
            let row = document.createElement('tr');
            row.id = 'stf-' + staff.id;
            row.setAttribute('onclick', `selectRow('stf-${staff.id}')`)
            row.innerHTML = `
                <td>${staff.id.toString().padStart(3, '0')}</td>
                <td>${staff.firstName}</td>
                <td>${staff.lastName}</td>
                <td>${staff.dob}</td>
                <td>${staff.gender}</td>
                <td>${departments[+staff.department]}</td>
                <td>${staff.email}</td>
            `;
            staffTable.appendChild(row);

            staffCurId = staff.id+1;
        }
        document.getElementById('staff-count').innerHTML = `Currently ${staffs.length} staff members in database`;
    }
    $.ajax({
        url: '/db/staff.json',
        type: 'GET',
        dataType: 'json',
        success:  (staff) => {
            getDepartments((data) => {
                let departments = [];
                data.forEach(v => departments[v.id] = v.name);
                applyStaffData(staff, departments);
            });
        },
        error: (e) => console.error(e)
    });
}

function changeDepartment(event) {
    currentDepartment = event.target.value;
    localStorage.setItem('std-dep', currentDepartment);
    displayStudents();
}

function changeSemester(event) {
    currentSemester = event.target.value;
    localStorage.setItem('std-sem', currentSemester);
    displayStudents();
}

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
        loadDepartmentSelect('add-std-dep');
    }

    deselectAll();
    dateSetup('add-std-date', -1);
    dateSetup('add-std-join', 0);
    window.scrollTo(0, document.body.scrollHeight);
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
        <td>${date.value}</td>
        <td>${gender.value}</td>
        <td>${departments.filter(v => v.id == department.value).pop().name}</td>
        <td>${email.value}</td>
        <td>${join.value}</td>
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
        loadDepartmentSelect('add-stf-dep');
    }

    deselectAll();
    dateSetup('add-stf-date', -1);
    window.scrollTo(0, document.body.scrollHeight);
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
        <td>${date.value}</td>
        <td>${gender.value}</td>
        <td>${departments.filter(v => v.id == department.value).pop().name}</td>
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




// Only for fancy decoration

// https://developers.google.com/chart/interactive/docs/gallery/barchart
function initChart(students) {
    // Load the Visualization API and the piechart package.
    google.charts.load('current', {'packages':['corechart', 'bar']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let preparedData = [
        ['Month', 'Amount']
    ];
    for(let x = 1; x <= months.length; x++) {
        preparedData.push([months[x-1], students.filter(v => +v.joiningDate.split('-')[1] == x).length]);
    }

    // Callback that creates and populates a data table, 
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        // Create the data table.
        var data = google.visualization.arrayToDataTable(preparedData);

        // Set chart options
        var options = {
            'title':'2015',
            'legend':'none',
            'chartArea': {'left': 0},
            'colors': ['#44b9dd'] 
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('student-diagram'));
        chart.draw(data, options);
    }
    $(window).resize(() => {
        drawChart();
    });
    window.onhashchange = () => {
        drawChart();
    };
}
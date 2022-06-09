
const Semester = {
    SUMMER: 'summer',
    WINTER: 'winter'
}

let courseContainer;
let memberContainer;
let courseTemplate;

let departmentSelect;
let departments = [];
let currentDepartment = -1;
let currentSemester = Semester.SUMMER;

document.addEventListener("DOMContentLoaded", function(event) {
    if (!window.location.href.includes('#')) {
        window.location.href += '#overview';
    } else if (window.location.href.includes('#members')) {
        let id = localStorage.getItem('dep-id');
        displayMembers(id ? id : 1);
    }

    if (localStorage.getItem('sem')) {
        currentSemester = localStorage.getItem('sem');
    }

    courseContainer = document.getElementById('courses');
    memberContainer = document.getElementById('member-content');
    courseTemplate = document.getElementById('course-template');
    departmentSelect = document.getElementById('dep-select');

    getDepartments((data) => {
        for (let course of data) {
            let option = document.createElement('option');
            option.value = course.id;
            option.innerHTML = course.name;
            departmentSelect.appendChild(option);
        }
    });

    displayDepartments();
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

function displayDepartments() {
    let courseDiv = courseTemplate.content.querySelector('a');
    getDepartments((data) => {
        courseContainer.innerHTML = '';
        if (currentDepartment != -1) data = data.filter(v => v.id == currentDepartment);

        for (let course of data) {
            let a = document.importNode(courseDiv, true);
            a.innerHTML = a.innerHTML.replace('[TITLE]', course.name + ' (' + currentSemester + ' semester)');
            a.setAttribute('onclick', `displayMembers(${course.id})`);
            courseContainer.appendChild(a);
        }
    });
}

function displayMembers(id) {
    localStorage.setItem('dep-id', id);
    let memberTable = document.getElementById('member-content');
    preloadTable(memberTable, 7, 10);

    getDepartments((data) => {
        document.getElementById('course-title').innerHTML = 
            data.filter(v => v.id == id).pop().name + ' (' + currentSemester + ' semester)';
    })

    let applyMemberData = (data) => {
        memberTable.innerHTML = ''
        let summer = (month) => month >= 3 && month <= 9;
        let winter = (month) => month <= 2 || month >= 10;
        let semesterCheck = (month) => {
            return currentSemester == Semester.SUMMER ? summer(month) : winter(month);
        };
        let students = data
            .filter(v => v.department == id)
            .filter(v => semesterCheck(+v.joiningDate.split('-')[1]));
        for (let student of students) {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id.toString().padStart(3, '0')}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.dob}</td>
                <td>${student.gender}</td>
                <td>${student.email}</td>
                <td>${student.joiningDate}</td>
            `;
            memberTable.appendChild(row);
        }
    }
    $.ajax({
        url: '/db/student.json',
        type: 'GET',
        dataType: 'json',
        // without small timeout, loading looks buggy on fast loading periods
        success: (data) => setTimeout(() => applyMemberData(data), 200),
        error: (e) => console.error(e)
    });
}

function preloadTable(table, cols, rows) {
    table.innerHTML = '';
    for (let x = 0; x < rows; x++) {
        let row = document.createElement('tr');
        row.classList.add('loader');
        for (let y = 0; y < cols; y++) {
            row.innerHTML += '<td><div class="loader">&nbsp;</div></td>';
        }
        table.appendChild(row);
    }
}

function changeDepartment(event) {
    currentDepartment = event.target.value;
    displayDepartments();
}

function changeSemester(event) {
    currentSemester = event.target.value;
    localStorage.setItem('sem', currentSemester);
    displayDepartments();
}
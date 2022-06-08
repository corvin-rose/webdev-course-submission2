
let staffUserInput;
let staffPwInput;
let adminUserInput;
let adminPwInput;

let loginTries = 0;


document.addEventListener("DOMContentLoaded", function(event) {
    staffUserInput = document.getElementById('staff-username');
    staffPwInput = document.getElementById('staff-password');
    adminUserInput = document.getElementById('admin-username');
    adminPwInput = document.getElementById('admin-password');
});

function staffLogin() {
    if (!checkInputValid(staffUserInput)) return;
    if (!checkInputValid(staffPwInput)) return;

    if (!checkLoginCount()) return;

    if (staffUserInput.value == 'Admin' && staffPwInput.value == 'Admin') {
        window.location.href = 'staff.html';
    } else {
        loginTries++;
        alert('Wrong Credentials');
    }
}

function adminLogin() {
    if (!checkInputValid(adminUserInput)) return;
    if (!checkInputValid(adminPwInput)) return;
    
    if (!checkLoginCount()) return;
    
    if (adminUserInput.value == 'Admin' && adminPwInput.value == 'Admin') {
        window.location.href = 'admin.html';
    } else {
        loginTries++;
        alert('Wrong Credentials');
    }
}

function checkLoginCount() {
    if (loginTries >= 3) {
        alert('Too many login tries!');
        return false;
    }
    return true;
}

function checkInputValid(input) {
    if (input.value == '') {
        input.classList.add('error');
        return false;
    } else {
        input.classList.remove('error');
        return true;
    }
}
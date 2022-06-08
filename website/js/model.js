const Gender = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
}

class Student {
    constructor(id, firstName, lastName, dob, gender, department, email, joiningDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.department = department;
        this.email = email;
        this.joiningDate = joiningDate;
    }
}

class Staff {
    constructor(id, firstName, lastName, dob, gender, department, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.department = department;
        this.email = email;
    }
}
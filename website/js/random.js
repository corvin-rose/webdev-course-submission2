const GENDER = ['Male', 'Female', 'Other'];
const FIRST_NAMES = ['Pamela', 'Allyson', 'Diego', 'Chanel', 'Sidney', 'Jerry', 'Alexandra', 'Nolan', 'Juliette', 'Stacy', 'Caroline', 'Francisco', 'Korbin', 'Haylie', 'Gary', 'Vicente', 'Jayden', 'Gabriel', 'Joslyn', 'Alisha', 'Isis', 'Braelyn', 'Diamond', 'Alma', 'Blaine', 'Jonathon', 'Kayley', 'Janae', 'Paloma', 'Rayne', 'Michaela', 'Luciana', 'Ruby', 'Allisson', 'Eliezer', 'Tyson', 'Elisa', 'Weston', 'Christine', 'Tony', 'Aubrie', 'Tommy', 'Jovani', 'Baylee', 'Zaire', 'June', 'Malaki', 'Raphael', 'Mitchell', 'Noah', 'Annabel', 'Urijah', 'Devin', 'Jaylen', 'Aleena', 'Roman', 'Cory', 'Kaitlynn', 'Arjun', 'Finnegan', 'Aubrie', 'Darnell', 'Ismael', 'Jazmin', 'Ashton', 'Ayla', 'Zariah', 'Ashly', 'Joselyn', 'Emiliano', 'Emery', 'Dean', 'Jazmin', 'Isabella', 'Noemi', 'Aidan', 'Anahi', 'Hayley', 'Sarai', 'Carina', 'Noe', 'Mikaela', 'Jade', 'Nora', 'Jaylene', 'Claudia', 'Julianne', 'Nash', 'Elle', 'Yosef', 'Bryson', 'Hayden', 'Makaila', 'Alyssa', 'Layla', 'Nathaly', 'Nayeli', 'Alani', 'Dorian', 'Angelique'];
const LAST_NAMES = ['Shannon', 'Santos', 'Ewing', 'Mercado', 'Wade', 'Perkins', 'Levine', 'Klein', 'Hull', 'Murphy', 'Collins', 'Tate', 'Stephenson', 'Gibson', 'Singh', 'Mckee', 'Blake', 'Brock', 'Salas', 'Castaneda', 'Reynolds', 'Mclean', 'Acevedo', 'Russell', 'Spence', 'Bradford', 'Lynch', 'Shaffer', 'Scott', 'Trujillo', 'Donaldson', 'Parsons', 'Valdez', 'Bradshaw', 'Mccoy', 'Brady', 'Cain', 'Stanley', 'Macias', 'Fletcher', 'Walter', 'Michael', 'Turner', 'Santana', 'Shaw', 'Haynes', 'Bender', 'Cordova', 'Spencer', 'Phillips', 'Williams', 'Mahoney', 'Burke', 'Williams', 'Watts', 'Meyer', 'Miranda', 'Weaver', 'Garrison', 'Sawyer', 'Burke', 'Harding', 'Wiggins', 'Dorsey', 'Jensen', 'Horton', 'Campbell', 'Aguirre', 'Nicholson', 'Odom', 'Gutierrez', 'Holland', 'Dyer', 'Sutton', 'Pugh', 'Mills', 'Henry', 'Doyle', 'Villa', 'Madden', 'Lara', 'Watkins', 'Adkins', 'Charles', 'Mcgrath', 'Stafford', 'Woods', 'Hull', 'Malone', 'Moore', 'Campbell', 'Walters', 'Rodgers', 'Cuevas', 'Charles', 'Davies', 'Hardin', 'Mcpherson', 'Ramos', 'Ali'];
const ONE_DAY = 1000*60*60*24;
const ONE_YEAR = ONE_DAY * 365;

function generateRandomStudentData(size=100) {
    let students = [];
    for (let x = 0; x < size; x++) {
        let fname = FIRST_NAMES[parseInt(Math.random() * FIRST_NAMES.length)];
        let lname = LAST_NAMES[parseInt(Math.random() * LAST_NAMES.length)];
        students.push(
            new Student(
                (x+1), 
                fname,
                lname,
                new Date(new Date() - ONE_YEAR * (20 + 10 * Math.random())).toISOString().split('T')[0],
                GENDER[parseInt(Math.random() * GENDER.length)],
                parseInt(Math.random() * 6 + 1),
                `${fname}.${lname}@htw-berlin.de`,
                new Date(new Date('2015-01-01') - (-Math.random() * (ONE_YEAR-ONE_DAY))).toISOString().split('T')[0]
            )
        );
    }
    return JSON.stringify(students);
}

function generateRandomStaffData(size=20) {
    let staff = [];
    for (let x = 0; x < size; x++) {
        let fname = FIRST_NAMES[parseInt(Math.random() * FIRST_NAMES.length)];
        let lname = LAST_NAMES[parseInt(Math.random() * LAST_NAMES.length)];
        staff.push(
            new Staff(
                (x+1), 
                fname,
                lname,
                new Date(new Date() - ONE_YEAR * (40 + 20 * Math.random())).toISOString().split('T')[0],
                GENDER[parseInt(Math.random() * GENDER.length)],
                parseInt(Math.random() * 6 + 1),
                `${fname}.${lname}@htw-berlin.de`
            )
        );
    }
    return JSON.stringify(staff);
}
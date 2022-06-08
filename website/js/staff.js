
const COURSES = [
    'Mathematics',
    'Programming',
    'Computer Networks',
    'Software Engineering',
    'Webdevelopement',
    'Computergraphics',
];

let courseContainer;

document.addEventListener("DOMContentLoaded", function(event) {
    if (!window.location.href.includes('#')) {
        window.location.href += '#overview';
    }

    courseContainer = document.getElementById('courses');

    let temp = document.getElementById('course-template');
    let courseDiv = temp.content.querySelector('a');

    for (let course of COURSES) {
        let a = document.importNode(courseDiv, true);
        a.innerHTML = a.innerHTML.replace('[TITLE]', course);
        courseContainer.appendChild(a);
    }
});
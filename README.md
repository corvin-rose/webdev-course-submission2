# WebDev Submission 2

This is a submission for my Web Developement Course at HTW-Berlin.

<strong>Task:</strong> Create Validations for all input fields. Add filter options for Department and Semester. Assign the semester according to the joining date:
October to February --- Winter Semester
April to September --- Summer Semester

<br/>
<br/>

## General Information:
To start, copy the contents of the website folder into the www directory of Apache, Tomcat, etc. 
Start the webserver and open it's url in a webbrowser e.g. firefox > http://localhost:8080. Enter the following login credentials:
```
User: Admin
Password: Admin
```
The database is simulated with json files inside the `/website/db` folder. The json content is parsed and transformed to objects by the application.

<br/>
<br/>

## Implemented Features:
- [x] DOB Validation
- [x] Add Joining Date Column
- [x] Joining Date Validation
- [x] Email Validation
- [ ] Department Filter
- [ ] Semester Filter
- [ ] Semester Assigning

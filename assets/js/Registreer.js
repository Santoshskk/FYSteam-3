/**
 * @author SantoshKakkar
 * @type {HTMLElement}
 */

const form = document.getElementById('form');
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

document.addEventListener('DOMContentLoaded', function (e) {


    form.addEventListener('submit', e => {
        e.preventDefault();

        checkInputs(); // form validation

        // Check if email already exists
        function EmailCheck() {
            FYSCloud.API.queryDatabase(
                "SELECT user.email FROM user WHERE email = (?)", [email.value],
            ).then(function (data) {
                console.log(data)
                if (data.length > 0) {
                    return false;
                } else {
                    return true;
                }
            })
        }

        function SignUp() {
             FYSCloud.API.queryDatabase(
                 "INSERT INTO user (isAdmin, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?);",
                 [0, firstname.value, lastname.value, email.value, password.value]
             ).then(() => {
                 FYSCloud.API.queryDatabase(
                     "SELECT userID FROM user WHERE email = (?)", [email.value]
                 ).then(data => {
                     console.log(data);
                     FYSCloud.API.queryDatabase(
                         "INSERT INTO userinfo (userID, nationality, gender, age, discription) VALUES (?, ?, ?, ?, ?);",
                         [data[0].userID, null, null, null, null]
                     ).then(() => {
                         window.location.assign('index.html');
                     }).catch(err => {
                         console.log(err);
                     })
                 }).catch(err => {
                     console.log(err);
                 })
             });
        }

        function checkInputs() {
            // trim to remove the whitespaces
            const firstnameValue = firstname.value.trim();
            const lastnameValue = lastname.value.trim();
            const emailValue = email.value.trim();
            const passwordValue = password.value.trim();
            const password2Value = password2.value.trim();

            if (firstnameValue === '') {
                setErrorFor(firstname, 'Voornaam kan niet leeg zijn');
            } else if (lastnameValue === '') {
                setErrorFor(lastname, 'Achternaam kan niet leeg zijn')
            } else if (emailValue === '') {
                setErrorFor(email, 'Email kan niet leeg zijn');
            } else if (!isEmail(emailValue)) {
                setErrorFor(email, 'Ongeldige email adres');
            }else if (!EmailCheck(emailValue)){
                setErrorFor(email, 'Deze email is al geregistreerd, probeer in te loggen');
            } else if (passwordValue === '') {
                setErrorFor(password, 'Wachtwoord kan niet leeg zijn');
            } else if (password2Value === '') {
                setErrorFor(password2, 'Dit veld mag niet leeg zijn');
            } else if (passwordValue !== password2Value) {
                setErrorFor(password2, 'Wachtwoorden komen niet overeen');
            } else {
                setSuccessFor(firstname);
                setSuccessFor(lastname)
                setSuccessFor(email);
                setSuccessFor(password);
                setSuccessFor(password2);
                SignUp();
            }
        }

        function setErrorFor(input, message) {
            const formControl = input.parentElement;
            const small = formControl.querySelector('small');
            formControl.className = 'form-control error';
            small.innerText = message;
        }

        function setSuccessFor(input) {
            const formControl = input.parentElement;
            formControl.className = 'form-control success';
        }

        function isEmail(email) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            //Execution
            if (email.match(regex)) {
                console.log("valid");
                return true;
            } else {
                console.log("Invalid");
                return false;
            }
        }
    })
})





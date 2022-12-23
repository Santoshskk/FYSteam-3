/**
 * @author SantoshKakkar
 * @type {HTMLElement}
 */

let form = document.getElementById('form');
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

document.addEventListener('DOMContentLoaded', function (e) {


    form.addEventListener('submit', e => {
        e.preventDefault();

        checkInputs(); // form validation

        function SignUp() {
             FYSCloud.API.queryDatabase(
                 "INSERT INTO user (isAdmin, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?);",
                 [0, firstname.value, lastname.value, email.value, password.value]
             ).then(() => {
                 FYSCloud.API.queryDatabase(
                     "SELECT userID FROM user WHERE email = (?)", [email.value]
                 ).then(data => {
                     console.log(data);
                     let userID = data[0].userID;
                     FYSCloud.API.queryDatabase(
                         "INSERT INTO userinfo (userID, nationality, gender, age, discription) VALUES (?, ?, ?, ?, ?);",
                         [userID, null, null, null, null]
                     ).then(() => {
                         console.log(data);
                         FYSCloud.API.queryDatabase(
                             "INSERT INTO tripinfo (userID, location, startDate, endDate) VALUES (?, ?, ?, ?);",
                             [userID, null, null, null]
                         ).then(() => {
                             // window.location.assign('index.html');
                         }).catch(err => {
                             console.log(err);
                         })
                     }).catch(err => {
                         console.log(err);
                     })
                 }).catch(err => {
                     console.log(err);
                 })
             }).catch(err => {
                 console.log(err);
             })
        }

        function checkInputs() {
            // trim to remove the whitespaces
            const firstnameValue = firstname.value.trim();
            const lastnameValue = lastname.value.trim();
            const emailValue = email.value.trim();
            const passwordValue = password.value.trim();
            const password2Value = password2.value.trim();

            let countError = 0;

            if (firstnameValue === '') {
                setErrorFor(firstname, 'Dit veld mag niet leeg zijn');
                countError++;
            } else {
                setSuccessFor(firstname);
            }
            if (lastnameValue === '') {
                setErrorFor(lastname, 'Dit veld mag niet leeg zijn');
                countError++;
            }  else {
                setSuccessFor(lastname);
            }

            if (emailValue === '') {
                setErrorFor(email, 'Dit veld mag niet leeg zijn');
                countError++;
            }  else if(!isEmail(emailValue)){
                setErrorFor(email,'Geen geldige Email.');
                countError++;
            } else{
                FYSCloud.API.queryDatabase(
                    "SELECT userID FROM user WHERE email = (?)", [email.value],
                ).then(data => {
                    console.log(data.length)
                    if(data.length>0){
                        setErrorFor(email,'Deze email is geregistreerd, probeer login');
                        countError++;
                    }else {
                        setSuccessFor(email);
                    }
                })
            }

            if (passwordValue === '') {
                setErrorFor(password, 'Dit veld mag niet leeg zijn');
                countError++;
            }
            else if(!passwordChecker(passwordValue)){
                setPswError(password,'Wachtwoord moet bestaan uit minimaal 6 karakters,' +
                    ' 1 hoofdletter, 1 kleine letter en 1 cijfer.')
                countError++;
            }else {
                setSuccessFor(password);
            }

            if (password2Value === '') {
                setErrorFor(password2, 'Dit veld mag niet leeg zijn');
                countError++;
            }  else if (passwordValue !== password2Value) {
                     setErrorFor(password2, 'Wachtwoord komt niet overeen');
                    countError++;
                }  else {
                    setSuccessFor(password2);
                }

            if (countError === 0) {
                SignUp();
            }

            }


        function setErrorFor(input, message) {
            const formControl = input.parentElement;
            const small = formControl.querySelector('small');
            formControl.className = 'form-control error';
            small.innerText = message;
        }

        function setPswError(input, message) {
            const small = document.querySelector('#psw-error');
            small.parentElement.className = 'form-control error';
            input.parentElement.className = 'form-control error';
            small.innerText = message;
        }
        function setSuccessFor(input) {
            const formControl = input.parentElement;
            formControl.className = 'form-control success';
        }

          function EmailCheck(){
               FYSCloud.API.queryDatabase(
                  "SELECT userID FROM user WHERE email = (?)", [email.value],
                  ).then(function (data){
                  console.log(data)
                  return data.length <= 0;
              })


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
        function passwordChecker(password){
            let regexPasword= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,255}$/
            //Execution passwordcheck
            if (password.match(regexPasword)) {
                console.log("valid");
                return true;
            } else {
                console.log("Invalid");
                return false;
            }
        }
    })
})





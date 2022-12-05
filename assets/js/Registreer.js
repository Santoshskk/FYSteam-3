const form = document.getElementById('form');
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

document.addEventListener('DOMContentLoaded', function (e){



form.addEventListener('submit', e => {
    e.preventDefault();

    checkInputs();
    FYSCloud.API.queryDatabase(
        "INSERT INTO user (isAdmin, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?);",
        [0, firstname.value, lastname.value, email.value, password.value]
    )

});
function checkInputs() {
    // trim to remove the whitespaces
    const firstnameValue = firstname.value.trim();
    const lastnameValue = lastname.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(firstnameValue === '') {
        setErrorFor(firstname, 'Voornaam kan niet leeg zijn');
    } else {
        setSuccessFor(firstname);
    }

    if (lastnameValue === '') {
        setErrorFor(lastname, 'Achternaam kan niet leeg zijn')
    } else {
        setSuccessFor(lastname)
    }

    if(emailValue === '') {
        setErrorFor(email, 'Email kan niet leeg zijn');
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Niet geldige email');
    } else {
        setSuccessFor(email);
    }

    if(passwordValue === '') {
        setErrorFor(password, 'Wachtwoord kan niet leeg zijn');
    } else {
        setSuccessFor(password);
    }

    if(password2Value === '') {
        setErrorFor(password2, 'Wachtwoord2 kan niet leeg zijn');
    } else if(passwordValue !== password2Value) {
        setErrorFor(password2, 'Wachtwoord komt niet overeen');
    } else{
        setSuccessFor(password2);
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




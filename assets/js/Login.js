/**
 * @author Mete en santosh
 */


document.addEventListener('DOMContentLoaded', start)

function start() {
    document.getElementById('login').addEventListener('click', getInfo);
}

let userEmail
let userPassword

function getInfo() {
    userEmail = document.getElementById('user-username').value
    userPassword = document.getElementById('user-password').value
    formValidation(userEmail, userPassword);
}

function getDatabse() {


    //Login function
    FYSCloud.API.queryDatabase("SELECT * FROM user WHERE email = (?)", [userEmail]
    ).then(data => {
        let psw = data[0].password;
        let adm = data[0].isAdmin.data[0];
         if (psw === userPassword) {
            // start sesion - set session for user id & admin id.
            FYSCloud.Session.set("userID", data[0].userID);
            FYSCloud.Session.set("isAdmin", data[0].isAdmin.data[0]);
            if (adm === 1) {
                window.location.assign('admin/AdminDashboard.html')
            } else {
                window.location.assign('ProfilePage.html')
            }
        } else {
           // setError();
            evt.preventDefault();
        }
    }).catch(err => {
       // setError();
        console.log(err);
    })
}
function formValidation(emailVal,passwordVal){

    let countError = 0;

    if (emailVal === '') {
        setEmpty(userEmail);
        countError++;
    }
    if (passwordVal === '') {
        setEmpty(userPassword);
        countError++;
    }
    if (countError === 0) {
        getDatabse()
    }

    function setEmpty(input){
        let message = "Dit veld mag niet leeg zijn"
        const formControl = input.parentElement;
        const small = formControl.querySelector('small');
        formControl.className = 'form-control error';
        small.innerText = message;
    }

    // function setError(){
    //     let message = "Controleer of je het juiste e-mailadres en wachtwoord gebruikt hebt en probeer het nog eens."
    //     const small = document.querySelector('#psw-error');
    //     small.parentElement.className = 'form-control error';
    //     small.innerText = message;
    // }


}

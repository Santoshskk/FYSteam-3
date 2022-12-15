/**
 * @author Mete en santosh
 */


document.addEventListener('DOMContentLoaded', start)

function start() {
    document.getElementById('login').addEventListener('submit', getInfo)

}

let userEmail
let password

function getInfo() {
    userEmail = document.getElementById('user-username').value
    password = document.getElementById('user-password').value
    getDatabse()
}

function getDatabse() {
    //Login function
    FYSCloud.API.queryDatabase("SELECT * FROM user WHERE email = (?)", [userEmail]
    ).then(data => {
        let psw = data[0].password;
        let adm = data[0].isAdmin.data[0];
        if (psw === password) {
            // start sesion - set session for user id & admin id.
            FYSCloud.Session.set("userID", data[0].userID);
            FYSCloud.Session.set("isAdmin", data[0].isAdmin.data[0]);
            if (adm === 1) {
                window.location.assign('admin/AdminDashboard.html')
            } else {
                window.location.assign('ProfilePage.html')
            }
        } else {
            alert('Foute gegevens')
            evt.preventDefault();
        }
    }).catch(err => {
        console.log(err);
    })
}


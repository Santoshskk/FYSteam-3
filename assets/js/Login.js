document.addEventListener('DOMContentLoaded', start)

function start() {
    document.getElementById('login').addEventListener('click', getInfo)
    document.getElementById('logout').addEventListener('click', logOut)

}


let userEmail
let password

function getInfo() {
   userEmail = document.getElementById('user-username').value
    password = document.getElementById('user-password').value
    getDatabse()

}

function getDatabse() {
    FYSCloud.API.queryDatabase("SELECT * FROM user WHERE email = (?)", [userEmail]).then(data => {
        let psw = data[0].password;
        let adm = data[0].isAdmin.data[0];
        if (psw === password) {
            // sesion code
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


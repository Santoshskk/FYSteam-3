/**
 * @author Mete en santosh
 */


window.onload = () => {

    const form = document.getElementById('form');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        checkInputs(email, password);

        function SignIn() {
            FYSCloud.API.queryDatabase("SELECT * FROM user WHERE email = (?)", [email]
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
                    setError();
                    e.preventDefault();
                }
            }).catch(err => {
                setError();
                console.log(err);
            });

            function setError(){
                let message = "Controleer of je het juiste e-mailadres en wachtwoord gebruikt hebt en probeer het nog eens."
                const small = document.querySelector('#psw-error');
                small.parentElement.className = 'form-control error';
                small.innerText = message;
            }
        }

        function checkInputs(emailVal,passwordVal) {
            let countError = 0;

            if (emailVal === '') {
                setEmpty(emailVal);
                countError++;
            }
            if (passwordVal === '') {
                setEmpty(passwordVal);
                countError++;
            }
            if (countError === 0) {
                SignIn();
            }

            function setEmpty(input){
                let message = "Dit veld mag niet leeg zijn"
                const formControl = input.parentElement;
                const small = formControl.querySelector('small');
                formControl.className = 'form-control error';
                small.innerText = message;
            }
        }
    })
}

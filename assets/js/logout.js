document.getElementById('logout').addEventListener('click', logOut)

function logOut(){
    var userID = FYSCloud.Session.get("userID");
    var isAdmin = FYSCloud.Session.get("isAdmin");
    if (userID){
        FYSCloud.Session.clear();
        if(isAdmin === 1){
            // return to root diractory
            window.location.assign('../index.html')
        }else {
            window.location.assign('index.html')
        }
    }
}
if (!userId || isActive === 1) {
    if (isActive === 1) alert("This account has been disabled.");
    window.location.assign('index.html');
}

document.addEventListener("DOMContentLoaded", function () {

    document.body.addEventListener('click', logOut)

    function logOut(e) {
        var test = e.target.id;
        if (test === "logout" || test === "logout2") {
            if (confirm("Are you sure you want to log out?")) {
                console.log("Logged out!");

                var userID = FYSCloud.Session.get("userID");
                var isAdmin = FYSCloud.Session.get("isAdmin");
                if (userID) {
                    FYSCloud.Session.clear();
                    if (isAdmin === 1) {
                        // return to root diractory
                        window.location.assign('../index.html')
                    } else {
                        window.location.assign('index.html')
                    }
                }
            }
        }
    }
})
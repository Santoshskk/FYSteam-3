
if (userId == null)
{
    window.location.assign('index.html')
}

document.addEventListener("DOMContentLoaded" ,function() {

 document.body.addEventListener('click', logOut)

function logOut(e) {
     var test = e.target.id;
     if (test === "logout") {
         if (confirm("Are you sure you want to log out?")) {
             // Save it!
             console.log("Logged out!");

             console.log("test")
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
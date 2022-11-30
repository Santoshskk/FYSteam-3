/*
Tygo
Javascript script for POST reqeust from profile page to edit profile page
code could be made cleaner ,but it works ;)
*/
var query = "SELECT user.userID, user.firstName, user.lastName, user.email, userinfo.nationality  FROM user, userinfo WHERE user.userID = userinfo.userID;";
var userID = 1;

let form = document.getElementById('form1');
form?.addEventListener("submit", function (e) {
    e.preventDefault();
    var submittedValues = {};
        UpdateDB(1,submittedValues);
})
function updateProfile(arr, formtype) {

     FYSCloud.API.queryDatabase
        (query).then(function(data) {
         let counter = 1;
         for (const [key, value] of Object.entries(data[userID -1])) {

             if(counter != 0) {
             if(counter <= arr.length) {
                     if (formtype == 1 && !key.includes('isAdmin')) {
                         document.getElementById(arr[counter-1]).innerHTML = value;
                         console.log(arr[counter-1] + value)
                     }
                      if (formtype == 2 && !key.includes('isAdmin')) {
                         document.getElementById(arr[counter-1]).value = value;
                      }
             }
             }
             counter++;
         }
        }
    );
}
//EventListener submit
form = document.getElementById('form2');
form?.addEventListener("submit", function (e) {
    e.preventDefault();
    active = 2;
    var firstname = document.querySelector("#name").value;
    var submittedValues = {
        firstName: firstname
    };
    UpdateDB(2,submittedValues);
})

function UpdateDB(formNum, ObjDataCurrentUser) {

    var firstName = ObjDataCurrentUser.firstName
    console.log(firstName)

    if (formNum === 1) {
           window.location.href = "EditProfile.html" ;
         } else {

        FYSCloud.API.queryDatabase(
            "UPDATE user SET firstName = (?) WHERE userID = 1;", [firstName]
        )
        window.location.href = "ProfilePage.html";
    }
}
//form type 1 = text elements
//form type 2 = input fields

//profilepage ID names //form type 1
const TextID = ["userID", "nameText", "lastNameText", "emailText", "land"];

//edit profile page ID names //form type 2
const TextID2 = ["userIDInput", "name"];


if (location.href.includes("EditProfile")) {
    updateProfile(TextID2, 2);
} else {
    updateProfile(TextID, 1);
}
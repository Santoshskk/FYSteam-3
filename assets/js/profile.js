/*
Tygo
Javascript script for POST request from profile page to edit profile page
code could be made cleaner ,but it works ;)
*/
let query = "SELECT user.userID, user.firstName, user.lastName, user.email, userinfo.nationality  FROM user, userinfo WHERE user.userID = userinfo.userID;";
const userID = FYSCloud.Session.get("userId");

let form = document.getElementById('form1');
form?.addEventListener("submit", function (e) {
    e.preventDefault();
    let submittedValues = {};
    UpdateDB(1,submittedValues);
})

function updateProfile(arr, formtype) {

     FYSCloud.API.queryDatabase
        (query).then(function(data) {
         let counter = 1;
         for (const [key, value] of Object.entries(data[userID -1])) {

             if(counter <= arr.length) {
                     if (formtype == 1) {
                         document.getElementById(arr[counter-1]).innerHTML = value;
                         console.log(arr[counter-1] + value)
                     }
                     else {
                         document.getElementById(arr[counter-1]).value = value;
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
    const firstname = document.querySelector("#name").value;
    const lastname = document.querySelector("#lastName").value;
    const email = document.querySelector("#email").value;
    const nationality = document.querySelector("#nationality").value;
    let newProfileImage;


    //upload image

    FYSCloud.Utils
        .getDataUrl("#fileUpload")
        .then(function(data) {

            newProfileImage = data.url;
            console.log(data)
            const submittedValues = {
                firstName: firstname,
                lastName: lastname,
                email: email,
                nationality: nationality,
                profileImage: newProfileImage
            };

            UpdateDB(2,submittedValues);

        })
        .catch(function(reason) {
            console.log(reason)
        });
})

function UpdateDB(formNum, ObjDataCurrentUser) {

    const firstName = ObjDataCurrentUser.firstName;
    const lastName = ObjDataCurrentUser.lastName
    const email = ObjDataCurrentUser.email;
    const nationality = ObjDataCurrentUser.nationality;
    const profileImage = ObjDataCurrentUser.profileImage;

    if (formNum === 1) {
           window.location.href = "EditProfile.html" ;
         } else {
        FYSCloud.API.queryDatabase(
            "UPDATE user, userinfo SET user.firstName = (?), user.lastName = (?), user.email = (?), userinfo.nationality = (?), user.profileImage = (?) WHERE user.userID = 1;", [firstName,lastName,email,nationality,profileImage]
        )
       // window.location.href = "ProfilePage.html";
    }
}

//profilepage ID names //form type 1
const TextID = ["userID", "nameText", "lastNameText", "emailText", "land"];

//edit profile page ID names //form type 2
const TextID2 = ["userIDInput", "name", "lastName", "email", "nationality"];

if (location.href.includes("EditProfile")) {
    updateProfile(TextID2, 2);
} else {
    updateProfile(TextID, 1);
}


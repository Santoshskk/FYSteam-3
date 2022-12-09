/*
Tygo
Javascript script for POST request from profile page to edit profile page
code could be made cleaner , but it works ;)
*/
const userID = FYSCloud.Session.get("userID");

let query = "SELECT user.userID, user.firstName, user.lastName, user.email, userinfo.nationality, user.profileImage FROM user, userinfo WHERE user.userID = userinfo.userID;";


let form = document.getElementById('form1');
form?.addEventListener("submit", function (e) {
    e.preventDefault();
    let submittedValues = {};
    UpdateDB(1,submittedValues, false);

})

function getValues(profileImage) {
    const firstname = document.querySelector("#name").value;
    const lastname = document.querySelector("#lastName").value;
    const email = document.querySelector("#email").value;
    const nationality = document.querySelector("#nationality").value;
    let newProfileImage;

    const submittedValues = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        nationality: nationality,
        profileImage: profileImage
    };
    return submittedValues;
}

//EventListener submit
form = document.getElementById('form2');
form?.addEventListener("submit", function (e) {

    e.preventDefault();

    FYSCloud.Utils
        .getDataUrl(document.querySelector("#fileUpload"))
        .then(function(data) {

            let name;
            FYSCloud.API.listDirectory().then(function (list) {
                name = "ImgNumber" + (list.length +1) + ".png";

                FYSCloud.API.uploadFile(
                    name + ".png",
                    data.url
                ).then(function(data) {
                    newProfileImage = data;
                    UpdateDB(getValues(newProfileImage), false);

                }).catch(function(reason) {
                });
            })

        }).catch(function(reason) {

        UpdateDB(getValues(null), false);

    });
})
function UpdateDB(ObjDataCurrentUser, deletedImage) {

    const firstName = ObjDataCurrentUser.firstName;
    const lastName = ObjDataCurrentUser.lastName
    const email = ObjDataCurrentUser.email;
    const nationality = ObjDataCurrentUser.nationality;
    const profileImage = ObjDataCurrentUser.profileImage;

    if (location.href.includes("ProfilePage")) {
        window.location.href = "EditProfile.html";
    } else {

        if (profileImage == null) {

        if(deletedImage) {
            FYSCloud.API.queryDatabase("UPDATE user, userinfo SET user.firstName = (?), user.lastName = (?), user.email = (?), userinfo.nationality = (?),user.profileImage = (?) WHERE user.userID = (?) AND  userinfo.userID = (?);", [firstName, lastName, email, nationality, null, userID, userID]).then(function () {
                window.location.href = "ProfilePage.html";
        })}
        else {
            FYSCloud.API.queryDatabase("UPDATE user, userinfo SET user.firstName = (?), user.lastName = (?), user.email = (?), userinfo.nationality = (?) WHERE user.userID = (?) AND  userinfo.userID = (?);", [firstName, lastName, email, nationality, userID, userID]).then(function () {
                window.location.href = "ProfilePage.html";
            })
        }
        }
        else {
            FYSCloud.API.queryDatabase(
                "UPDATE user, userinfo SET user.firstName = (?), user.lastName = (?), user.email = (?), userinfo.nationality = (?), user.profileImage = (?) WHERE user.userID = (?) AND userinfo.userID = (?);", [firstName, lastName, email, nationality, profileImage, userID, userID]
            ).then(function () {
                window.location.href = "ProfilePage.html";
            })
        }

    }
}

//array with names profile page id
const ProfilePageId = ["userID", "nameText", "lastNameText", "emailText", "land"];

//array with names profile page id
const EditProfilePageId = ["userIDInput", "name", "lastName", "email", "nationality"];

if (location.href.includes("ProfilePage")) {
    GetFromDatabase(ProfilePageId, "HTMLText", query, true, "img");
} else {
    GetFromDatabase(EditProfilePageId, "inputText", query, false, null);
}

function DeleteProfileImage() {
    UpdateDB(2, getValues(null), true)
}
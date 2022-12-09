/*
Tygo
Javascript script for POST request from profile page to edit profile page
code could be made cleaner , but it works ;)
*/

const userID = FYSCloud.Session.get("userID");
let query = "SELECT user.userID, user.firstName, user.lastName, user.email, userinfo.nationality, userinfo.age, userinfo.gender, user.profileImage FROM user, userinfo WHERE user.userID = userinfo.userID;";
let formProfilePage = document.getElementById('form1');

//onclick form profile Page
formProfilePage?.addEventListener("submit", function (e) {
    e.preventDefault();
    let submittedValues = {};
    UpdateDB(1, submittedValues, false);
})

//array with id names from inputfields editprofilePage
const arr = ["name", "lastName", "email", "nationality", "genderInput", "ageText"];

//get values from input fields and return object
function getValues(profileImage, inputId) {

    let submittedValues = {
        profileImage: profileImage
    };

    //key names obj - array
    let arr2 = ["firstName", "lastName", "email", "nationality", "gender", "ageText"];

    for (let i = 0; i <= inputId.length - 1; i++) {
        const item = document.querySelector("#" + inputId[i].toString()).value;
        submittedValues[arr2[i]] = item
    }

    return submittedValues;
}

//submit editProfile page
form = document.getElementById('form2');
form?.addEventListener("submit", function (e) {

    e.preventDefault();

    FYSCloud.Utils
        .getDataUrl(document.querySelector("#fileUpload"))
        .then(function (data) {

            let name;
            FYSCloud.API.listDirectory().then(function (list) {
                name = "ImgNumber" + (list.length + 1) + ".png";

                FYSCloud.API.uploadFile(
                    name + ".png",
                    data.url
                ).then(function (data) {
                    newProfileImage = data;
                    UpdateDB(getValues(newProfileImage, arr), false);

                }).catch(function (reason) {
                });
            })

        }).catch(function (reason) {

        UpdateDB(getValues(null, arr), false);

    });
})

function UpdateDB(CurrentUser, deletedImage) {

    if (location.href.includes("ProfilePage")) {
        window.location.href = "EditProfile.html";
    } else {

        if (CurrentUser.profileImage == null) {

            if (deletedImage) {
                FYSCloud.API.queryDatabase("UPDATE user, userinfo SET user.firstName = (?), user.lastName = (?), user.email = (?), userinfo.nationality = (?), userinfo.gender = (?),user.profileImage = (?) WHERE user.userID = (?) AND  userinfo.userID = (?);", [CurrentUser.firstName, CurrentUser.lastName, CurrentUser.email, CurrentUser.nationality, CurrentUser.gender, null, userID, userID]).then(function () {
                    window.location.href = "ProfilePage.html";
                })
            } else {
                FYSCloud.API.queryDatabase("UPDATE user, userinfo SET user.firstName = (?), user.lastName = (?), user.email = (?), userinfo.nationality = (?), userinfo.gender = (?) WHERE user.userID = (?) AND  userinfo.userID = (?);", [CurrentUser.firstName, CurrentUser.lastName, CurrentUser.email, CurrentUser.nationality, CurrentUser.gender, userID, userID]).then(function () {
                    window.location.href = "ProfilePage.html";
                })
            }
        } else {
            FYSCloud.API.queryDatabase(
                "UPDATE user, userinfo SET user.firstName = (?), user.lastName = (?), user.email = (?), userinfo.nationality = (?), userinfo.gender = (?), user.profileImage = (?) WHERE user.userID = (?) AND userinfo.userID = (?);", [CurrentUser.firstName, CurrentUser.lastName, CurrentUser.email, CurrentUser.nationality, CurrentUser.gender, CurrentUser.profileImage, userID, userID]
            ).then(function () {
                window.location.href = "ProfilePage.html";
            })
        }
    }
}

//array with names profile page id
const ProfilePageId = ["userID", "nameText", "lastNameText", "emailText", "land", "age", "gender"];
//array with names profile page id
const EditProfilePageId = ["userIDInput", "name", "lastName", "email", "nationality", "ageText", "genderInput"];

if (location.href.includes("ProfilePage")) {
    GetFromDatabase(ProfilePageId, "HTMLText", query, true, "img");
} else {
    GetFromDatabase(EditProfilePageId, "inputText", query, false, null);
}

function DeleteProfileImage() {
    UpdateDB(getValues("https://www.showflipper.com/blog/images/default.jpg", arr), true)
}
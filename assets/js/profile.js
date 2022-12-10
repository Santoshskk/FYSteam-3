/*
Tygo
Javascript script for POST request from profile page to edit profile page
code could be made cleaner , but it works ;)
*/

const userID = FYSCloud.Session.get("userID");
let callingStoredProcedure = "CALL GetAllUserInformation()";
let formProfilePage = document.getElementById('form1');

//array with id names from inputfields editprofilePage - to use to create object for getValues() func
const arr = ["name", "lastName", "email", "nationality", "genderInput", "ageText", "descriptionText"];

//create object from submitted values input field. -edit profile
function getValues(profileImage, inputIdArr) {

    let submittedValues = {
        profileImage: profileImage
    };
    //key names obj - array
    let arr2 = ["firstName", "lastName", "email", "nationality", "gender", "age", "discription"];
    for (let i = 0; i <= inputIdArr.length -1 ; i++) {
        const item = document.querySelector("#" + inputIdArr[i]).value;
        submittedValues[arr2[i]] = item
    }
    return submittedValues;
}

//onclick form profile Page
formProfilePage?.addEventListener("submit", function (e) {
    e.preventDefault();
    let submittedValues = {};
    UpdateDB(1, submittedValues);
})


//submit editProfile page
form = document.getElementById('form2');
form?.addEventListener("submit", function (e) {

    e.preventDefault();
    FYSCloud.Utils
        .getDataUrl(document.querySelector("#fileUpload"))
        .then(function (data) {
            let name = "img.png";
            FYSCloud.API.deleteFile(name);
                FYSCloud.API.uploadFile(
                    name,
                    data.url
                ).then(function (data) {
                    newProfileImage = data;
                    UpdateDB(getValues(newProfileImage, arr), false);
                }).catch(function (reason) {
                });

        }).catch(function (reason) {
        UpdateDB(getValues(null, arr));
    });
})

function UpdateDB(CurrentUser) {

    if (location.href.includes("ProfilePage")) {
        window.location.href = "EditProfile.html";
    } else {
        UpdateUserInformation(CurrentUser);
    }
}

//array with names profile page id
const ProfilePageId = ["userID", "nameText", "lastNameText", "emailText", "land", "age", "gender", "description"];
//array with names profile page id
const EditProfilePageId = ["userIDInput", "name", "lastName", "email", "nationality", "ageText", "genderInput","descriptionText"];

if (location.href.includes("ProfilePage")) {
    GetFromDatabase(ProfilePageId, "HTMLText", callingStoredProcedure, true, "img");
} else {
    GetFromDatabase(EditProfilePageId, "inputText", callingStoredProcedure, false, null);
}

function DeleteProfileImage() {
    UpdateDB(getValues("https://www.showflipper.com/blog/images/default.jpg", arr))
}
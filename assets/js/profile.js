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

function updateProfile(arr, formtype) {

    FYSCloud.API.queryDatabase
    (query).then(function(data) {
            let counter = 1;
            for (const [key, value] of Object.entries(data[userID -1])) {
                console.log(value)

                if (formtype == 1) {
                    if(key === "profileImage") {
                        console.log(value)
                        const defaultPic = "https://www.showflipper.com/blog/images/default.jpg";
                        if(value != null) {
                            document.querySelector(".profileImg").src = value;
                        } else {
                            document.querySelector(".profileImg").src = defaultPic;
                        }
                    }
                    else {
                        document.getElementById(arr[counter - 1]).innerHTML = value;
                    }
                }
                else {
                    document.getElementById(arr[counter-1]).value = value;
                }

                counter++;
            }
        }
    );
}

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

                    console.log(data)
                    newProfileImage = data;

                    UpdateDB(2, getValues(newProfileImage), false);


                }).catch(function(reason) {
                });
            })

        }).catch(function(reason) {

        UpdateDB(2, getValues(null), false);
    });
})
function UpdateDB(formNum, ObjDataCurrentUser, deletedImage) {

    const firstName = ObjDataCurrentUser.firstName;
    const lastName = ObjDataCurrentUser.lastName
    const email = ObjDataCurrentUser.email;
    const nationality = ObjDataCurrentUser.nationality;
    const profileImage = ObjDataCurrentUser.profileImage;

    if (formNum === 1) {
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

//profilepage ID names //form type 1
const TextID = ["userID", "nameText", "lastNameText", "emailText", "land"];

//edit profile page ID names //form type 2
const TextID2 = ["userIDInput", "name", "lastName", "email", "nationality"];

if (location.href.includes("EditProfile")) {
    updateProfile(TextID2, 2);
} else {
    updateProfile(TextID, 1);
}

function DeleteProfileImage() {
    UpdateDB(2, getValues(null), true)
}
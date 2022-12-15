/*
Tygo
Javascript script for POST request from profile page to edit profile page
code could be made cleaner , but it works ;)
*/

const userID = FYSCloud.Session.get("userID");
let callingStoredProcedure = GetAllUserInformation(userID);
let formProfilePage = document.getElementById('form1');

//array with id names from inputfields editprofilePage - to use to create object for getValues() func
const EditProfilePageId = ["name", "lastName", "email", "nationality", "ageText", "genderInput", "descriptionText"];

//array with names profile page id (edit user)
const ProfilePageId = ["nameText", "lastNameText", "emailText", "land", "age", "gender", "description"];

//array with names profile page id (edit trip)
const profilePageId2 = ["locatie", "startDate", "endDate"]
////////////////

//arrays with names SP (Stored procedure) Must be the same. to pass value to parameters
let SPNames_UpdateUserInformation = ["firstName", "lastName", "email", "nationality", "age", "gender", "discription", "locatie"];
let SPnames_SetProfileImageDefault = "profileImg";


//onclick form profile Page
formProfilePage?.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "EditProfile.html";
})

//submit editProfile page
form = document.getElementById('form2');

form?.addEventListener("submit", function (e) {
    e.preventDefault();
    let uploadImage = document.getElementById("fileUpload");

    if (uploadImage.files.length === 0) {
        UpdateDB(getValues(null, EditProfilePageId, SPNames_UpdateUserInformation), "UpdateUserInformation");
    } else {
        UploadImage(EditProfilePageId, "fileUpload", SPNames_UpdateUserInformation, "UpdateUserInformation");
    }
});

if (location.href.includes("ProfilePage")) {
    GetFromDatabase(ProfilePageId, "HTMLText", GetAllUserInformation(userID), true, "img");
    GetFromDatabase(profilePageId2, "HTMLText", GetAllTripInfo(userID), false, null);
}

if (location.href.includes("EditProfile")) {
    GetFromDatabase(EditProfilePageId, "inputText", callingStoredProcedure, false, null);
}

function DeleteProfileImage() {
    UpdateDB(getValues("https://www.showflipper.com/blog/images/default.jpg",
        EditProfilePageId, SPnames_SetProfileImageDefault), "SetProfileImage")
}

//edit trip

const editTripBtn = document.getElementById("editTripBtn");

editTripBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "EditTrip.html";
})

let formtripPage = document.getElementById('form3');
let dateArray = ["startDate", "endDate"];
if(location.href.includes("EditTrip")) {
    GetFromDatabase("countrySelect", "dropdown", GetAllCountry(), false, null);
    GetFromDatabase("interestSelect", "dropdown", GetAllInterest(), false, null);
    GetFromDatabase(dateArray, "date", GetTripInfoDates(), false, null);
}

formtripPage?.addEventListener("submit", function (e) {
    e.preventDefault();

})
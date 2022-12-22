/*
Tygo
Javascript script for POST request from profile page to edit profile page
code could be made cleaner , but it works ;)
*/

const userID = FYSCloud.Session.get("userID");
let formProfilePage = document.getElementById('form1');

//array with id names from inputfields editprofilePage - to use to create object for getValues() func
const EditProfilePageId = ["name", "lastName", "email", "nationality", "ageText", "genderInput", "descriptionText"];
const InterestId = [];

//array with names profile page id (edit user)
const ProfilePageId = [
    "nameText",
    "lastNameText",
    "emailText",
    "land",
    "age",
    "gender",
    "description"
];
//array with names profile page id (edit trip)
const profilePageId2 = ["startDate1", "endDate1"]
const test = ["locatie"]
////////////////

//arrays with names SP (Stored procedure) Must be the same. to pass value to parameters
let SPNames_UpdateUserInformation = ["firstName", "lastName", "email", "nationality", "age", "gender", "discription", "locatie"];
let SPnames_SetProfileImageDefault = "profileImg";
let SPnames_UpdateTripInfo = ["country", "startDate", "endDate", "userID"];
let SPnames_InsertUserInterest = ["interestID", "userID"];


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
        UpdateDB(getValues(null, EditProfilePageId, SPNames_UpdateUserInformation, "input"), "UpdateUserInformation");
    } else {
        UploadImage(EditProfilePageId, "fileUpload", SPNames_UpdateUserInformation, "UpdateUserInformation");
    }



    //
});




const interessesId = ["interesses"];
const interessesId2 = ["interessesBox"];
if (location.href.includes("ProfilePage")) {
    GetFromDatabase(ProfilePageId, "HTMLText", GetAllUserInformation(userID), true, "img", false);
    GetFromDatabase(test, "HTMLText", GetAllTripInfo(userID), false, null, false);
    GetFromDatabase(profilePageId2, "dateText", GetTripInfoDates(userID), false, null, false);

    GetFromDatabase(interessesId, "list", GetUserInterest(userID), false , null, false)

}

if (location.href.includes("EditProfile")) {
    GetFromDatabase("checkboxie", "checkbox", GetAllInterest(), false, null, true);
    GetFromDatabase(EditProfilePageId, "inputText", GetAllUserInformation(userID), false, null, false);
}

function DeleteProfileImage() {
    UpdateDB(getValues("https://www.showflipper.com/blog/images/default.jpg",
        EditProfilePageId, SPnames_SetProfileImageDefault, "input"), "SetProfileImage")
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
    GetFromDatabase("countrySelect", "dropdown", GetAllCountry(), false, null, false);
    GetFromDatabase(dateArray, "date", GetTripInfoDates(), false, null);
}

const editTripId = ["countrySelect", "startDate", "endDate"]

formtripPage?.addEventListener("submit", function (e) {
    e.preventDefault();
    UpdateDB(getValues(null, editTripId, SPnames_UpdateTripInfo, "input"), "UpdateTripInfo");
    UpdateDB(getValues(null, editTripId, SPnames_UpdateTripInfo, "input"), "UpdateTripInfo");
})
/*
Tygo
Javascript script for POST reqeust from profile page to edit profile page
code could be made cleaner ,but it works ;)
*/

let form = document.getElementById('form1');
form?.addEventListener("submit", function (e) {
    e.preventDefault();
    CreateUrl(1, "lala", "land", "gender", "leeftijdcategorie", "beschrijving");
})

function updateProfile(arr, formtype) {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);


    let counter = 0;
    urlParams.forEach((value, key) => {
        console.log(key);
        let element = urlParams.get(key);
        if (formtype == 1) {
            document.getElementById(arr[counter]).innerHTML = element;
        } else {
            document.getElementById(arr[counter]).value = element;
        }
        counter++;
    });
}

//EventListener submit
form = document.getElementById('form2');
form?.addEventListener("submit", function (e) {
    e.preventDefault();
    active = 2;
    CreateUrl(2, "nameInput", "land", "gender", "leeftijdcategorie", "beschrijving");
})

function CreateUrl(formNum, namePar, landPar, genderPar, leeftijdcategoriePar, beschrijvingPar) {

    const name = document.getElementById(namePar).value;
    const land = document.getElementById(landPar).value;
    const gender = document.getElementById(genderPar).value;
    const ageCatagory = document.getElementById(leeftijdcategoriePar).value;
    const beschrijving = document.getElementById(beschrijvingPar).value;

    //url
    const urlForm = "?" + "name=" + name + "&land=" +
        land + "&gender=" + gender + "&leeftijdcategorie=" + ageCatagory + "&beschrijving=" + beschrijving;

    //redirect to pages
    if (formNum === 1) {
        window.location.href = "EditProfile.html" + urlForm;
    } else {
        window.location.href = "ProfilePage.html" + urlForm;
    }
}

//form type 1 = text elements
//form type 2 = input fields
const TextID = ["TitleName", "landText", "genderText", "leeftijdcategorieText", "BeschrijvingText"];
const TextID2 = ["nameInput", "land", "gender", "leeftijdcategorie", "beschrijving"];
if (location.href.includes("EditProfile")) {
    updateProfile(TextID2, 2);
} else {
    updateProfile(TextID, 1);
}
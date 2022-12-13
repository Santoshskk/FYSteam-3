/*
Ophalen data van interest
 */

// user is nu nog 1, geen link met login
const userID = 1     //FYSCloud.Session.get("userID")

// ophalen interests van ingelogde user
FYSCloud.API.queryDatabase(
    "SELECT interestID FROM user_interest WHERE userID = (?)",
    [userID]
).then(function (data){
    let queryVar = []; // array met interesses van ingelogde gebruiker
    let counter = 0;

    // interests van ingelogde user in een variabele zetten, voor volgende query
    data.forEach(value => {
        for (let key in value){
            queryVar[counter] = value[key]
            counter++;
        }
    })

    /*
    // startdatum, einddatum en locatie trip, van ingelogde user, nog in query verwerken
    // zorgen dat verzonden en ontvangen users er niet inkomen
     */

    // gegevens ophalen mogelijke matches voor de ingelogde user
    FYSCloud.API.queryDatabase(
        "SELECT DISTINCT u.userID, u.firstName, u.lastName, u.profileImage FROM user AS u INNER JOIN user_interest AS i ON u.userID = i.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE i.userID != (?) AND i.interestID IN (?) AND (\"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate AND \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate ) AND t.location = \"Spanje\"",
        [userID, queryVar]
    ).then(function (data) {
        // html template ophalen
        let template = document.querySelector('#profiel-template').content
        // voor elke mogelijke match html template vullen
        for (let user of data){
            let matchProfile = template.cloneNode(true)
            let name = user.firstName + " " + user.lastName;
            let img = user.profileImage;
            let id = user.userID;

            matchProfile.querySelector("#namePotMatch").innerHTML = name
            matchProfile.querySelector("#imagePotMatch").src = img
            matchProfile.querySelector(".profile").id = id

            document.querySelector("#potentialMatches").append(matchProfile)
        }

        // potentiële match profielen als element krijgen
        const profiles = document.querySelectorAll(".profile");
        profiles.forEach(profile=>{
            profile.addEventListener("click", function (e) {
                // krijg model element
                let modal = document.querySelector("#profileModal");

                // krijg userID van potentiële match
                let potMatchId = profile.id.valueOf();
                console.log(potMatchId) // temp log

                // gegevens van mogelijke match ophalen en in modal plaatsen
                FYSCloud.API.queryDatabase(
                    "SELECT u.profileImage, CONCAT(u.firstName, ' ', u.lastName) AS fullName, ui.gender, ui.age, ui.nationality, ui.discription, t.location, t.startDate, t.endDate FROM user AS u INNER JOIN userinfo AS ui ON u.userID = ui.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE u.userID = (?)",
                    [potMatchId]
                ).then(function (data){
                    console.log(data) // temp log
                    let modal = document.querySelector('#profileModal');
                    console.log(modal) // temp log

                    for (let user of data){
                        modal.querySelector(".modal-content").id = potMatchId;
                        modal.querySelector("#potMatchModalImg").src = user.profileImage;
                        modal.querySelector("#profileName").innerHTML = "Naam: " + user.fullName;
                        modal.querySelector("#profileGender").innerHTML = "Geslacht: " + user.gender;
                        modal.querySelector("#profileAge").innerHTML = "Leeftijd: " + user.age;
                        modal.querySelector("#profileNat").innerHTML = "Nationaliteit: " + user.nationality;
                        modal.querySelector("#profileBio").innerHTML = "Bio: " + user.discription;

                        let startText = user.startDate.slice(0,10);
                        const startDateArr = startText.split('-');
                        let startDate = startDateArr[2] + "-" + startDateArr[1] + "-" + startDateArr[0];

                        let endText = user.endDate.slice(0,10);
                        const endDateArr = endText.split('-');
                        let endDate = endDateArr[2] + "-" + endDateArr[1] + "-" + endDateArr[0];

                        modal.querySelector("#profileTrip").innerHTML = "Trip info: In " + user.location + " van "
                        + startDate + " tot " + endDate;
                    }
                })

                // ophalen interesses van potentiële match
                FYSCloud.API.queryDatabase(
                    "SELECT name FROM user_interest AS ui INNER JOIN interest AS i ON ui.interestID = i.interestID WHERE ui.userID = (?)",
                    [potMatchId]
                ).then(function (data){
                    console.log(data)

                    let interests = "";
                    let modal = document.querySelector('#profileModal');

                    for (let interest of data){
                        if (interest === data[data.length - 1]){
                            interests += interest.name
                        }else {
                            interests += interest.name + ", "
                        }
                    }

                    console.log(interests) // temp log

                    modal.querySelector("#profileIntrest").innerHTML = "Interesse(s): " + interests;
                })

                // wanneer user op profiel klikt open modal
                modal.style.display = "block";

                let span = document.querySelector("#closeSpan");

                // wanneer user op kruisje klikt, sluiten
                span.addEventListener("click", function () {
                    modal.style.display = "none";
                })

                // wanneer user naast modal klikt, modal sluiten
                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }
            })
        })
    }).catch(function (reason) {
        let potMatchDiv = document.querySelector("#potentialMatches");
        const p = document.createElement("p")
        const text = document.createTextNode("Helaas, er zijn geen mogelijke matches gevonden.")

        p.appendChild(text)

        potMatchDiv.appendChild(p)
    })
})

// maak match
document.querySelector("#matchButton").addEventListener("click",function (){
    let potMatchId = parseInt(document.querySelector(".modal-content").id);
    const status = 1;
    let user = 1;
    let modal = document.querySelector('#profileModal');

    FYSCloud.API.queryDatabase(
        "INSERT INTO `match` (requestID, receiveID, status) VALUES (?, ?, ?)",
        [user, potMatchId, status]
    ).then(function (data){
        modal.style.display = "none";

    }).catch(function (reason) {
        console.log(reason)
    })
})

// haal verstuurde verzoeken op
FYSCloud.API.queryDatabase(
    "SELECT u.userID, CONCAT(u.firstName, \" \", u.lastName) AS fullName, u.profileImage FROM `user` AS u INNER JOIN `match` AS m ON u.userID = m.receiveID WHERE m.requestID = (?) AND m.status = 1",
    [userID]
).then(function (data) {
    // message voor geen data
    if (data.length === 0){
        let potMatchDiv = document.querySelector("#sendMatches");
        const p = document.createElement("p")
        const text = document.createTextNode("Helaas, er zijn geen verzonden verzoeken gevonden.")

        p.appendChild(text)

        potMatchDiv.appendChild(p)
    }

    // html template ophalen
    let template = document.querySelector('#send-profiel-template').content
    // voor elke mogelijke match html template vullen
    for (let user of data) {
        let sendProfile = template.cloneNode(true)
        let name = user.fullName;
        let img = user.profileImage;
        let id = user.userID;

        sendProfile.querySelector("#nameSendMatch").innerHTML = name
        sendProfile.querySelector("#imageSendMatch").src = img
        sendProfile.querySelector(".sendProfiles").id = id

        document.querySelector("#sendMatches").append(sendProfile)

        const sendProfiles = document.querySelectorAll(".sendProfiles");
        sendProfiles.forEach(sendProfile=> {
            sendProfile.addEventListener("click", function (e) {
                console.log("AHHHHHHHHHHHH")
            })
        })
    }
})

// haal ontvangen verzoeken op
FYSCloud.API.queryDatabase(
    "SELECT u.userID, CONCAT(u.firstName, \" \", u.lastName) AS fullName, u.profileImage FROM `user` AS u INNER JOIN `match` AS m ON u.userID = m.requestID WHERE m.receiveID = (?) AND m.status = 1",
    [userID]
).then(function (data) {
    // message voor geen data
    if (data.length === 0){
        let potMatchDiv = document.querySelector("#receivedMatches");
        const p = document.createElement("p")
        const text = document.createTextNode("Helaas, er zijn geen ontvangen verzoeken gevonden.")

        p.appendChild(text)

        potMatchDiv.appendChild(p)
    }

    // html template ophalen
    let template = document.querySelector('#received-profiel-template').content
    // voor elke mogelijke match html template vullen
    for (let user of data) {
        let receivedProfile = template.cloneNode(true)
        let name = user.fullName;
        let img = user.profileImage;
        let id = user.userID;

        receivedProfile.querySelector("#nameReceivedMatch").innerHTML = name
        receivedProfile.querySelector("#imageReceivedMatch").src = img
        receivedProfile.querySelector(".receivedProfiles").id = id

        document.querySelector("#receivedMatches").append(receivedProfile)

        const receivedProfiles = document.querySelectorAll(".receivedProfiles");
        receivedProfiles.forEach(receivedProfile=> {
            receivedProfile.addEventListener("click", function (e) {
                console.log("AHHHHHHHHHHHH")
            })
        })
    }
})








/*
VOORBEELD CODE: Ophalen data van interest
 */
// FYSCloud.API.queryDatabase(
//     "SELECT * FROM interest"
// ).then(function(data) {
//     let template = document.querySelector('#profiel-template').content
//     for (let interesse of data) {
//         let gebruiker = template.cloneNode(true)
//         gebruiker.querySelector("#naam").innerHTML = interesse.name
//         document.querySelector("#gebruikers").append(gebruiker)
//     }
//
// })









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
     */

    // gegevens ophalen mogelijke matches voor de ingelogde user
    FYSCloud.API.queryDatabase(
        "SELECT DISTINCT u.userID, u.firstName, u.lastName, u.profileImage FROM user AS u INNER JOIN user_interest AS i ON u.userID = i.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE i.userID != (?) AND u.userID not in (select m.requestID from `match` AS m) AND u.userID not in (select m.receiveID from `match` AS m) AND i.interestID IN (?) AND (\"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate AND \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate ) AND t.location = \"Spanje\"",
        [userID, queryVar]
    ).then(function (data) {
        if (data.length === 0){
            let potMatchDiv = document.querySelector("#potentialMatches");
            const p = document.createElement("p")
            const text = document.createTextNode("Helaas, er zijn geen mogelijke matches gevonden.")

            p.appendChild(text)

            potMatchDiv.appendChild(p)
        }
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

                // gegevens van mogelijke match ophalen en in modal plaatsen
                FYSCloud.API.queryDatabase(
                    "SELECT u.profileImage, CONCAT(u.firstName, ' ', u.lastName) AS fullName, ui.gender, ui.age, ui.nationality, ui.discription, t.location, t.startDate, t.endDate FROM user AS u INNER JOIN userinfo AS ui ON u.userID = ui.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE u.userID = (?)",
                    [potMatchId]
                ).then(function (data){
                    let modal = document.querySelector('#profileModal');

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

                    let interests = "";
                    let modal = document.querySelector('#profileModal');

                    for (let interest of data){
                        if (interest === data[data.length - 1]){
                            interests += interest.name
                        }else {
                            interests += interest.name + ", "
                        }
                    }

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
        location.reload();

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
                // krijg modal
                let modal = document.querySelector('#sendMatchModal');

                // wanneer user op profiel klikt open modal
                modal.style.display = "block";

                let span = document.querySelector("#closeSpanSend");

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
                // krijg modal
                let modal = document.querySelector('#receivedMatchModal');

                // krijg userID van potentiële match
                let requestingUserId = receivedProfile.id.valueOf();
                // gegevens van mogelijke match ophalen en in modal plaatsen
                FYSCloud.API.queryDatabase(
                    "SELECT u.profileImage, CONCAT(u.firstName, ' ', u.lastName) AS fullName, ui.gender, ui.age, ui.nationality, ui.discription, t.location, t.startDate, t.endDate FROM user AS u INNER JOIN userinfo AS ui ON u.userID = ui.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE u.userID = (?)",
                    [requestingUserId]
                ).then(function (data){
                    let modal = document.querySelector('#receivedMatchModal');

                    for (let user of data){
                        modal.querySelector(".modal-content").id = requestingUserId;
                        modal.querySelector("#receivedMatchModalImg").src = user.profileImage;
                        modal.querySelector("#receivedProfileName").innerHTML = "Naam: " + user.fullName;
                        modal.querySelector("#receivedProfileGender").innerHTML = "Geslacht: " + user.gender;
                        modal.querySelector("#receivedProfileAge").innerHTML = "Leeftijd: " + user.age;
                        modal.querySelector("#receivedProfileNat").innerHTML = "Nationaliteit: " + user.nationality;
                        modal.querySelector("#receivedProfileBio").innerHTML = "Bio: " + user.discription;

                        let startRevText = user.startDate.slice(0,10);
                        const startRevDateArr = startRevText.split('-');
                        let startRevDate = startRevDateArr[2] + "-" + startRevDateArr[1] + "-" + startRevDateArr[0];

                        let endRevText = user.endDate.slice(0,10);
                        const endDateArr = endRevText.split('-');
                        let endRevDate = endDateArr[2] + "-" + endDateArr[1] + "-" + endDateArr[0];

                        modal.querySelector("#receivedProfileTrip").innerHTML = "Trip info: In " + user.location + " van "
                            + startRevDate + " tot " + endRevDate;
                    }
                })

                // ophalen interesses van potentiële match
                FYSCloud.API.queryDatabase(
                    "SELECT name FROM user_interest AS ui INNER JOIN interest AS i ON ui.interestID = i.interestID WHERE ui.userID = (?)",
                    [requestingUserId]
                ).then(function (data){

                    let interests = "";
                    let modal = document.querySelector('#receivedMatchModal');

                    for (let interest of data){
                        if (interest === data[data.length - 1]){
                            interests += interest.name
                        }else {
                            interests += interest.name + ", "
                        }
                    }

                    modal.querySelector("#receivedProfileIntrest").innerHTML = "Interesse(s): " + interests;
                })

                // wanneer user op profiel klikt open modal
                modal.style.display = "block";

                let span = document.querySelector("#closeSpanReceived");

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
    }
})

document.querySelector("#receivedCancelButton").addEventListener("click", function (e) {
    rejectMatchRequest()
})

document.querySelector("#sendCancelButton").addEventListener("click", function (e) {
    cancelSendRequest()
})

function rejectMatchRequest(){
    let requestingUser = document.querySelector(".receivedProfiles").id;
    let receivingUser = 1;

    // 1 word userID
    FYSCloud.API.queryDatabase(
        "DELETE FROM `match` WHERE requestID = (?) AND receiveID = (?)",
        [requestingUser, receivingUser]
    ).then(function (){
        location.reload();
    })
}

function cancelSendRequest(){
    let requestedUserId = document.querySelector(".sendProfiles").id;
    let sendingUser = 1;

    // 1 word userID
    FYSCloud.API.queryDatabase(
        "DELETE FROM `match` WHERE requestID = (?) AND receiveID = (?) AND status = 1",
        [sendingUser, requestedUserId]
    ).then(function (){
        location.reload();
    })
}

document.querySelector("#receivedButton").addEventListener("click", function (e) {
    updateReceivedRequest()
})

function updateReceivedRequest(){
    let requestingUser = document.querySelector(".receivedProfiles").id;
    let receivingUser = 1; // 1 word userID

    FYSCloud.API.queryDatabase(
        "UPDATE `match` SET status = 2 WHERE requestID = (?) AND receiveID = (?)",
        [requestingUser, receivingUser]
    ).then(function (){
        location.reload();
    })
}

document.querySelector("#sendButton").addEventListener("click", function (e) {
    let modal = document.querySelector('#sendMatchModal');

    // wanneer user op profiel klikt open modal
    modal.style.display = "none";
})

// krijg gemaakte matches
FYSCloud.API.queryDatabase(
    "SELECT CONCAT(u.firstName, \" \", u.lastName) AS fullName, u.profileImage, u.userID FROM user AS u INNER JOIN `match` AS m ON u.userID = m.requestID WHERE m.receiveID = (?) AND m.status = 2",
    [userID]
).then(function (data) {
    if (data.length === 0){
        let matchDiv = document.querySelector("#madeMatches");
        const p = document.createElement("p")
        const text = document.createTextNode("Helaas, er zijn geen matches gevonden.")

        p.appendChild(text)

        matchDiv.appendChild(p)
    }else {
        // html template ophalen
        let template = document.querySelector('#match-template').content
        // voor elke mogelijke match html template vullen
        for (let user of data) {
            let matchProfile = template.cloneNode(true)
            let name = user.fullName;
            let img = user.profileImage;
            let userID = user.userID;

            matchProfile.querySelector("#matchName").innerHTML = name
            matchProfile.querySelector("#matchImage").src = img
            matchProfile.querySelector(".profile-user").id = userID

            document.querySelector("#madeMatches").append(matchProfile)

            const matchProfiles = document.querySelectorAll(".profile-user");
            matchProfiles.forEach(matchProfile=> {
                matchProfile.addEventListener("click", function (e) {
                    let matchModal = document.querySelector('#matchModal');

                    let img = matchProfile.querySelector("#matchImage").src;
                    let name = matchProfile.querySelector("#matchName").innerHTML;

                    matchModal.querySelector("#madeMatchImg").src = img;
                    matchModal.querySelector("#madeMatchName").innerHTML = "Naam: " + name;

                    let matchID = matchProfile.id;

                    FYSCloud.API.queryDatabase(
                        "SELECT ui.gender, ui.age, ui.nationality, ui.discription, t.location, t.startDate, t.endDate FROM user AS u INNER JOIN userinfo AS ui ON u.userID = ui.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE u.userID = (?)",
                        [matchID]
                    ).then(function (data){
                        let modal = document.querySelector('#matchModal');

                        for (let user of data){
                            modal.querySelector("#madeMatchGender").innerHTML = "Geslacht: " + user.gender;
                            modal.querySelector("#madeMatchAge").innerHTML = "Leeftijd: " + user.age;
                            modal.querySelector("#madeMatchNat").innerHTML = "Nationaliteit: " + user.nationality;
                            modal.querySelector("#madeMatchBio").innerHTML = "Bio: " + user.discription;

                            let startMatchText = user.startDate.slice(0,10);
                            const startMatchDateArr = startMatchText.split('-');
                            let startMatchDate = startMatchDateArr[2] + "-" + startMatchDateArr[1] + "-" + startMatchDateArr[0];

                            let endMatchText = user.endDate.slice(0,10);
                            const endMatchDateArr = endMatchText.split('-');
                            let endMatchDate = endMatchDateArr[2] + "-" + endMatchDateArr[1] + "-" + endMatchDateArr[0];

                            modal.querySelector("#madeMatchTrip").innerHTML = "Trip info: In " + user.location + " van "
                                + startMatchDate + " tot " + endMatchDate;
                        }
                    })

                    // ophalen interesses van potentiële match
                    FYSCloud.API.queryDatabase(
                        "SELECT name FROM user_interest AS ui INNER JOIN interest AS i ON ui.interestID = i.interestID WHERE ui.userID = (?)",
                        [matchID]
                    ).then(function (interests){

                        let interestString = "";
                        let modal = document.querySelector('#matchModal');

                        for (let interest of interests){
                            if (interest === interests[interests.length - 1]){
                                interestString += interest.name
                            }else {
                                interestString += interest.name + ", "
                            }
                        }

                        modal.querySelector("#madeMatchIntrest").innerHTML = "Interesse(s): " + interestString;
                    })

                    // wanneer user op profiel klikt open modal
                    matchModal.style.display = "block";

                    let span = document.querySelector("#matchSpan");

                    // wanneer user op kruisje klikt, sluiten
                    span.addEventListener("click", function () {
                        matchModal.style.display = "none";
                    })

                    // wanneer user naast modal klikt, modal sluiten
                    window.onclick = function (event) {
                        if (event.target === matchModal) {
                            matchModal.style.display = "none";
                        }
                    }
                })
            })
        }
    }
})

document.querySelector("#removeButton").addEventListener("click", function (){
    let requestedUserId = document.querySelector(".profile-user").id;
    let loggedUserID = 1;

    // 1 word userID
    FYSCloud.API.queryDatabase(
        "DELETE FROM `match` WHERE requestID = (?) AND receiveID = (?) AND status = 2",
        [requestedUserId, loggedUserID]
    ).then(function (){
        location.reload()
    })
})
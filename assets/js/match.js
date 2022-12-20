// user is nu nog 1, geen link met login
const userID = 1     //FYSCloud.Session.get("userID")

/*
// code voor het ophalen van mogelijke matches
// ophalen interests van ingelogde user, plaatsen in array om in query te verwerken
*/
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

    FYSCloud.API.queryDatabase(
        "SELECT startDate, endDate, location FROM tripinfo WHERE userID = (?)",
        [userID]
    ).then(function (data) {
        let startDate;
        let endDate;
        let location;

        // data trip info van ingelogde gebruiker ophalen en in variabele plaatsen
        for (let user of data){
            startDate = user.startDate;
            endDate = user.endDate;
            location = user.location;
        }

        // datums juiste format geven
        startDate = startDate.slice(0, 10);
        endDate = endDate.slice(0, 10);

        // gegevens ophalen mogelijke matches voor de ingelogde user
        FYSCloud.API.queryDatabase(
            "SELECT DISTINCT u.userID, u.firstName, u.lastName, u.profileImage FROM user AS u INNER JOIN user_interest AS i ON u.userID = i.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE i.userID != (?) AND u.userID not in (select m.requestID from `match` AS m) AND u.userID not in (select m.receiveID from `match` AS m) AND i.interestID IN (?) AND ((?) BETWEEN t.startDate AND t.endDate OR (?) BETWEEN t.startDate AND t.endDate OR (?) BETWEEN t.startDate AND t.endDate AND (?) BETWEEN t.startDate AND t.endDate ) AND t.location = (?)",
            [userID, queryVar, startDate, endDate, startDate, endDate, location]
        ).then(function (data) {

            // bericht weergeven bij geen mogelijke matches
            if (data.length === 0){

                // html element aanmaken in het gedeelde van mogelijke matches
                let potMatchDiv = document.querySelector("#potentialMatches");
                const p = document.createElement("p")
                const text = document.createTextNode("Helaas, er zijn geen mogelijke matches gevonden.")

                p.appendChild(text)

                potMatchDiv.appendChild(p)
            }
            // html template ophalen voor mogelijke matches
            let template = document.querySelector('#profiel-template').content

            // voor elke mogelijke match html template vullen
            for (let user of data){
                let matchProfile = template.cloneNode(true)

                // variabele uit data halen
                let name = user.firstName + " " + user.lastName;
                let img = user.profileImage;
                let id = user.userID;

                // variabele toevoegen aan het template per mogelijke match
                matchProfile.querySelector("#namePotMatch").innerHTML = name
                matchProfile.querySelector("#imagePotMatch").src = img
                matchProfile.querySelector(".profile").id = id

                document.querySelector("#potentialMatches").append(matchProfile)
            }

            // mogelijke match profielen als element krijgen
            const profiles = document.querySelectorAll(".profile");

            // voor iedere mogelijke match een eventListener toevoegen, zodat je bij click het profiel kunt zien
            profiles.forEach(profile=>{
                profile.addEventListener("click", function (e) {
                    // krijg model element, waar het profiel zichtbaar in komt
                    let modal = document.querySelector("#profileModal");

                    // krijg userID van potentiële match
                    let potMatchId = profile.id.valueOf();

                    // gegevens van mogelijke match ophalen en in modal plaatsen
                    FYSCloud.API.queryDatabase(
                        "SELECT u.profileImage, CONCAT(u.firstName, ' ', u.lastName) AS fullName, ui.gender, ui.age, ui.nationality, ui.discription, t.location, t.startDate, t.endDate FROM user AS u INNER JOIN userinfo AS ui ON u.userID = ui.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE u.userID = (?)",
                        [potMatchId]
                    ).then(function (data){

                        // krijg modal element
                        let modal = document.querySelector('#profileModal');

                        for (let user of data){
                            // alle data van de user toevoegen aan het profiel modal
                            modal.querySelector(".modal-content").id = potMatchId;
                            modal.querySelector("#potMatchModalImg").src = user.profileImage;
                            modal.querySelector("#profileName").innerHTML = "Naam: " + user.fullName;
                            modal.querySelector("#profileGender").innerHTML = "Geslacht: " + user.gender;
                            modal.querySelector("#profileAge").innerHTML = "Leeftijd: " + user.age;
                            modal.querySelector("#profileNat").innerHTML = "Nationaliteit: " + user.nationality;
                            modal.querySelector("#profileBio").innerHTML = "Bio: " + user.discription;

                            // de trip info juiste format geven
                            let startText = user.startDate.slice(0,10);
                            const startDateArr = startText.split('-');
                            let startDate = startDateArr[2] + "-" + startDateArr[1] + "-" + startDateArr[0];

                            let endText = user.endDate.slice(0,10);
                            const endDateArr = endText.split('-');
                            let endDate = endDateArr[2] + "-" + endDateArr[1] + "-" + endDateArr[0];

                            // trip info ook toevoegen aan profiel modal
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

                        // modal element krijgen, waar het profiel op staat
                        let modal = document.querySelector('#profileModal');

                        // omdat er meerdere interesse kunnen zijn zorgen dat ze de juiste format hebben
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
        }).catch(function () {
            // als er geen matches zijn een message weer geven
            let potMatchDiv = document.querySelector("#potentialMatches");
            const p = document.createElement("p")
            const text = document.createTextNode("Helaas, er zijn geen mogelijke matches gevonden.")

            p.appendChild(text)

            potMatchDiv.appendChild(p)
        })
    })
})

/*
// code voor het maken van een match
// als je in het profiel modal van een mogelijke match op de match knop klikt
*/
document.querySelector("#matchButton").addEventListener("click",function (){
    // id van mogelijke match uit element halen
    let potMatchId = parseInt(document.querySelector(".modal-content").id);
    const status = 1;

    // match in de database plaatsen, met als status 1 (verzonden, maar niet geaccepteerd)
    FYSCloud.API.queryDatabase(
        "INSERT INTO `match` (requestID, receiveID, status) VALUES (?, ?, ?)",
        [userID, potMatchId, status]
    ).then(function (){
        location.reload();
    }).catch(function (reason) {
        console.log(reason)
    })
})

/*
// code voor het ophalen van de verzonden verzoeken van de ingelogde gebruiker
*/
FYSCloud.API.queryDatabase(
    "SELECT u.userID, CONCAT(u.firstName, \" \", u.lastName) AS fullName, u.profileImage FROM `user` AS u INNER JOIN `match` AS m ON u.userID = m.receiveID WHERE m.requestID = (?) AND m.status = 1",
    [userID]
).then(function (data) {
    // message voor geen verzonden match verzoeken
    if (data.length === 0){

        // html element aanmaken in het stuk verzonden verzoeken
        let potMatchDiv = document.querySelector("#sendMatches");
        const p = document.createElement("p")
        const text = document.createTextNode("Helaas, er zijn geen verzonden verzoeken gevonden.")

        p.appendChild(text)

        potMatchDiv.appendChild(p)
    }

    // html template ophalen voor verzonden verzoeken
    let template = document.querySelector('#send-profiel-template').content

    // voor elke mogelijke match html template vullen
    for (let user of data) {
        // data in variabele plaatsen
        let sendProfile = template.cloneNode(true)
        let name = user.fullName;
        let img = user.profileImage;
        let id = user.userID;

        // data aan template toevoegen
        sendProfile.querySelector("#nameSendMatch").innerHTML = name
        sendProfile.querySelector("#imageSendMatch").src = img
        sendProfile.querySelector(".sendProfiles").id = id

        document.querySelector("#sendMatches").append(sendProfile)

        // alle verzonden verzoeken ophalen
        const sendProfiles = document.querySelectorAll(".sendProfiles");
        // bij elke verzonden verzoek een eventListener toevoegen om modal te kunnen openen
        sendProfiles.forEach(sendProfile=> {
            sendProfile.addEventListener("click", function (e) {
                // krijg modal
                let modal = document.querySelector('#sendMatchModal');

                // id toevoegen aan cancel modal
                modal.querySelector(".send-modal-content").id = sendProfile.id

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

/*
// code voor ophalen ontvangen match verzoeken
*/
FYSCloud.API.queryDatabase(
    "SELECT u.userID, CONCAT(u.firstName, \" \", u.lastName) AS fullName, u.profileImage FROM `user` AS u INNER JOIN `match` AS m ON u.userID = m.requestID WHERE m.receiveID = (?) AND m.status = 1",
    [userID]
).then(function (data) {
    // message voor geen data
    if (data.length === 0){
        // element maken voor de error message
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
        // voor elke ontvangen verzoek een eventListener toevoegen om profiel te openen
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
                        // data van gebruiker toevoegen aan profiel
                        modal.querySelector(".received-modal-content").id = requestingUserId;
                        modal.querySelector("#receivedMatchModalImg").src = user.profileImage;
                        modal.querySelector("#receivedProfileName").innerHTML = "Naam: " + user.fullName;
                        modal.querySelector("#receivedProfileGender").innerHTML = "Geslacht: " + user.gender;
                        modal.querySelector("#receivedProfileAge").innerHTML = "Leeftijd: " + user.age;
                        modal.querySelector("#receivedProfileNat").innerHTML = "Nationaliteit: " + user.nationality;
                        modal.querySelector("#receivedProfileBio").innerHTML = "Bio: " + user.discription;

                        // tripinfo in juiste format zetten
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

                    // voor meerdere interesses zorgen voor juiste format
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

/*
// eventListener voor het afwijzen van een ontvangen match verzoek
*/
document.querySelector("#receivedCancelButton").addEventListener("click", function (e) {
    rejectMatchRequest()
})

// methode voor het afwijzen van een ontvangen match verzoek
function rejectMatchRequest(){
    let requestingUser = document.querySelector(".received-modal-content").id;

    FYSCloud.API.queryDatabase(
        "DELETE FROM `match` WHERE requestID = (?) AND receiveID = (?)",
        [requestingUser, userID]
    ).then(function (){
        location.reload();
    })
}

/*
// eventListener voor het annuleren van een verzonden match verzoek
*/
document.querySelector("#sendCancelButton").addEventListener("click", function (e) {
    cancelSendRequest()
})

// methode voor het annuleren van een verzonden match verzoek
function cancelSendRequest(){
    let requestedUserId = document.querySelector(".send-modal-content").id;

    FYSCloud.API.queryDatabase(
        "DELETE FROM `match` WHERE requestID = (?) AND receiveID = (?) AND status = 1",
        [userID, requestedUserId]
    ).then(function (){
        location.reload();
    })
}


/*
// eventListener voor het accepteren van een ontvangen match verzoek
*/
document.querySelector("#receivedButton").addEventListener("click", function (e) {
    updateReceivedRequest()
})

// methode voor het accepteren van een ontvangen match verzoek
function updateReceivedRequest(){
    let requestingUser = document.querySelector(".received-modal-content").id;
    let receivingUser = 1; // 1 word userID

    FYSCloud.API.queryDatabase(
        "UPDATE `match` SET status = 2 WHERE requestID = (?) AND receiveID = (?)",
        [requestingUser, receivingUser]
    ).then(function (){
        location.reload();
    })
}

// eventListener voor het klikken op 'Ok', bij het bekijken van je verzonden match verzoeken
document.querySelector("#sendButton").addEventListener("click", function (e) {
    let modal = document.querySelector('#sendMatchModal');

    // modal sluiten als je op 'Ok' klikt
    modal.style.display = "none";
})

/*
// code voor het verkrijgen van de gemaakte matches
*/
FYSCloud.API.queryDatabase(
    "SELECT CONCAT(u.firstName, \" \", u.lastName) AS fullName, u.profileImage, u.userID FROM user AS u INNER JOIN `match` AS m ON u.userID = m.requestID WHERE m.receiveID = (?) AND m.status = 2 UNION SELECT CONCAT(u.firstName, \" \", u.lastName) AS fullName, u.profileImage, u.userID FROM user AS u INNER JOIN `match` AS m ON u.userID = m.receiveID WHERE m.requestID = (?) AND m.status = 2 ",
    [userID, userID]
).then(function (data) {
    // check voor geen gemaakte matches
    if (data.length === 0){
        // element maken voor een message
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
            // per match variabele vullen
            let matchProfile = template.cloneNode(true)
            let name = user.fullName;
            let img = user.profileImage;
            let userID = user.userID;

            // variabele toevoegen aan de template
            matchProfile.querySelector("#matchName").innerHTML = name
            matchProfile.querySelector("#matchImage").src = img
            matchProfile.querySelector(".profile-user").id = userID

            document.querySelector("#madeMatches").append(matchProfile)

            // alle matches ophalen
            const matchProfiles = document.querySelectorAll(".profile-user");

            // voor alle matches een eventListener toevoegen voor het openen van hun profiel
            matchProfiles.forEach(matchProfile=> {
                matchProfile.addEventListener("click", function (e) {
                    let matchModal = document.querySelector('#matchModal');

                    let img = matchProfile.querySelector("#matchImage").src;
                    let name = matchProfile.querySelector("#matchName").innerHTML;

                    matchModal.querySelector(".match-modal-content").id = matchProfile.id
                    matchModal.querySelector("#madeMatchImg").src = img;
                    matchModal.querySelector("#madeMatchName").innerHTML = "Naam: " + name;

                    let matchID = matchProfile.id;

                    // verdere informatie over gemaakte match ophalen
                    FYSCloud.API.queryDatabase(
                        "SELECT ui.gender, ui.age, ui.nationality, ui.discription, t.location, t.startDate, t.endDate FROM user AS u INNER JOIN userinfo AS ui ON u.userID = ui.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE u.userID = (?)",
                        [matchID]
                    ).then(function (data){
                        let modal = document.querySelector('#matchModal');

                        for (let user of data){
                            // alle ontvangen data toevoegen aan de modal
                            modal.querySelector("#madeMatchGender").innerHTML = "Geslacht: " + user.gender;
                            modal.querySelector("#madeMatchAge").innerHTML = "Leeftijd: " + user.age;
                            modal.querySelector("#madeMatchNat").innerHTML = "Nationaliteit: " + user.nationality;
                            modal.querySelector("#madeMatchBio").innerHTML = "Bio: " + user.discription;

                            // trip info het juiste format geven
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

                    // ophalen interesses van gemaakte match
                    FYSCloud.API.queryDatabase(
                        "SELECT name FROM user_interest AS ui INNER JOIN interest AS i ON ui.interestID = i.interestID WHERE ui.userID = (?)",
                        [matchID]
                    ).then(function (interests){

                        let interestString = "";
                        let modal = document.querySelector('#matchModal');

                        // bij meerdere interesses voor juiste format zorgen
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

// eventListener voor het verwijderen van een gemaakte match
document.querySelector("#removeButton").addEventListener("click", function (){
    let requestedUserId = document.querySelector(".match-modal-content").id;

    // query voor als ingelogde gebruiker de ontvangende id is
    FYSCloud.API.queryDatabase(
        "DELETE FROM `match` WHERE requestID = (?) AND receiveID = (?) AND status = 2",
        [requestedUserId, userID]
    ).then(function (){
        location.reload()
    })

    // query voor als ingelogde gebruiker de verzoekende id is
    FYSCloud.API.queryDatabase(
        "DELETE FROM `match` WHERE requestID = (?) AND receiveID = (?) AND status = 2",
        [userID, requestedUserId]
    ).then(function (){
        location.reload()
    })
})

// eventListener voor het openen van het mail form, als je op 'Stuur bericht klikt'
document.querySelector("#mailButton").addEventListener("click", function (e){
    let modal = document.querySelector("#mailModal")
    let modalMatch = document.querySelector("#matchModal")

    // profiel modal sluiten en mail modal openen
    modalMatch.style.display = "none"
    modal.style.display = "block"

    let match = document.querySelector(".match-modal-content")
    let name = match.querySelector("#madeMatchName").innerHTML.slice(5)
    modal.querySelector("#mailName").innerHTML = "Stuur " + name + " een bericht!";

    let span = document.querySelector("#closeSpanMail");

    // wanneer user op kruisje klikt, sluiten
    span.addEventListener("click", function () {
        modal.style.display = "none";
        modal.querySelector("#mailText").value = "";

        // als de error er staat, die weghalen
        if (modal.querySelector("#errorMessage")){
            modal.querySelector("#errorMessage").remove();
        }
    })

    // wanneer user naast modal klikt, modal sluiten
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            modal.querySelector("#mailText").value = "";

            // als de error er staat, die weghalen
            if (modal.querySelector("#errorMessage")){
                modal.querySelector("#errorMessage").remove();
            }
        }
    }
})

// eventListener voor het versturen van een email naar de match
document.querySelector("#sendMailButton").addEventListener("click", function (e) {
    let modal = document.querySelector("#mailModal")
    let mailText = modal.querySelector("#mailText").value;

    let userID = document.querySelector(".match-modal-content").id

    let name;
    let email;

    // email en naam van de match ophalen
    FYSCloud.API.queryDatabase(
        "SELECT CONCAT(firstName, \" \", lastName) AS fullName, email FROM user WHERE userID = (?)",
        [userID]
    ).then(function (data) {
        // data in variabele plaatsen
        for (let user of data){
            name = user.fullName;
            email = user.email;
        }

        // als het tekstveld niet leeg is mail versturen
        if (mailText.trim() !== ""){
            FYSCloud.API.sendEmail({
                from: {
                    name: "Groep3",
                    address: "Groep3@fys.cloud"
                },
                to: [
                    {
                        name: name,
                        address: email
                    }
                ],
                subject: "Bericht vanuit TripBuddy",
                html: "<h1>Hallo " + name + "!</h1>" +
                    "<p>" + mailText + "</p>"
            }).then(function(data) {
                console.log(data);
            }).catch(function(reason) {
                console.log(reason);
            });

            // modal weer leeg maken en sluiten
            modal.style.display = "none";
            modal.querySelector("#mailText").value = "";
            // als de error er staat, die ook weghalen
            if (modal.querySelector("#errorMessage")){
                modal.querySelector("#errorMessage").remove();
            }
        }else{
            // error message toevoegen bij leeg text veld
            let mailDiv = document.querySelector("#mailMessage");
            const p = document.createElement("p")
            const text = document.createTextNode("Bericht kan niet leeg zijn!")

            p.appendChild(text)
            p.id = "errorMessage";
            mailDiv.appendChild(p)
        }
    })
})

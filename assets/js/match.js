/*
Ophalen data van interest
 */

// user is nu nog 1, geen link met login
const userID = 1        //FYSCloud.Session.get("userID")

// ophalen interests van ingelogde user
FYSCloud.API.queryDatabase(
    "SELECT interestID FROM user_interest WHERE userID = (?)",
    [userID]
).then(function (data){
    console.log(data)

    let queryVar = []; // array met interesses van ingelogde gebruiker
    let counter = 0;

    // interests van ingelogde user in een variabele zetten, voor volgende query
    data.forEach(value => {
        for (let key in value){
            queryVar[counter] = value[key]
            counter++;
        }
    })

    console.log(queryVar)

    // startdatum, einddatum en locatie trip, van ingelogde user, nog in query verwerken

    // gegevens ophalen mogelijke matches voor de ingelogde user
    FYSCloud.API.queryDatabase(
        "SELECT DISTINCT u.userID, u.firstName, u.lastName, u.profileImage FROM user AS u INNER JOIN user_interest AS i ON u.userID = i.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE i.userID != (?) AND i.interestID IN (?) AND (\"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate AND \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate ) AND t.location = \"Spanje\"",
        [userID, queryVar]
    ).then(function (data) {

        console.log(data)

        let template = document.querySelector('#profiel-template').content
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
    })
})

console.log("=======================================")

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









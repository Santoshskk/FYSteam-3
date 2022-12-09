/*
Ophalen data van interest
 */
FYSCloud.API.queryDatabase(
    "SELECT * FROM interest"
).then(function(data) {
    let template = document.querySelector('#profiel-template').content
    for (let interesse of data) {
        let gebruiker = template.cloneNode(true)
        gebruiker.querySelector("#naam").innerHTML = interesse.name
        document.querySelector("#gebruikers").append(gebruiker)
    }

})


const userID = 1        //FYSCloud.Session.get("userID")
FYSCloud.API.queryDatabase(
    "SELECT interestID FROM user_interest WHERE userID = (?)",
    [userID]
).then(function (interests){

    let queryVar = "";

    interests.forEach(interest => {
        for (let key in interest){
            if(interests[interests.length-1] === interest){
                queryVar += interest[key]
            }else {
                queryVar += interest[key] + ","
            }
        }
    })

    FYSCloud.API.queryDatabase(
        "SELECT DISTINCT u.userID, u.firstName, u.lastName, u.profileImage FROM user AS u INNER JOIN user_interest AS i ON u.userID = i.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE i.userID != 1 AND i.interestID IN (1,2) AND (\"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate OR \"2023-01-01 00:00:00\" BETWEEN t.startDate AND t.endDate AND \"2023-01-09 00:00:00\" BETWEEN t.startDate AND t.endDate ) AND t.location = \"Spanje\"",
        [userID, queryVar]

    )
})

console.log("=======================================")








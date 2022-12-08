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
        console.log(interests)
    // let test = 0;
    //
    //     for (const [key, value] of Object.entries(interests[interests])) {
    //
    //         console.log(key+value)
    //
    //         test++
    //     }

    interests.forEach(interest => {
        for (let key in interest){
            if(Object.is(interest.length -1, key)){
                queryVar += interest[key]
            }
            queryVar += interest[key] + ","
        }
    })

    console.log(queryVar)
})

FYSCloud.API.queryDatabase(
    "SELECT DISTINCT u.userID, u.firstName, u.lastName, u.profileImage FROM user AS u INNER JOIN user_interest AS i ON u.userID = i.userID INNER JOIN tripinfo AS t ON u.userID = t.userID WHERE i.userID != (?) AND i.interestID IN (?) AND \"2023-01-03 00:00:00\" BETWEEN t.startDate AND t.endDate AND t.location = Spanje",
    [userID]

)

console.log("=======================================")








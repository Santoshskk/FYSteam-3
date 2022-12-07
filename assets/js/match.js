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

var image = document.getElementById('image')

console.log("=======================================")








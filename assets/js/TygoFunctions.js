//function to GET data from database
    function GetFromDatabase(idArray, tagType, query, HasImage, ImgId) {

    FYSCloud.API.queryDatabase
    (query).then(function(data) {
        data = data[0]
            let counter = 1;
            var la = 0;
            for (const [key, value] of Object.entries(data[userID - 1])) {
                console.log(key)
            if(HasImage && key === "profileImage") {
                document.getElementById(ImgId).src = value;
            }
                switch (tagType) {
                    case "HTMLText":
                        document.getElementById(idArray[counter - 1]).innerHTML = value;
                        break;
                    case "inputText":
                        document.getElementById(idArray[counter - 1]).value = value;
                        break;
                }
                counter++;
            }
        }
    );
}
//
function UpdateUserInformation(CurrentUser) {
    FYSCloud.API.queryDatabase("CALL UpdateUserInformation(?,?,?,?,?,?,?,?,?)",
        [CurrentUser.firstName,
            CurrentUser.lastName,
            CurrentUser.email,
            CurrentUser.nationality,
            CurrentUser.gender,
            CurrentUser.profileImage,
            CurrentUser.age,
            CurrentUser.discription,
            userID
        ]).then(function () {
        window.location.href = "ProfilePage.html";
    })
}


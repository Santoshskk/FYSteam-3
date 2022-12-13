//script with all Stored procedures
//Tygo

function UpdateUserInformation(CurrentUser) {
    FYSCloud.API.queryDatabase("CALL UpdateUserInformation(?,?,?,?,?,?,?,?,?)",
        [CurrentUser.firstName,
            CurrentUser.lastName,
            CurrentUser.email,
            CurrentUser.nationality,
            CurrentUser.gender,
            CurrentUser.age,
            CurrentUser.discription,
            CurrentUser.profileImage,
            userID
        ]).then(function () {
        window.location.href = "ProfilePage.html";
    })
}

function SetProfileImage(CurrentUser) {
    FYSCloud.API.queryDatabase("CALL SetProfileImage(?,?)",
        [
            CurrentUser.profileImage,
            userID
        ]).then(function () {
        window.location.href = "ProfilePage.html";
    })
}
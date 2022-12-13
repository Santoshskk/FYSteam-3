//function to call stored procedure to get all user information
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
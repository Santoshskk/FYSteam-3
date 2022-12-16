//script with all Stored procedures
//Tygo


//returns array.
/*
1: call to store procedure
2: parameters SP
 */
function GetAllUserInformation() {
   return ["CALL GetAllUserInformation(?)",
       userID
       ];
}

function GetAllTripInfo() {
    return ["CALL GetAllTripInfo(?)",
    userID]
}



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

function UpdateTripInfo(CurrentData) {
    FYSCloud.API.queryDatabase("CALL UpdateTripInfo(?,?,?,?)",
        [
            CurrentData.country,
            CurrentData.startDate,
            CurrentData.endDate,
            userID
        ]).then(function () {
        window.location.href = "ProfilePage.html";
    })
}


function GetAllCountry() {
    return ["CALL GetAllCountry"];
}

function GetAllInterest() {
    return ["CALL GetAllInterests"];
}

function GetTripInfoDates() {
    return ["CALL GetTripInfoDates(?)", userID]
}
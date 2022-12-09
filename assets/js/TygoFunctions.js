

//function to GET data from database
    function GetFromDatabase(idArray, tagType, query, HasImage, ImgId) {

    FYSCloud.API.queryDatabase
    (query).then(function(data) {
            let counter = 1;
            for (const [key, value] of Object.entries(data[userID - 1])) {

            if(HasImage) {
                if (key === "profileImage") {
                    console.log(value)
                    const defaultPic = "https://www.showflipper.com/blog/images/default.jpg";
                    if (value != null) {
                        document.getElementById(ImgId).src = value;
                    } else {
                        document.getElementById(ImgId).src = defaultPic;
                    }
                }
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
//
//
// function UpdateDB2(Obj, tableName, userID) {
//     const dic = {
//     };
//
//     for (let i = 0; i <= tableName.length -1; i++) {
//         FYSCloud.API.queryDatabase("SELECT count(*) AS NUMBEROFCOLUMNS FROM information_schema.columns WHERE table_name = ?;"
//             , [tableName[i]]).then(function (data) {
//             console.log(data)
//         })
//     }
//     for (const [key, value] of Object.entries(Obj)) {
//
//         dict.push({
//             key:   tableName[0],
//         });
//         FYSCloud.API.queryDatabase("UPDATE user, userinfo SET user.? = ? WHERE user.userID = (?) AND  userinfo.userID = (?);", [ key, value, userID, userID]);
//     }
//     //window.location.href = "ProfilePage.html";
//
// }
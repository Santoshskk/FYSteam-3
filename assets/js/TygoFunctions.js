//function to GET data from database
    function GetFromDatabase(idArray, tagType, query, HasImage, ImgId) {

    FYSCloud.API.queryDatabase(query).then(function(data) {
        data = data[0]
            let counter = 1;
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

//function to upload image to fyscloud
function UploadImage(submittedValuesArr, fileUploadId, SPNamesArr) {

    FYSCloud.Utils.getDataUrl(document.querySelector("#" + fileUploadId))
        .then(function (data) {
            let name = "img.png";
            FYSCloud.API.deleteFile(name);
            FYSCloud.API.uploadFile(
                name,
                data.url
            ).then(function (data) {
                newProfileImage = data;
                UpdateDB(getValues(newProfileImage, submittedValuesArr, SPNamesArr), false);
            }).catch(function (reason) {
                console.log(reason)
            });
        }).catch(function (reason) {
        UpdateDB(getValues(null, submittedValuesArr,SPNamesArr));
    });
}

//create object from submitted values for input field. to send to SP.
function getValues(profileImage, inputIdArr, storedProceduresVarNames) {

    let submittedValues = {
        profileImage: profileImage
    };
    for (let i = 0; i <= inputIdArr.length -1 ; i++) {
        const item = document.querySelector("#" + inputIdArr[i]).value;
        submittedValues[storedProceduresVarNames[i]] = item
    }
    return submittedValues;
}
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

function UpdateDB(Data, expectedSP) {

    switch (expectedSP) {
        case "UpdateUserInformation":
            UpdateUserInformation(Data);
            break;
    }
}

//function to upload image to fyscloud. and save in database with call to updateDB function
function UploadImage(submittedValuesArr, fileUploadId, SPNamesArr, expectedSP) {

    FYSCloud.Utils.getDataUrl(document.querySelector("#" + fileUploadId))
        .then(function (data) {
            let name = "img.png";
            FYSCloud.API.deleteFile(name);
            FYSCloud.API.uploadFile(
                name,
                data.url
            ).then(function (data) {
                newProfileImage = data;
                UpdateDB(getValues(newProfileImage, submittedValuesArr, SPNamesArr), expectedSP);
            }).catch(function (reason) {
                console.log(reason)
            });
        }).catch(function (reason) {
        UpdateDB(getValues(null, submittedValuesArr,SPNamesArr), expectedSP);
    });
}

//create object from submitted values for input field. to send to SP.
/*
parameters
profileImage = if nessecary url to image. can be set to null
inputIdArr = id names (in HTML) to get value from input fields
storedProceduresVarNames = array with strings. must be the same name as stored procedure parameters
                           want to use. to create object to call SP

 */
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
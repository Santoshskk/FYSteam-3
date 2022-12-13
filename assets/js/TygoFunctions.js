//Dynamic functions

//function to GET data from database
/*
idArray = array with names of html tags. these are the items where you want to display the data database
tagType = type of tag to display
query = the SELECT query you want use to get from database
HasImage = boolean. checks if page has a image
ImgId = img url. not nessecary
 */
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

//function to call SP and make changes to database
/*
Data = this is return value from getValues(). object with all values that user has submitted to fields
expectedSP = stored procedure u want to use
 */
function UpdateDB(Data, expectedSP) {

    switch (expectedSP) {
        case "UpdateUserInformation":
            UpdateUserInformation(Data);
            break;
        case "SetProfileImage":
            SetProfileImage(Data);
            break;
    }
}

//function to upload image to fyscloud. and save in database with call to updateDB function

/*
parameters
submittedValuesArr = array with submitted values to use in getValues() function
fileUploadId = id of fileUpload tag in html.
SPNamesArr = Stored procedure array with names to use in getValues()
expectedSP = Stored procedure u want use.
 */

function UploadImage(submittedValuesArr, fileUploadId, SPNamesArr, expectedSP) {

    FYSCloud.Utils.getDataUrl(document.querySelector("#" + fileUploadId))
        .then(function (data) {
            let name;
            FYSCloud.API.listDirectory().then(function (list) {
                name = "ImgNumber" + (list.length + 1) + ".png";

                FYSCloud.API.uploadFile(
                    name + ".png",
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
})}

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
    };

    if(profileImage != null) {
        submittedValues["profileImage"] = profileImage;
    }

    for (let i = 0; i <= inputIdArr.length -1 ; i++) {
        const item = document.querySelector("#" + inputIdArr[i]).value;
        submittedValues[storedProceduresVarNames[i]] = item
    }
    return submittedValues;
}
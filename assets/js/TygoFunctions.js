//Dynamic functions

//function to GET data from database
/*
idArray = array with names of html tags. these are the items where you want to display the data database
tagType = type of tag to display
1. HTMLTEXT = all text type. [<h1>, <p> etc]
2. inputText = input fields of type text
3. log = set values from database in console
4. dropdown = select fields (dropdown)

query = the SELECT query you want use to get from database. is type array. index 0 is query to call SP. rest is parameters
HasImage = boolean. checks if page has an image
ImgId = img url. not nessecary if there is no image
 */
function GetFromDatabase(idArray, tagType, query, HasImage, ImgId, numberValue) {
    let paramaters = query[1];
    if(query.length === 1) {
        paramaters = null;
    }

    return FYSCloud.API.queryDatabase(query[0], [paramaters]).then(function (data) {
            data = data[0];
        let array = [];
            if(data.length === 1) {
                data = data[0];
            }
            let counter = 1;
            for (const [key, value] of Object.entries(data)) {
                if (HasImage && key === "profileImage") {
                     document.getElementById(ImgId).src = value;
                }
                switch (tagType) {
                    case "HTMLText":
                            document.getElementById(idArray[counter - 1]).innerHTML = value;
                        break;
                    case "inputText":
                        if(key != "profileImage") {
                            document.getElementById(idArray[counter - 1]).value = value;
                        }
                        break;
                    case "list":
                        var list = document.getElementById("list");
                        var entry = document.createElement('li');
                        if(data.length > 1) {
                            entry.appendChild(document.createTextNode(value.name));
                        }
                        else {
                            entry.appendChild(document.createTextNode(value));
                        }
                        list.appendChild(entry);
                        break;
                    case "log":
                            console.log(value)
                        break;
                    case "dropdown":
                            array.push(value.name);
                        if(array.length === data.length) {
                            populateDropdown(idArray, array, numberValue)
                        }
                       break;
                    case "date":
                        const newValue = value.split("T");
                        document.getElementById(idArray[counter - 1]).value = newValue[0];
                        break;
                    case "dateText":
                        const newValue2 = value.split("T");
                        document.getElementById(idArray[counter - 1]).innerHTML = newValue2[0];
                        break;
                    case "valueDropdown":
                        document.getElementById(idArray).value = value;
                        break;
                    case "checkbox":
                        const div = document.getElementById(idArray);
                        const checkBox = document.createElement('input')
                        checkBox.setAttribute("type", "checkbox");
                        div.appendChild(document.createTextNode(value.name));
                        div.appendChild(checkBox);
                        checkBox.id = (counter);

                        let sp = GetCurrentUserInterest(parseInt(checkBox.id));
                        FYSCloud.API.queryDatabase(sp[0], [sp[1], sp[2]]).then(function (data2){
                            for (const [key, value] of Object.entries(data2[0])) {
                                if(value.exists === 1) {
                                    checkBox.checked = true;
                                }
                            }
                        })
                        checkBox.addEventListener('change', function () {
                            if (this.checked) {
                                console.log("checked")
                                checkBoxListener(true, checkBox.id)
                            } else {
                                console.log("not checked")
                                checkBoxListener(false, checkBox.id)
                            }
                        });
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
        case "UpdateTripInfo":
            UpdateTripInfo(Data);
            break;

        case "InsertUserInterest":
            InsertUserInterest(Data);
        break;
        case "DeleteUserInterests":
            DeleteUserInterests(Data);
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
                    UpdateDB(getValues(newProfileImage, submittedValuesArr, SPNamesArr, "input"), expectedSP);
                }).catch(function (reason) {
                    console.log(reason)
                });
            }).catch(function (reason) {
                UpdateDB(getValues(null, submittedValuesArr, SPNamesArr, "input"), expectedSP);
            });
        })
}

//create object from submitted values for input field. to send to SP.
/*
parameters
profileImage = if nessecary url to image. can be set to null
inputIdArr = id names (in HTML) to get value from input fields
storedProceduresVarNames = array with strings. must be the same name as stored procedure parameters
                           want to use. to create object to call SP

 */
function getValues(profileImage, inputIdArr, storedProceduresVarNames, typeInput) {
    let submittedValues = {};
    if (profileImage != null) {
        submittedValues["profileImage"] = profileImage;
    }
    for (let i = 0; i <= inputIdArr.length - 1; i++) {

        if (typeInput === "input") {
            const item = document.querySelector("#" + inputIdArr[i]).value;
            submittedValues[storedProceduresVarNames[i]] = item
        }
        if (typeInput === "checkbox") {
            const item = document.getElementById(inputIdArr[i]);
            submittedValues[storedProceduresVarNames[0]] = item.id;
        }
    }
    return submittedValues;
}

//function to populate a dropdown field.
    /*
    inputId = id of input field
    OptionsArr = array with options
     */
    function populateDropdown(inputId, OptionsArr, numberValue) {
        const select = document.getElementById(inputId);

        for (let i = 0; i < OptionsArr.length; i++) {

            const opt = OptionsArr[i];
            const el = document.createElement("option");
            el.textContent = opt;
            if (numberValue) {
                el.value = (i + 1);
            } else {
                el.value = opt;
            }
            select.appendChild(el);

        }
    }

    function checkBoxListener(checked, checkboxId) {
        let test2 = getValues(null, checkboxId, SPnames_InsertUserInterest, "checkbox");
        if (checked) {
            for (let i = 0; i < Object.keys(test2).length; i++) {
                UpdateDB(test2, "InsertUserInterest");
            }
        } else {
            for (let i = 0; i < Object.keys(test2).length; i++) {
                UpdateDB(test2, "DeleteUserInterests");
            }
        }
    }

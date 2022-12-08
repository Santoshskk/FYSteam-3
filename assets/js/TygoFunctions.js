const userID = FYSCloud.Session.get("userID");

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
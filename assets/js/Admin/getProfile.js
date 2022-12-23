
document.addEventListener('DOMContentLoaded', function () {
        
    function getProfile() {
        return FYSCloud.API.queryDatabase("SELECT * FROM user WHERE userID = (?)", [userID]
            ).then(data => {
                var fullName = data[0].firstName + " " + data[0].lastName;

                document.querySelector('.fullName1').innerText = fullName;
                document.querySelector('.email1').innerText = data[0].email;

                document.querySelector('.fullName2').innerText = fullName;
                document.querySelector('.email2').innerText = data[0].email;
            }).catch(err => {
                console.log(err);
        })
    }

    let test = getProfile().then(() => {
        GetUsers();
    })

    // Get users(not admin(1)) from db.
    const GetUsers = () => {
        FYSCloud.API.queryDatabase(
            "SELECT * FROM user WHERE isAdmin != 1"
        ).then(function (data) {
            let template = document.querySelector('#profileTemp').content;

            let userAmount = "Gebruikers - " + data.length;
            document.querySelector(".userAmount").innerHTML = userAmount;

            let defaultImg = "https://forum.truckersmp.com/uploads/monthly_2019_09/imported-photo-147749.png.96217c5bd3da88ab80a4f453268a4799.png";

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    let matchProfile = template.cloneNode(true);
                    let fullName = data[i].firstName + " " + data[i].lastName;
                    let img = data[i].profileImage;
                    let email = data[i].email;
                    let id = data[i].userID;
                    let isactive = data[i].isActive.data[0];

                    matchProfile.querySelector(".profile").id = id;
                    matchProfile.querySelector("#profileName").innerHTML = fullName;
                    matchProfile.querySelector("#profileEmail").innerHTML = email;

                    if (isactive != 0) {
                        matchProfile.querySelector("#banBtn").innerHTML = "Unban";
                    }
                    if (img) {
                        matchProfile.querySelector("#profileImg").src = img;
                    } else {
                        matchProfile.querySelector("#profileImg").src = defaultImg;
                    }
                    document.querySelector("#profiles").append(matchProfile);
                }
            } else {
                document.querySelector(".tableTxt").classList.add('empty');
            }
            
            let banBtn = document.querySelectorAll(".Ban");
            let delBtn = document.querySelectorAll(".Del");

            banBtn.forEach(btn => {
                btn.addEventListener("click", function (e) {    
                    // get userID
                    let uid = btn.closest('div.profile').id.valueOf();
                    
                    // Check active status.
                    FYSCloud.API.queryDatabase(
                        "SELECT isactive FROM user WHERE userID = (?)",
                        [uid]
                    ).then(data => {
                        let isactive = data[0].isactive.data[0];
                        const banQuery = "UPDATE user SET isactive = 1 WHERE userID = (?)";
                        const unbanQuery = "UPDATE user SET isactive = 0 WHERE userID = (?)";
                        if (isactive != 1) {
                            // Set isactive to 1. (0: normal, 1: banned).
                            FYSCloud.API.queryDatabase(
                                banQuery,
                                [uid]
                            ).then(() => {
                                console.log("The work has been done");
                                document.location.reload();
                            }).catch(err => {
                                console.log(err);
                            })
                        } else {
                            // Set isactive to 1. (0: normal, 1: banned).
                            FYSCloud.API.queryDatabase(
                                unbanQuery,
                                [uid]
                            ).then(() => {
                                console.log("The work has been undone");
                                document.location.reload();
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                })
            })

            delBtn.forEach(btn => {
                btn.addEventListener("click", function (e) {    
                    // get userID
                    let uid = btn.closest('div.profile').id.valueOf();
                    
                    if (confirm(
                        "Are you sure you want to delete this user?",
                        "This action is irreversible"
                    )) {
                        // Set isactive to 1. (0: normal, 1: banned).
                        FYSCloud.API.queryDatabase(
                            "DELETE FROM user WHERE userID = (?)",
                            [uid]
                        ).then(() => {
                            console.log("The work has been done");
                            document.location.reload();
                        }).catch(err => {
                            console.log(err);
                        })
                    } else {
                        console.log("Did NOT delete user.");
                    }
                })
            })

        }).catch(err => {
            console.log(err)
        });
    }
});



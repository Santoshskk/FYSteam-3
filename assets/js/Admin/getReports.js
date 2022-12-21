FYSCloud.API.queryDatabase(
    "SELECT * FROM report ORDER BY created_at DESC"
).then(function (data) {

    for (var i = 0; i < data.length; i++) {
    console.log(data[i].description);
        FYSCloud.API.queryDatabase(
            "SELECT * FROM user WHERE userID = (?) OR userID = (?)", 
            [data[i].reportID, data[i].receiveID]
        ).then(data => {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].firstName);
            }
        })
    }
}).catch(err => {
    console.log(err)
});


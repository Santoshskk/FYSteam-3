const userID = FYSCloud.Session.get("userID");
const isActive = FYSCloud.Session.get("isActive");

FYSCloud.API.configure({
    url: "https://api.fys.cloud",
    apiKey: "fys_is102_3.CCQFcAnNW1sV6uYi",
    database: "fys_is102_3_live",
    environment: "live"
});
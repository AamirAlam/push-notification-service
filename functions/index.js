const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./service/news-app.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://saath-health.firebaseio.com",
});

const express = require("express");
const cors = require("cors");

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post("/news_notification/:admin_id/:admin_pass", async (req, res) => {
  try {
    const admin_id = req.params.admin_id; //"005yB7";
    const admin_pass = req.params.admin_pass; //"N52jMdAczpfBr7qo3";
    if (admin_id !== "005yB7" || admin_pass !== "N52jMdAczpfBr7qo3") {
      return res.status(400).send({ success: false, message: "Unauthorized" });
    }

    let title = req.body.title;
    let body = req.body.desc;

    const topic = "newsNotification";
    var payload = {
      notification: {
        title: title,
        body: body,
      },
    };

    await admin.messaging().sendToTopic(topic, payload);
    res.status(200).send({ success: true, message: "Notification sent" });
  } catch (error) {
    console.log("new_video_service ", error);
    res.status(400).send(error);
  }
});

exports.newsNotification = functions.https.onRequest(app);

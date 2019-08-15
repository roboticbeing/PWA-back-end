<h2>The code you need to copy/paste</h2>
<h3>Server.js</h3>

//Get all news alerts
app.get("/api/feed/news", (req, res) => {
  // Call the manager method
  m.alertGetAllFilterNews()
    .then((data) => {
      res.json(package(data, '/api/feed/news'));
      console.log("Successful Get All News");
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
});

//Get all event alerts
app.get("/api/feed/events", (req, res) => {
  // Call the manager method
  m.alertGetAllFilterEvents()
    .then((data) => {
      res.json(package(data, '/api/feed/events'));
      console.log("Successful Get All Events");
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
});

//Get all announcement alerts
app.get("/api/feed/announcements", (req, res) => {
  // Call the manager method
  m.alertGetAllFilterAnnouncements()
    .then((data) => {
      res.json(package(data, '/api/feed/announcements'));
      console.log("Successful Get All Announcements")
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
  });


  //Get all notice alerts
app.get("/api/feed/notices", (req, res) => {
  // Call the manager method
  m.alertGetAllFilterNotices()
    .then((data) => {
      res.json(package(data, '/api/feed/notices'));
      console.log("Successful Get All Notices");
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
  });

    
//Get all feed alerts
app.get("/api/feed/alerts", (req, res) => {
  // Call the manager method
  m.alertGetAllFilterAlerts()
    .then((data) => {
      res.json(package(data, '/api/feed/alerts'));
      console.log("Successful Get All Alerts");
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
});

// Get all active alerts
app.get("/api/feed/active",  (req, res) => {
  // Call the manager method
  m.alertGetAllActive()
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/feed/active'));
      console.log("Successful Get All Active alerts");
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
});
  
  <h3>manager.js</h3>

   alertGetAllFilterNews: function () {
      return new Promise(function (resolve, reject) {
        //Searches within our database 
        //for a key that matches category 
        //and a value that matches 'news'
        //retrieving all news items
          Alerts.find({category: 'news'})
          .exec((error, items) => {
              if (error) {
                // Query error
                return reject(error.message);
              }
              // Found, a collection will be returned
              return resolve(items);
            });
        })
  },

  alertGetAllFilterEvents: function () {
    return new Promise(function (resolve, reject) {
        Alerts.find({category: 'events'})
        .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      })
},

alertGetAllFilterAnnouncements: function () {
  return new Promise(function (resolve, reject) {
      Alerts.find({category: 'announcements'})
      .exec((error, items) => {
          if (error) {
            // Query error
            return reject(error.message);
          }
          // Found, a collection will be returned
          return resolve(items);
        });
    })
},

alertGetAllFilterNotices: function () {
  return new Promise(function (resolve, reject) {
      Alerts.find({category: 'notices'})
      .exec((error, items) => {
          if (error) {
            // Query error
            return reject(error.message);
          }
          // Found, a collection will be returned
          return resolve(items);
        });
    })
},

alertGetAllFilterAlerts: function () {
  return new Promise(function (resolve, reject) {
      Alerts.find({category: 'alerts'})
      .exec((error, items) => {
          if (error) {
            // Query error
            return reject(error.message);
          }
          // Found, a collection will be returned
          return resolve(items);
        });
    })
},

      alertGetAllActive: function () {
        return new Promise(function (resolve, reject) {
          let now = new Date();
          // Uses a MongoDB query function 
          // to compare the dateExpired value in our database
          // to the current date in our now variable
          // and converts now into an ISO string to match the dateExpired type
          Alerts.find({"dateExpired": {$gte : now.toISOString()}})
            .exec((error, items) => {
              if (error) {
                // Query error
                return reject(error.message);
              }
              return resolve(items);
            });
        })
      }

  





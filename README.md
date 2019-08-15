<h2>The code you need to copy/paste</h2>
<h3>Server.js</h3>
```bash
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
    
//Get all alert alerts
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
```
  
  <!-- <h3>Project Template</h3>
  <p>Features:</p>
  <ul>
    <li>Node.js and Express.js</li>
    <li>Database is MongoDB</li>
    <li>One entity for end users, a collection of automobiles</li>
    <li>Another entity to hold user accounts</li>
    <li>Security is provided by Passport.js and JWT handling</li>
  </ul>

<br>

### How to get started with this template

Copy and paste the project template *folder*, and rename the new folder as you wish. 

In a new CLI (command line interface), navigate to the project folder.  
Run `npm init` to update the name and any other values you wish to update.  
Run `npm i` to rebuild the packages it needs.  

In a new CLI window, create a new folder to hold the database.  
Locate it at the same level as the project folder, or elsewhere to meet your needs.  
*DO NOT* locate it inside the new project folder.  

Start the database engine, which also initializes the database:  

> Replace `databasename` with the name that you used above. 

```bash
mongod --dbpath ./databasename
```

Return to the project CLI window. 

Import the user account starter data:

> Replace `databasename` with the name that you used above. 

```bash
mongoimport --db dps945 --collection persons --file dbdata-persons.json --jsonArray
```

Import the (cars) example starter data:

> Replace `databasename` with the name that you used above. 

```bash
mongoimport --db databasename --collection cars --file dbdata-cars.json --jsonArray
```

Now, open the project in your code editor.  

Update the `databasename` text in `manager.js` (near line 44). 

Generate the value for `jwtOptions.secretOrKey` in `server.js` (near line 54).

Start/run the server.  
Test with Postman.

<br> -->

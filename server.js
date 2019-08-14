
// ################################################################################
// Web service setup

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());

//Rafi's code
// app.use((req, res, next) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, HEAD, OPTIONS");
//   next();
// });

// Add support for CORS
app.use(cors());



// ################################################################################
// Data model and persistent store setup

const manager = require("./manager.js");
const m = manager();



// ################################################################################
// Security setup

// Passport.js components
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

// JSON Web Token Setup
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Configure its options
var jwtOptions = {};
// Configure the issuer
jwtOptions.issuer = 'useraccounts.example.com';
// Choose whether the incoming authorization header scheme is BEARER or JWT
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

// IMPORTANT - the following secret should be a long, unguessable string 
// (ideally stored in a "protected storage" area on the 
// web server, a topic that is beyond the scope of this course)
// You MUST generate a random 64-character string using the following online tool:
// https://lastpass.com/generatepassword.php 
// And use it as the value for the following...
//jwtOptions.secretOrKey = 'generate-your-own-value';
jwtOptions.secretOrKey = '&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {

  // Get the timestamp now
  let now = Date.now();
  now = Math.round(now / 1000);

  // Unpack and validate the token by ensuring that it has not expired
  if (jwt_payload && now < jwt_payload.exp) {
    // Attach the token's contents to the request
    // It will be available as "req.user" in the route handler functions
    next(null, jwt_payload);
  } else {
    next(null, false);
  }
});

// Activate the security system
passport.use(strategy);
app.use(passport.initialize());



// ################################################################################
// Deliver the app's home page to browser clients

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});



// ############################################################
// Requests to handle user account tasks

// Get info about me; it will return the token contents
app.get("/api/useraccounts/me", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Return the token contents
  res.json({ "message": "Token contents", token: req.user });
});

// Get all (for dev testing only; DISABLE or PROTECT before deployment!)
// (Maybe make it available only to requests that have the "UserAccountManager" role)
app.get("/api/useraccounts", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.useraccountsGetAll()
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/useraccounts'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get one (for dev testing only; DISABLE or PROTECT before deployment!)
// (Maybe make it available only to requests that have the "UserAccountManager" role)
app.get("/api/useraccounts/:id", (req, res) => {
  // Call the manager method
  m.useraccountsGetById(req.params.id)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/useraccounts'));
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// User account activate
app.post("/api/useraccounts/activate", (req, res) => {

  // Incoming data package has the following:
  // { "userName": "uuu", "password": "ppp", "passwordConfirm": "ppp", "statusActivated": true, 
  // "roles": ["Role1", "Role2"], 
  // "claims": [ { "type": "OU", "value": "Department1" }, { "type": "Task", "value": "canUpdateProducts" } ] }

  m.useraccountsActivate(req.body)
    .then((data) => {
      res.json({ "message": data });
    }).catch((msg) => {
      res.status(400).json({ "message": msg });
    });
});

// User account register/create
app.post("/api/useraccounts/register", (req, res) => {

  // Incoming data package has the following:
  // { "userName": "uuu", "fullName": "fff", "password": "ppp", "passwordConfirm": "ppp", 
  // "statusActivated": true, "statusLocked": false,
  // "roles": ["Role1", "Role2"], 
  // "claims": [ { "type": "OU", "value": "Department1" }, { "type": "Task", "value": "canUpdateProducts" } ] }

  m.useraccountsRegister(req.body)
    .then((data) => {
      res.json({ "message": data });
      console.log("Successfully registered");
    }).catch((msg) => {
      res.status(400).json({ "message": msg });
      console.log("Error 400", err);
    });
});

// User account login
app.post("/api/useraccounts/login", (req, res) => {

  // Incoming data package has the following:
  // { "userName": "xxx", "password": "yyy" }

  m.useraccountsLogin(req.body)
    .then((data) => {

      // Calculate an expiry time...
      // There are 86400 seconds in a day
      // Assume a token lifetime of 14 days
      let now = Date.now();
      let exp = Math.round(now / 1000) + (86400 * 14);
      // For testing purposes, expire the token in 120 seconds
      //let exp = Math.round(now / 1000) + 120;

      // Configure the payload with data and claims
      // Properties are defined here...
      // https://tools.ietf.org/html/rfc7519
      var payload = {
        iss: 'useraccounts.example.com',
        exp: exp,
        //_id: data._id,
        sub: data.userName,
        email: data.userName,
        name: data.fullName,
        roles: data.roles,
        claims: data.claims
        // Can add more if required
      };
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      // Return the result
      res.json({ "message": "Login was successful", token: token });
      console.log("Login was successful");
    }).catch((msg) => {
      res.status(400).json({ "message": msg });
      console.log("Error 400");
    });
});

// ################################################################################
// Request handlers for data entities (listeners)

// Get all
app.get("/api/persons", (req, res) => {
  // Call the manager method
  m.personGetAll()
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/persons'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get all, PROTECTED!
app.get("/api/personsprotected", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.personGetAll()
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/persons'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get one
app.get("/api/persons/:id", (req, res) => {
  // Call the manager method
  m.personGetById(req.params.id)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/persons'));
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Add new
app.post("/api/persons", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.personAdd(req.body)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/persons'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Edit existing, add claim or role
app.put("/api/persons/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.personEdit(req.body)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/persons'));
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Delete item
app.delete("/api/persons/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.personDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Get all feed items
app.get("/api/feed",  (req, res) => {
  // Call the manager method
  m.alertGetAll()
    .then((data) => {
      //res.json(data);
     // res.json(package(data, '/api/alerts'));
      console.log("Successful Get All");
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
});

//Get all news alerts
app.get("/api/feed/news", (req, res) => {
  // Call the manager method
  m.alertGetAllFilterNews()
    .then((data) => {
      res.json(package(data, '/api/alerts'));
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
      res.json(package(data, '/api/alerts'));
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
      res.json(package(data, '/api/announcements'));
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
      res.json(package(data, '/api/notices'));
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
      res.json(package(data, '/api/feed'));
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
      res.json(package(data, '/api/feed'));
      console.log("Successful Get All Active alerts");
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
      console.log("Error 500", err);
    })
});


// Get one
app.get("/api/feed/:id", (req, res) => {
  // Call the manager method
  m.alertGetById(req.params.id)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/feed'));
      console.log("Successful Get One Feed Item");
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
      console.log("Error 404", err);
    })
});

// Add new
app.post("/api/feed", passport.authenticate('jwt', { session: false }), (req, res) => {
  // req.user has the token contents
  if (req.user.roles.findIndex(role => role === 'contentEditor') > -1) {
    // Success
    m.alertAdd(req.body)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/feed'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
  } else {
    res.status(403).json({ message: "User does not have the role claim needed" })
  }
});
 

// Edit existing
app.put("/api/feed/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.roles.findIndex(role => role === 'contentEditor') > -1) {
  // Call the manager method
  m.alertEdit(req.params.id)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/feed'));
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
  } else {
    res.status(403).json({ message: "User does not have the role claim needed" })
  }
});

// Delete item
app.delete("/api/feed/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.roles.findIndex(role => role === 'contentEditor') > -1) {
  // Call the manager method
  m.alertDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
  } else {
    res.status(403).json({ message: "User does not have the role claim needed" })
  }
});

// Get all text content
app.get("/api/textcontent",  (req, res) => {
  // Call the manager method
  m.textContentGetAll()
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/textcontent'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get one
app.get("/api/textcontent/:id", (req, res) => {
  // Call the manager method
  m.textContentById(req.params.id)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/textcontent'));
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

//Get Danish content
app.get("/api/textcontent/DK", (req, res) => {
  // Call the manager method
  m.textContentGetDanish()
    .then((data) => {
      res.json(package(data, '/api/textcontent/DK'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

//Get English content
app.get("/api/textcontent/EN", (req, res) => {
  // Call the manager method
  m.textContentGetEnglish()
    .then((data) => {
      res.json(package(data, '/api/textcontent/EN'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

//Get English content
app.get("/api/textcontent/AR", (req, res) => {
  // Call the manager method
  m.textContentGetArabic()
    .then((data) => {
      res.json(package(data, '/api/textcontent/AR'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Add new
app.post("/api/textcontent", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.textContentAdd(req.body)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/textcontent'));
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Edit existing, add claim or role
app.put("/api/textcontent/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.textContentEdit(req.body)
    .then((data) => {
      //res.json(data);
      res.json(package(data, '/api/textcontent'));
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Delete item
app.delete("/api/textcontent/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  // Call the manager method
  m.textContentDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});




// ################################################################################
// Hypermedia representation packaging function

function package(incomingData, path) {

  // IMPORTANT - This is used for data stored in MongoDB
  // Its identifier property is "_id" (which is different from "id" or "ID" etc.)

  // Package is an object with these key-value pairs:
  // timestamp  string                 Current date-and-time, as an ISO 8601 string
  // version    string                 Version number identifier (for future use)
  // links      array of link objects  Package-level controls
  // count      number                 Item count being returned
  // data       array of item(s)       Data items, each one includes a "links" collection

  // Common tasks:
  // Add package metadata

  let now = new Date();
  let pkg = {
    timestamp: now.toISOString(),
    version: '1.0.0',
  };

  // Determine if the incoming data is an object or an array
  const isItem = (incomingData.length == undefined);

  // Make a local copy of the incoming data
  // Must do this to break the Mongoose schema prototype dependency
  let data = JSON.parse(JSON.stringify(incomingData));

  if (isItem) {

    // Item tasks:
    // Package links will have self and collection
    // Item links will have self and collection
    // Incoming data is put into an array and added to the package

    pkg.links = [{ href: `${path}/${data._id}`, rel: 'self' }, { href: path, rel: 'collection' }];
    pkg.count = 1;
    data.links = [{ href: `${path}/${data._id}`, rel: 'self' }, { href: path, rel: 'collection' }];
    pkg.data = [data];

  } else {

    // Collection tasks:
    // Package links will have self only
    // Item links will have self for each item, generated 

    pkg.links = [{ href: path, rel: 'self' }];
    pkg.count = data.length;

    // For each syntax
    /*
    data.forEach(e => {
      e.links = [{ href: `${path}/${e.id}`, rel: 'self' }, { href: path, rel: 'collection' }];
    });
    pkg.data = data;
    */

    // Map and spread syntax
    pkg.data = data.map(e => ({ ...e, links: [{ href: `${path}/${e._id}`, rel: 'self' }, { href: path, rel: 'collection' }] }));
  }

  return pkg;
}



// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect().then(() => {
  app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
})
  .catch((err) => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });

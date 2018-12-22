// Initialize Firebase
var config = {
    apiKey: "AIzaSyAvwwIe-aZ8tn2YyGPcoBbMCLkuu3AL2rA",
    authDomain: "fema-tracker.firebaseapp.com",
    databaseURL: "https://fema-tracker.firebaseio.com",
    projectId: "fema-tracker",
    storageBucket: "fema-tracker.appspot.com",
    messagingSenderId: "348926957793"
};
firebase.initializeApp(config);


const auth = firebase.auth();
const db = firebase.database();
//const users = db.collection("users");

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
.then(function() {
  // Existing and future Auth states are now persisted in the current
  // session only. Closing the window would clear any existing state even
  // if a user forgets to sign out.
  // ...
  // New sign-in will be persisted with session persistence.
  return firebase.auth().signInWithEmailAndPassword(email, password);
})
.catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
});

// Get elements

// Login page 
const loginPage = document.getElementById('loginPage');
const loginPageButtons = document.getElementById('loginPageButtons');
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignup');
const pwReset = document.getElementById('pwReset');
const pForgotPassword = document.getElementById('pForgotPassword');

// Signup page
const signupPage = document.getElementById('signupPage');
const txtPasswordConfirm = document.getElementById('txtPasswordConfirm');
const selectUserType = document.getElementById('selectUserType');
const btnSubmit = document.getElementById('btnSubmit');
const txtAddress = document.getElementById('txtAddress');
const txtFirstName = document.getElementById('txtFirstName');
const txtLastName = document.getElementById('txtLastName');
const txtCommCenterName = document.getElementById('txtCommCenterName');
const txtCredentials = document.getElementById('txtCredentials');

// Home page
const btnLogout = document.getElementById('btnLogout');
const commcenterHome = document.getElementById('commcenterHome');
const driverHome = document.getElementById('driverHome');
const adminHome = document.getElementById('adminHome');
const txtWelcome = document.getElementById('txtWelcome');


// Admin home
const btnRequest = document.getElementById('btnRequest');
const txtItemName = document.getElementById('txtItemName');
const txtQuantity = document.getElementById('txtQuantity');
const txtLocation = document.getElementById('txtLocation');
const btnSubmitRequest = document.getElementById('btnSubmitRequest');
const btnCancelRequest = document.getElementById('btnCancelRequest');
const requests = document.getElementById('requests');
const itemRequestForm = document.getElementById('itemRequestForm');
const btnViewRequests = document.getElementById('btnViewRequests');
const volunteerRequestForm = document.getElementById('volunteerRequestForm');
const txtRequiredSkills = document.getElementById('txtRequiredSkills');
const txtQuantityVolunteers = document.getElementById('txtQuantityVolunteers');
const txtVolunteerLocation = document.getElementById('txtVolunteerLocation');
const btnSubmitVolunteerRequest = document.getElementById('btnSubmitVolunteerRequest');
const btnCancelVolunteerRequest = document.getElementById('btnCancelVolunteerRequest');
const btnRequestVolunteers = document.getElementById('btnRequestVolunteers');
const requestsView = document.getElementById('requestsView');

// Volunteer home
const volunteerHome = document.getElementById('volunteerHome');
const viewVolunteerRequests = document.getElementById('viewVolunteerRequests');

// Community center home
const requestsFulfill = document.getElementById('requestsFulfill');

// Driver home
const requestsTransport = document.getElementById('requestsTransport');
const btnViewDeliveries = document.getElementById('btnViewDeliveries');
const viewDeliveries = document.getElementById('viewDeliveries');

// Clear signup form on refresh
selectUserType.value = 'none';


// Login listener
btnLogin.addEventListener('click', e => {
  console.log("login clicked");
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  // Sign in
  //const promise = auth.signInWithEmailAndPassword(email, pass);
  //promise.catch(e => console.log(e.message));
  auth.signInWithEmailAndPassword(email, pass).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    
    window.alert("Error : " + errorMessage);
  });
});

// Logout listener
btnLogout.addEventListener('click', e => {
  user = auth.currentUser;
  uid = user.uid;
  // remove all delivery list items in driver page on logout
  while (viewDeliveries.firstChild) {
    viewDeliveries.removeChild(viewDeliveries.firstChild);
  }
  console.log("logout clikced");
  const promise = auth.signOut()
  promise.catch(e => console.log(e.message));  
              
});


firebase.auth().onAuthStateChanged(function(user) {
  console.log("State changed");
  if (user) {
    
    console.log(user.email);
    btnLogout.style.display = 'block';
    loginPage.style.display = 'none';
    console.log("line 104");
    //userType = getUserType();

    var userType, uid, firstName, commcenterName;
    uid = user.uid;
      
    const userRef = db.ref().child('users').child(uid);
    console.log("userRef: ", userRef);


    // Read user type from Database
    userRef.on('value', function(snapshot) {
      console.log("userType: ", snapshot.val().role);
      userType = snapshot.val().role;
      firstName = snapshot.val().firstName;
      commcenterName = snapshot.val().commcenterName;
    }, function(error) {
      console.log("The read failed: ", error.code);
    });

    console.log("user type: ", userType);

    // Display corresponding home pages for each user type
    if (userType == 'admin') {
      console.log("admin home");
      adminHome.style.display = 'block';
      commcenterHome.style.display = 'none';
      driverHome.style.display = 'none';
      volunteerHome.style.display = 'none';
      txtWelcome.innerHTML = 'Welcome, administrator ' + firstName;
    } else if (userType == 'commcenter') {
      console.log("comm center home");
      adminHome.style.display = 'none';
      commcenterHome.style.display = 'block';
      driverHome.style.display = 'none';
      volunteerHome.style.display = 'none';
      txtWelcome.innerHTML = 'Welcome, ' + commcenterName;
    } else if (userType == 'driver') {
      console.log("driver home");
      adminHome.style.display = 'none';
      commcenterHome.style.display = 'none';
      driverHome.style.display = 'block';
      volunteerHome.style.display = 'none';
      txtWelcome.innerHTML = 'Welcome, driver ' + firstName;

      var user = auth.currentUser;
      uid = user.uid;

      // When driver-type user logs in, iterates through list of transports initiated by user
      var deliveringItemsRef = db.ref('itemsDelivering');
      deliveringItemsRef.orderByChild('itemDeliveredBy').equalTo(uid).on('child_added', function(snapshot) {
        if (snapshot.val() == null) {
          window.alert('no deliveries to show at this time!');
        } else {
            // Dynamically creates list of deliveries belonging to user
            var ul = document.getElementById('viewDeliveries');
            var itemDiv = document.createElement("div");
            itemDiv.setAttribute('class', 'listItem');
            console.log(snapshot.key);
            console.log(snapshot.val());
            itemDiv.setAttribute('id', snapshot.key + 'itemDelivery');
            var name = snapshot.val().itemName;
            console.log(name);
            var pickupAt = snapshot.val().pickupAt;
            var pPickupAt = document.createElement('p');
            pPickupAt.innerHTML = "Pick-up location: " + pickupAt;
            var quant = snapshot.val().quantity;
            var dropoffAt = snapshot.val().dropoffAt;
            var deliveryKey = snapshot.key;
            var pName = document.createElement('p');
            pName.innerHTML = name;
            var pQuant = document.createElement('p');
            pQuant.innerHTML = quant;
            pQuant.setAttribute('class', 'txtQuantity');
            var pAddress = document.createElement('p');
            pAddress.innerHTML = "Drop-off location: " + dropoffAt;
        
            itemDiv.appendChild(pName);
            itemDiv.appendChild(pQuant);
            itemDiv.appendChild(pAddress);
            itemDiv.appendChild(pPickupAt);

            itemDiv.className += ' clickedFalse';

            // Creates "item delivered"-type button that toggles on/off of div
            itemDiv.onclick = function() {
              if (itemDiv.classList.contains('clickedFalse')) {
                itemDiv.classList.remove('clickedFalse');
                itemDiv.className += ' clickedTrue';
        
                console.log('item clicked');
        
        
                var btnDeliveryComplete = document.createElement('button');
                btnDeliveryComplete.innerHTML = 'Delivery Complete';
                btnDeliveryComplete.setAttribute('id', snapshot.key + 'btnDeliveryComplete');
                btnDeliveryComplete.className += ' deliveryCompleteButton';
                itemDiv.appendChild(btnDeliveryComplete);
                  
                user = auth.currentUser;
                uid = user.uid;
                console.log("uid: " + uid);
        
                // add event listener to supply button
                btnDeliveryComplete.addEventListener('click', e=> {
                  // Delete Item from delivery queue
                  itemDeliveredRef = db.ref().child('itemsDelivering').child(deliveryKey);
                  itemDeliveredRef.remove();
                })
              } else if (itemDiv.classList.contains('clickedTrue')) {
                itemDiv.classList.remove('clickedTrue');
                itemDiv.className += ' clickedFalse';
                var btnDeliveryComplete = document.getElementById(snapshot.key + 'btnDeliveryComplete');
                itemDiv.removeChild(btnDeliveryComplete);
              } 
            }
        
          ul.appendChild(itemDiv);
        
        }
      })
      // When driver is logged in, listens for deliveries to be removed fromm database and removes from list
      deliveringItemsRef.on('child_removed', function(snapshot) {
        console.log('item removed');
        var itemDiv = document.getElementById(snapshot.key + 'itemDelivery');
        ul = document.getElementById('viewDeliveries');
        ul.removeChild(itemDiv);
      })
        
        

          
    } else if (userType == 'volunteer') {
      console.log('volunteer home');
      adminHome.style.display = 'none';
      commcenterHome.style.display = 'none';
      driverHome.style.display = 'none';
      volunteerHome.style.display = 'block';
      txtWelcome.innerHTML = 'Welcome, volunteer ' + firstName;
    }

    txtWelcome.style.display = 'block';

  } else {
    // Shows login page and hides home pages if user==None
    console.log("logged out");
    btnLogout.style.display = 'none';
    loginPage.style.display = 'block';

    adminHome.style.display = 'none';
    commcenterHome.style.display = 'none';
    driverHome.style.display = 'none';
    txtWelcome.style.display = 'none';
  }
}); 

// Displays signup page
btnSignup.addEventListener('click', e => {
  signupPage.style.display = 'block';
  loginPageButtons.style.display = 'none';
    
  //selectUserType.style.display = 'block';
  //btnSubmit.style.display = 'block';
});

// Manages signup fields on signup page according to user type
selectUserType.addEventListener('change', e => {
  if (document.getElementById('selectOption').selected) {
    if (txtFirstName.style.display == 'block') {
      txtFirstName.style.display = 'none';
    }

    if (txtLastName.style.display == 'block') {
      txtLastName.style.display = 'none';
    }

    if (txtAddress.style.display == 'block') {
      txtAddress.style.display = 'none';
    }

    if (txtCommCenterName.style.display == 'block') {
      txtCommCenterName.style.display = 'none';
    }
    if (txtCredentials.style.display == 'block') {
      txtCredentials.style.display = 'none';
    }
  }

  if (document.getElementById('adminOption').selected) {
    if (txtFirstName.style.display == 'none') {
      txtFirstName.style.display = 'block';
    }

    if (txtLastName.style.display == 'none') {
      txtLastName.style.display = 'block';
    }

    if (txtAddress.style.display == 'block') {
      txtAddress.style.display = 'none';
    }

    if (txtCommCenterName.style.display == 'block') {
      txtCommCenterName.style.display = 'none';
    }
    if (txtCredentials.style.display == 'block') {
      txtCredentials.style.display = 'none';
    }

  }

  if (document.getElementById('commcenterOption').selected) {
    if (txtAddress.style.display == 'none') {
      txtAddress.style.display = 'block';
    }

    if (txtFirstName.style.display == 'block') {
      txtFirstName.style.display = 'none';
    }

    if (txtLastName.style.display == 'block') {
      txtLastName.style.display = 'none';
    }

    if (txtCommCenterName.style.display == 'none') {
      txtCommCenterName.style.display = 'block';
    }
    if (txtCredentials.style.display == 'block') {
      txtCredentials.style.display = 'none';
    }

  }

  if (document.getElementById('driverOption').selected) {
    if (txtFirstName.style.display == 'none') {
      txtFirstName.style.display = 'block';
    }

    if (txtLastName.style.display == 'none') {
      txtLastName.style.display = 'block';
    }
        
    if (txtAddress.style.display == 'block') {
      txtAddress.style.display = 'none';
    }

    if (txtCommCenterName.style.display == 'block') {
      txtCommCenterName.style.display = 'none';
    }
    if (txtCredentials.style.display == 'block') {
      txtCredentials.style.display = 'none';
    }

  }
  if (document.getElementById('volunteerOption').selected) {
    if (txtFirstName.style.display == 'none') {
      txtFirstName.style.display = 'block';
    }

    if (txtLastName.style.display == 'none') {
      txtLastName.style.display = 'block';
    }
        
    if (txtAddress.style.display == 'block') {
      txtAddress.style.display = 'none';
    }

    if (txtCommCenterName.style.display == 'block') {
      txtCommCenterName.style.display = 'none';
    }
    console.log(txtCredentials.style.display)
    if (txtCredentials.style.display == 'none') {
      txtCredentials.style.display = 'block';
    }

  }
});

// Submits personal information to create account
btnSubmit.addEventListener('click', e => {
  var firstName_ = txtFirstName.value;
  var lastName_ = txtLastName.value;
  var email_ = txtEmail.value;
  var password = txtPassword.value;
  var passwordConfirm = txtPasswordConfirm.value;
  var address_ = txtAddress.value
  var role_ = selectUserType.value;
  var commcenterName_ = txtCommCenterName.value;  
  var credentials_ = txtCredentials.value;     

  if (password != passwordConfirm) {
    alert("Passwords do not match!");
  } else {
    var uid;
    auth.createUserWithEmailAndPassword(email_, password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    }).then(function(user) {
      user = auth.currentUser;
      uid = user.uid;
      db.ref('users/' + uid).set({
        firstName: firstName_,
        lastName: lastName_,
        email: email_,
        role: role_,
        address: address_,
        commcenterName: commcenterName_,
        credentials: credentials_
      }).then(function() {
        signupPage.style.display = 'none';
        loginPageButtons.style.display = 'block';

      }).catch(function(error) {
        console.error("Error adding document: ", error);
      })
    })
  }
});

btnViewRequests.addEventListener('click', e => {
  if (viewRequests.style.display == 'none') {
    console.log('display requests');
    viewRequests.style.display = 'block';
    btnViewRequests.innerHTML = 'Hide Requests'
  } else if (viewRequests.style.display == 'block') {
    console.log('hide requests');
    viewRequests.style.display = 'none';
    btnViewRequests.innerHTML = 'View Requests'
  }
  
})



// Item Request Page Handlers
btnRequest.addEventListener('click', e => {
  btnRequest.style.display = 'none';
  btnRequestVolunteers.style.display = 'none';
  itemRequestForm.style.display = 'block';
  btnCancelRequest.style.display = 'inline';
})

btnCancelRequest.addEventListener('click', e => {
  btnRequest.style.display = 'block';
  btnRequestVolunteers.style.display = 'block';
  itemRequestForm.style.display = 'none';
  btnCancelRequest.style.display = 'none';
})

btnSubmitRequest.addEventListener('click', e => {
  var item = txtItemName.value;
  var quantity_ = txtQuantity.value;
  var location_ = txtLocation.value;
  var user = auth.currentUser;
  var uid;
  if (user) {
    uid = user.uid;
  } else {
    uid = 'anon';
  }

  db.ref('items').push().set({
    itemName: item,
    dropoffAt: location_,
    quantity: quantity_,
    shipping: false,
    delivered: false,
    requestSubmittedBy: uid 
  }).then(function() {

    btnRequest.style.display = 'block';
    btnRequestVolunteers.style.display = 'block';
    itemRequestForm.style.display = 'none';
    btnCancelRequest.style.display = 'none';

    }).catch(function(error) {
      console.error("Error adding document: ", error);
    })
})

// Volunteer Request Page Handlers
btnRequestVolunteers.addEventListener('click', e => {
  btnRequestVolunteers.style.display = 'none';
  btnRequest.style.display = 'none';
  volunteerRequestForm.style.display = 'block';
  btnCancelVolunteerRequest.style.display = 'inline';
})

btnCancelVolunteerRequest.addEventListener('click', e => {
  btnRequestVolunteers.style.display = 'block';
  btnRequest.style.display = 'block';
  volunteerRequestForm.style.display = 'none';
  btnCancelVolunteerRequest.style.display = 'none';
})

btnSubmitVolunteerRequest.addEventListener('click', e => {
  var requiredSkills_ = txtRequiredSkills.value;
  var quantity_ = txtQuantityVolunteers.value;
  var location_ = txtVolunteerLocation.value;
  var user = auth.currentUser;
  var uid;
  if (user) {
    uid = user.uid;
  } else {
    uid = 'anon';
  }

  db.ref('volunteerRequests').push().set({
    requiredSkills: requiredSkills_,
    location: location_,
    quantity: quantity_,
    requestSubmittedBy: uid 
  }).then(function() {

    btnRequestVolunteers.style.display = 'block';
    btnRequest.style.display = 'block';
    volunteerRequestForm.style.display = 'none';
    btnCancelVolunteerRequest.style.display = 'none';

    }).catch(function(error) {
      console.error("Error adding document: ", error);
    })
})

// ITEM ADDED TO DB
var itemRef = db.ref('items');
itemRef.on('child_added', function(snapshot) {
  console.log("item: ", snapshot.val());
  oldSnapshot = snapshot.val();
  oldKey = snapshot.key;    

  // create list for ADMIN
  var ul = document.getElementById('viewRequests');
  var itemDiv = document.createElement("div");
  itemDiv.setAttribute('class', 'listItem');
  console.log(snapshot.key);
  console.log(snapshot.val());
  itemDiv.setAttribute('id', snapshot.key + 'item');
  var name = snapshot.val().itemName;
  var quant = snapshot.val().quantity;
        
  var pName = document.createElement('p');
  pName.innerHTML = name;
  var pQuant = document.createElement('p');
  pQuant.innerHTML = quant;
  pQuant.setAttribute('class', 'txtQuantity');

  itemDiv.appendChild(pName);
  itemDiv.appendChild(pQuant);

  ul.appendChild(itemDiv);

  // create list for COMMUNITY CENTER
  var ul = document.getElementById('viewFulfilRequests');
  var itemDiv = document.createElement("div");
  itemDiv.setAttribute('class', 'listItem');
  console.log(snapshot.key);
  itemDiv.setAttribute('id', snapshot.key + 'itemOffer');
  var name = snapshot.val().itemName;
  var quant = snapshot.val().quantity;
        
  var pName = document.createElement('p');
  pName.innerHTML = name;
  var pQuant = document.createElement('p');
  pQuant.innerHTML = quant;
  pQuant.setAttribute('class', 'txtQuantity');

  itemDiv.className += ' clickedFalse';

  itemDiv.appendChild(pName);
  itemDiv.appendChild(pQuant);

  itemDiv.onclick = function() {
    if (itemDiv.classList.contains('clickedFalse')) {
      itemDiv.classList.remove('clickedFalse');
      itemDiv.className += ' clickedTrue';

      console.log('item clicked');
      var btnSupply = document.createElement('button');
      btnSupply.innerHTML = 'Supply Items';
      btnSupply.setAttribute('id', snapshot.key + 'btn');
      btnSupply.className += ' supplyButton';
      itemDiv.appendChild(btnSupply);
            
      user = auth.currentUser;
      uid = user.uid;
      console.log("uid: " + uid);

      // gets address of community center offering item
      db.ref('users').child(uid).on('value', function (snapshot) {
        address = snapshot.val().address;
        console.log(address);
        // add event listener to supply button
        btnSupply.addEventListener('click', e=> {
          itemsOfferedRef = db.ref().child('itemsOffered');
          console.log(snapshot.val())
          itemsOfferedRef.push().set({
            delivered: oldSnapshot.delivered,
            itemName: oldSnapshot.itemName,
            dropoffAt: oldSnapshot.dropoffAt,
            quantity: oldSnapshot.quantity,
            requestSubmittedBy: oldSnapshot.requestSubmittedBy,
            shipping: oldSnapshot.shipping,
            itemOfferedBy: uid,
            pickupAt: address
            }).then(function() {
              db.ref().child('items').child(oldKey).remove();
            }).catch (function(error) {
              console.error("Error adding document: ", error);
            })
          })
      })


    } else if (itemDiv.classList.contains('clickedTrue')) {
      itemDiv.classList.remove('clickedTrue');
      itemDiv.className += ' clickedFalse';
      btnSupply = document.getElementById(snapshot.key + 'btn');
      itemDiv.removeChild(btnSupply);
      } 
    }
    ul.appendChild(itemDiv);
})

var offeredItemRef = db.ref('itemsOffered');  
offeredItemRef.on('child_added', function(snapshot) {
  // create list for DRIVER
  var ul = document.getElementById('viewTransportRequests');
  var itemDiv = document.createElement("div");
  itemDiv.setAttribute('class', 'listItem');
  console.log(snapshot.key);
  itemDiv.setAttribute('id', snapshot.key + 'offered');
  var name = snapshot.val().itemName;
  var quant = snapshot.val().quantity;
  var pickupAt = snapshot.val().pickupAt;
  var dropoffAt = snapshot.val().dropoffAt;
      
  var pName = document.createElement('p');
  pName.innerHTML = name;
  var pPickupAt = document.createElement('p');
  pPickupAt.innerHTML = 'Pick-up location: ' + pickupAt;
  var pDropoffAt = document.createElement('p');
  pDropoffAt.innerHTML = 'Drop-off location: ' + dropoffAt;
  var pQuant = document.createElement('p');
  pQuant.innerHTML = quant;
  pQuant.setAttribute('class', 'txtQuantity');

  itemDiv.className += ' clickedFalse';

  itemDiv.appendChild(pName);
  itemDiv.appendChild(pQuant);
  itemDiv.appendChild(pPickupAt);
  itemDiv.appendChild(pDropoffAt);

  itemDiv.onclick = function() {
    if (itemDiv.classList.contains('clickedFalse')) {
      itemDiv.classList.remove('clickedFalse');
      itemDiv.className += ' clickedTrue';

      console.log('item clicked');


      var btnDeliver = document.createElement('button');
      btnDeliver.innerHTML = 'Deliver Items';
      btnDeliver.setAttribute('id', snapshot.key + 'btnDeliver');
      btnDeliver.className += ' supplyButton';
      itemDiv.appendChild(btnDeliver);

          
      user = auth.currentUser;
      uid = user.uid;
      console.log("uid: " + uid);

      // add event listener to supply button
      btnDeliver.addEventListener('click', e=> {
            
        // Move item to driver's delivery queue
        itemsOfferedRef = db.ref().child('itemsDelivering');
        itemsOfferedRef.push().set({
          delivered: snapshot.val().delivered,
          itemName: snapshot.val().itemName,
          dropoffAt: snapshot.val().dropoffAt,
          quantity: snapshot.val().quantity,
          requestSubmittedBy: snapshot.val().requestSubmittedBy,
          shipping: snapshot.val().shipping,
          itemOfferedBy: snapshot.val().itemOfferedBy,
          itemDeliveredBy: uid,
          pickupAt: snapshot.val().pickupAt
        }).then(function() {
          db.ref().child('itemsOffered').child(snapshot.key).remove();
          console.log('child removed');
        }).catch (function(error) {
          console.error("Error adding document: ", error);
        })      
      })
    } else if (itemDiv.classList.contains('clickedTrue')) {
      itemDiv.classList.remove('clickedTrue');
      itemDiv.className += ' clickedFalse';
      var txtAddress = document.getElementById(snapshot.key + 'txtAddress');
      var btnDeliver = document.getElementById(snapshot.key + 'btnDeliver');
      itemDiv.removeChild(btnDeliver);
      itemDiv.removeChild(txtAddress);
    } 
  }
  ul.appendChild(itemDiv);
})

var volunteerRequestRef = db.ref('volunteerRequests');
volunteerRequestRef.on('child_added', function(snapshot) {
  // create list for VOLUNTEERS
  var itemDiv = document.createElement("div");
  itemDiv.setAttribute('class', 'listItem');
  console.log(snapshot.key);
  itemDiv.setAttribute('id', snapshot.key + 'volunteerOffer');
  var loc = snapshot.val().dropoffAt;
  var quant = snapshot.val().quantity;
  var skills = snapshot.val().requiredSkills;
        
  var pLoc = document.createElement('p');
  pLoc.innerHTML = loc;
  var pQuant = document.createElement('p');
  pQuant.innerHTML = quant;
  pQuant.setAttribute('class', 'txtQuantity');
  var pSkills = document.createElement('p');
  pSkills.innerHTML = skills;

  itemDiv.className += ' clickedFalse';

  itemDiv.appendChild(pLoc);
  itemDiv.appendChild(pQuant);
  itemDiv.appendChild(pSkills);

  // Creates toggling, clickable div with "volunteer" button
  itemDiv.onclick = function() {
    if (itemDiv.classList.contains('clickedFalse')) {
      itemDiv.classList.remove('clickedFalse');
      itemDiv.className += ' clickedTrue';

      console.log('item clicked');
      var btnVolunteer = document.createElement('button');
      btnVolunteer.innerHTML = 'Volunteer now!';
      btnVolunteer.setAttribute('id', snapshot.key + 'btnVolunteer');
      btnVolunteer.className += ' volunteerButton';
      itemDiv.appendChild(btnVolunteer);
            
      user = auth.currentUser;
      uid = user.uid;
      console.log("uid: " + uid);

      // add event listener to supply button
      btnVolunteer.addEventListener('click', e=> {
        // Add volunteer/position to 'volunteerJobs'
        volunteerJobRef = db.ref().child('volunteerJobs');
        volunteerJobRef.push().set({
          location: snapshot.val().location,
          quantity: 1,
          requestSubmittedBy: snapshot.val().requestSubmittedBy,
          requiredSkills: snapshot.val().requiredSkills,
          volunteer: uid
        }).then(function() {
          db.ref().child('items').child(snapshot.key).remove();
        }).catch (function(error) {
          console.error("Error adding document: ", error);
        })
        var oldKey = snapshot.key;
        // Decrement volunteer quantity; if quantity is 1, remove from volunteerRequests
        volunteerRequestRef.child(snapshot.key).once('value', function(snapshot) {
          var quantity = snapshot.val().quantity
          quantity = parseInt(quantity, 10)
          console.log(snapshot.val())
          if (quantity == 1) {
            console.log('quantity = 1')
            volunteerRequestRef.child(oldKey).remove();
          } else if (quantity > 1) {
            console.log("quantity > 1")
            volunteerRequestRef.child(snapshot.key).set({
              location: snapshot.val().location,
              quantity: (quantity - 1),
              requestSubmittedBy: snapshot.val().requestSubmittedBy,
              requiredSkills: snapshot.val().requiredSkills
            })
          }
        })

      })



    } else if (itemDiv.classList.contains('clickedTrue')) {
      itemDiv.classList.remove('clickedTrue');
      itemDiv.className += ' clickedFalse';
      btnVolunteer = document.getElementById(snapshot.key + 'btnVolunteer');
      itemDiv.removeChild(btnVolunteer);
      } 
    }
    viewVolunteerRequests.appendChild(itemDiv);
})


// ITEM REMOVED FROM DB
itemRef.on('child_removed', function(snapshot) {
    var itemDiv1 = document.getElementById(snapshot.key + 'item');
    var itemDiv2 = document.getElementById(snapshot.key + 'itemOffer');
    ul1 = document.getElementById('viewRequests');
    ul2 = document.getElementById('viewFulfilRequests');
    ul1.removeChild(itemDiv1);
    ul2.removeChild(itemDiv2);
})

offeredItemRef.on('child_removed', function(snapshot) {
  console.log(snapshot.key);
  var itemDiv = document.getElementById(snapshot.key + 'offered');
      
  ul = document.getElementById('viewTransportRequests');
  console.log()
  ul.removeChild(itemDiv);
})


btnViewDeliveries.addEventListener('click', e => {
  if (viewDeliveries.style.display == 'none') {
    console.log('display deliveries');
    viewDeliveries.style.display = 'block';
    btnViewDeliveries.innerHTML = 'Hide Current Deliveries'
  } else if (viewDeliveries.style.display == 'block') {
    console.log('hide deliveries');
    viewDeliveries.style.display = 'none';
    btnViewDeliveries.innerHTML = 'View Current Deliveries'
  }
  
})

// Password reset elements
const pageForgotPass = document.getElementById('pageForgotPass');
const btnForgotEmail = document.getElementById('btnForgotEmail');
const txtForgotEmail = document.getElementById('txtForgotEmail');
const btnCancelReset = document.getElementById('btnCancelReset');

// Displays password reset page
pwReset.addEventListener('click', e => {
  loginPage.style.display = 'none';
  loginPageButtons.style.display = 'none';
  pageForgotPass.style.display = 'block';
})

btnForgotEmail.addEventListener('click', e=> {
  email = txtForgotEmail.value;
  console.log(email);
  auth.sendPasswordResetEmail(email).then(function() {
    console.log("email sent");
  }).catch(function(error) {
    errorMessage = error.message;
    console.log("Error sending email: ", errorMessage);
  })
})

btnCancelReset.addEventListener('click', e => {
  loginPage.style.display = 'block';
  loginPageButtons.style.display = 'block';
  pageForgotPass.style.display = 'none';
})


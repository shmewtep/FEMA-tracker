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

  //  accounts for Date object behavior update
  const firestore = firebase.firestore();
  const settings = {/* your settings... */ timestampsInSnapshots: true};
  firestore.settings(settings);


  const auth = firebase.auth();
  const db = firebase.firestore();
  const users = db.collection("users");

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
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignup');
  const pwReset = document.getElementById('pwReset');
  const selectUserType = document.getElementById('selectUserType');
  const btnSubmit = document.getElementById('btnSubmit');
  const txtAddress = document.getElementById('txtAddress');
  const txtFirstName = document.getElementById('txtFirstName');
  const txtLastName = document.getElementById('txtLastName');
  const pForgotPassword = document.getElementById('pForgotPassword');
  const authStat = document.getElementById('authStat');
  const btnLogout = document.getElementById('btnLogout');
  const signupPage = document.getElementById('signupPage');
  const loginPage = document.getElementById('loginPage');
  const loginPageButtons = document.getElementById('loginPageButtons');


// Clear form on refresh
selectUserType.value = 'none';


    // Add login event
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

      btnLogout.addEventListener('click', e => {
        console.log("logout clikced");
        const promise = auth.signOut()
        promise.catch(e => console.log(e.message));  
              
      });


    firebase.auth().onAuthStateChanged(function(user) {
      console.log("State changed");
      if (user) {
        //document.location.href = 'home.html';
        console.log(user.email);
        authStat.style.display = 'block';
        btnLogout.style.display = 'block';
        /*signupPage.style.display = 'none';
        txtEmail.style.display = 'none';
        txtPassword.style.display = 'none';
        btnLogin.style.display = 'none';
        btnSignUp.style.display = 'none';*/
        loginPage.style.display = 'none';
        console.log("signup page hidden?");

        manageUserType();

      } else {
        console.log("logged out");
        // document.location.href = 'index.html';
        authStat.style.display = 'none';
        btnLogout.style.display = 'none';
        loginPage.style.display = 'block';
       
      }
    }); 


    function manageUserType() {
      var user, userType, uid;
      user = firebase.auth().currentUser;
      uid = user.getIdToken();

      var getOptions = {
        source: 'server'
      };


      //console.log("uid: ", uid);

      //console.log("Kelsey:", users.where("firstName", "==", "Kelsey"))


      /*u.get().then(function(doc) {
        if (dbUser.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });*/

      console.log("dbUser: ", dbUser);
    }

    
    btnSignup.addEventListener('click', e => {
        // TODO
        signupPage.style.display = 'block';
        loginPageButtons.style.display = 'none';
        
        //selectUserType.style.display = 'block';
        //btnSubmit.style.display = 'block';
    });

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
      }

      if (document.getElementById('commcenterOption').selected) {
        if (txtAddress.style.display == 'none') {
          txtAddress.style.display = 'block';
        }

        if (txtFirstName.style.display == 'inline') {
          txtFirstName.style.display = 'block';
        }

        if (txtLastName.style.display == 'inline') {
          txtLastName.style.display = 'block';
        }
      }

      if (document.getElementById('driverOption').selected) {
        if (txtFirstName.style.display == 'none') {
          txtFirstName.style.display = 'block';
        }

        if (txtLastName.style.display == 'none') {
          txtLastName.style.display = 'block';
        }
        
        if (txtAddress.style.display == 'inline') {
          txtAddress.style.display = 'block';
        }

      }
    });


    // auth.signOut();
    
  
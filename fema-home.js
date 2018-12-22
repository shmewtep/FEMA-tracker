const btnLogout = document.getElementById('btnLogout');
const auth = firebase.auth();
const db = firebase.firestore();

btnLogout.addEventListener('click', e => {
    console.log("logout clikced");
    const promise = auth.signOut()
    promise.catch(e => console.log(e.message));  
          
  });

  firebase.auth().onAuthStateChanged(function(user) {
    console.log("State changed");
    if (user) {
      document.location.href = 'home.html';
      console.log(user.email);
    } else {
      console.log("logged out");
      document.location.href = 'index.html';
    }
  }); 
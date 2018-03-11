'use strict'

let buttonBool = true;

 //          _         _   _        __                  _   _
 //   ___   / \  _   _| |_| |__    / _|_   _ _ __   ___| |_(_) ___  _ __  ___
 //  / _ \ / _ \| | | | __| '_ \  | |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // | (_) / ___ \ |_| | |_| | | | |  _| |_| | | | | (__| |_| | (_) | | | \__ \
 //  \___/_/   \_\__,_|\__|_| |_| |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/



function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  // let text = document.getElementById('signedin');
  // text.textContent = "Welcome " + profile.getGivenName();
  console.log('Logged in as:' + profile.getName());
  console.log(profile.getId());
  callServer();
  renderSignIn();
  buttonToggle();
  getUnits();
}

function onfailure() {
  let text = document.getElementById('signedin');
  text.textContent = "failed!";
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  let signOut = document.getElementById('signout');
  auth2.signOut().then(function () {
    window.main.innerHTML =
    '<p> Session over. </p>'
    signOut.classList.toggle('none');
  });
}


 //  ____                             _____                 _   _
 // / ___|  ___ _ ____   _____ _ __  |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 // \___ \ / _ \ '__\ \ / / _ \ '__| | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 //  ___) |  __/ |   \ V /  __/ |    |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 // |____/ \___|_|    \_/ \___|_|    |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //


async function getDbLength() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };

  const response = await fetch('/api/length', fetchOptions);

  if (!response.ok) {
    console.log("dead");
    return;
  }

  const data = await response.text();
  console.log(data);
};

async function addUnit() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  let unit_name = document.getElementById('addunit').value;
  let addError = document.getElementById('adderror');

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };

  if (unit_name == "") {
    adderror.textContent = "Please enter a value";
  }
  else {
    adderror.textContent = "";
  }

  const response = await fetch('/api/add?unitname=' + unit_name, fetchOptions);

  if (!response.ok) {
    console.log("broken");
    console.log(response.status);
    return;
  }
  else {
    console.log("not broken");
    console.log(response.status);
  }
  getUnits();
}

async function getUnits() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  const response = await fetch('/api/unit_list', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  const data = await response.json();
  const unitList = document.querySelector('.unitlist');
  unitList.innerHTML = '';
  if (data.length == 0) {
    return;
  }

  data.forEach((i) => {
    const unitTemplate = document.getElementById('unit').content.cloneNode(true);
    unitTemplate.querySelector('.unittitle').textContent = i.unitname;
    unitList.appendChild(unitTemplate);
  });
}


async function callServer() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  const response = await fetch('/api/hello', fetchOptions);
  if (!response.ok) {
    // handle the error
    return;
  }
  console.log(response);
}

 //  ____                  _              _____                 _   _
 // |  _ \ ___  __ _ _   _| | __ _ _ __  |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 // | |_) / _ \/ _` | | | | |/ _` | '__| | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // |  _ <  __/ (_| | |_| | | (_| | |    |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 // |_| \_\___|\__, |\__,_|_|\__,_|_|    |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //            |___/


function toggleAdd() {
  let content = document.querySelector(".addUnit");
  content.classList.toggle('show');
};

function renderSignIn() {
  var temp = document.getElementsByTagName("template")[0];
  var clone = temp.content.cloneNode(true);
  window.main.appendChild(clone);
};

function buttonToggle() {
  let signIn = document.getElementById('signin');
  let signOut = document.getElementById('signout');
  console.log(signOut);
  signIn.classList.toggle('none');
};

'use strict'

let currentUnit;

//          _         _   _        __                  _   _
//   ___   / \  _   _| |_| |__    / _|_   _ _ __   ___| |_(_) ___  _ __  ___
//  / _ \ / _ \| | | | __| '_ \  | |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
// | (_) / ___ \ |_| | |_| | | | |  _| |_| | | | | (__| |_| | (_) | | | \__ \
//  \___/_/   \_\__,_|\__|_| |_| |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/

// @param googleUser - current user signed in to google
function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  let text = document.getElementById('signedin');
  text.textContent = "Welcome " + profile.getGivenName();
  callServer();
  buttonToggle();
  renderSignIn();
  getUnits();
}

function onfailure() {
  let text = document.getElementById('signedin');
  text.textContent = "failed!";
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  let signOut = document.getElementById('signout');
  //prevents user from doing anything once signed out.
  auth2.signOut().then(function() {
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

async function addUnit() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  let unit_name = document.getElementById('addunit').value;
  let addError = document.getElementById('adderror');
  let unitColour = document.getElementById('addcolour').value;
  unitColour = unitColour.slice(1);
  let url = '/api/addunit?unitname=' + unit_name + '&unitcolour=' + unitColour;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + id_token
    },
  };
  if (unit_name == "") {
    adderror.textContent = "Please enter a value";
  } else {
    adderror.textContent = "";
  }
  //fetches the response once the request to add a unit has been sent.
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    console.log(response.status);
    return;
  } else {
    console.log(response.status);
  }
  getUnits();
  toggleAdd();
}

async function addWeek() {
  let weekError = document.getElementById('weekerror');
  weekError.textContent = "";
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  let weekDesc = document.getElementById('weekdesc').value;
  if (weekDesc == "") {
    weekError.textContent = "Week needs a Description."
    return;
  }
  if (!currentUnit) {
    weekError.textContent = "No unit selected."
    return;
  }
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + id_token
    },
  };
  let url = '/api/addweek?unitid=' + currentUnit + '&weekdesc=' + weekDesc;
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  toggleWeek();
}

async function getUnits() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + id_token
    },
  };
  //returns a list of the current units the specific user has created.
  const response = await fetch('/api/unit_list', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  const data = await response.json();
  const unitList = document.getElementById('unittable');
  unitList.innerHTML = '';
  if (data.length == 0) {
    return;
  }
  //loops through the list appending to the list of units on the HTML document.
  data.forEach((i) => {
    const unitTemplate = document.getElementById('unit').content.cloneNode(true);
    let unitTitle = unitTemplate.querySelector('.unittitle')
    unitTitle.textContent = i.unitname;
    unitTitle.style.color = i.colour;
    unitList.appendChild(unitTemplate);
  });
  document.getElementById('weeksubmit').addEventListener('click', addWeek);
  unitList.addEventListener("click", displayWeek);
}

// @param e - current event (in this case the unit that is selected).
async function displayWeek(e) {
  currentUnit = e.target.textContent;
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + id_token
    },
  };
  let url = '/api/week_list?unit=' + e.target.textContent;
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  const data = await response.json();
  const weekList = document.getElementById('weektable');
  weekList.innerHTML = '';
  //if no weeks exist for unit, tell user.
  if (data.length == 0) {
    const weekTemplate = document.getElementById('week').content.cloneNode(true);
    let weekTitle = weekTemplate.querySelector('.weektitle');
    weekTitle.textContent = "No weeks";
    weekList.appendChild(weekTemplate);
    return;
  }
  data.forEach((i) => {
    const weekTemplate = document.getElementById('week').content.cloneNode(true);
    let weekTitle = weekTemplate.querySelector('.weektitle');
    weekTitle.textContent = i.weekDesc;
    weekList.appendChild(weekTemplate);
  });
}


async function callServer() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + id_token
    },
  };
  //authorises google user.
  const response = await fetch('/api/auth', fetchOptions);
  if (!response.ok) {
    console.log("error");
    return;
  }
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

function toggleWeek() {
  let weekContainer = document.querySelector(".addWeek");
  weekContainer.classList.toggle('show');
};

function renderSignIn() {
  var temp = document.getElementsByTagName("template")[0];
  var clone = temp.content.cloneNode(true);
  window.main.appendChild(clone);
};

function buttonToggle() {
  let signin = document.getElementById('signin');
  signin.classList.toggle('none');
};

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DITT_PROJEKT.firebaseapp.com",
  projectId: "DITT_PROJEKT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document
.getElementById("googleLogin")
.addEventListener("click", async () => {

  const provider =
      new GoogleAuthProvider();

  const result =
      await signInWithPopup(auth, provider);

  document.getElementById("userInfo")
      .innerText =
      "Inloggad: " +
      result.user.displayName;
});

document
.getElementById("logout")
.addEventListener("click", async () => {

  await signOut(auth);

  document.getElementById("userInfo")
      .innerText = "";
});
/** Available firebase configurations */
const configurations = {
  ["skouny"]: {
    /** Firebase Options */
    options: {
      apiKey: "AIzaSyAjEX2Q14aNBRiLPudb72OiiMXfEZC5oHg",
      authDomain: "skouny-da713.firebaseapp.com",
      projectId: "skouny",
      storageBucket: "skouny.appspot.com",
      messagingSenderId: "153886109135",
      appId: "1:153886109135:web:74de595763204a3a3cb6ba"
    },
    /** Cloud Functions Region */
    region: "europe-west3"
  }
}
/** Active Configuration */
export const firebaseConfig = configurations["skouny"]

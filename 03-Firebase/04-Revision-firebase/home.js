import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//check user is login or not
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
    window.location = 'login.html'
  }
});

const logout = document.querySelector('#logout');
const form = document.querySelector('#form');
const title = document.querySelector('#title');
const desc = document.querySelector('#description');
const div = document.querySelector('.container');


// get data from firestore
const arr = [];
async function renderTodo(){
  const querySnapshot = await getDocs(collection(db, "todos"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  console.log(arr);
  arr.map((item)=>{
    div.innerHTML +=`
    <h1>Title: ${item.title}</h1>
    <h1>Description: ${item.description}</h1>
    <button>delete</button>
    `
  })
}
renderTodo()




//add data
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: title.value,
      description: desc.value,
      uid: auth.currentUser.uid
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
})



//logout function

logout.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location = 'login.html'
  }).catch((error) => {
    console.log(error);
  });
})
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{ getAuth,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdq3nBhXoOwn9kwKLp30E3lO2RnWBlEs4",
  authDomain: "react-js-blog-website-beb6a.firebaseapp.com",
  projectId: "react-js-blog-website-beb6a",
  storageBucket: "react-js-blog-website-beb6a.appspot.com",
  messagingSenderId: "884903467444",
  appId: "1:884903467444:web:17a80db7666fe4717a3ae1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async()=>{
    let user = null;

    await signInWithPopup(auth,provider)
    .then((result)=>{
        user = result.user
    })
    .catch((err)=>{
        console.log(err);
    })
    return user;
}


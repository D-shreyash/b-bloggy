import { Link, Navigate } from "react-router-dom";
import Inputbox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useContext, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  let {
    UserAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  // console.log(access_token);

  // const authForm = useRef();

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch((error) => {
        console.error(error); // Log any errors
        return toast.error("Something went wrong. Please try again."); // Display a general error message
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let serverRoute = type == "sign-in" ? "/signin" : "/signup";
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

      // Retrieve the data from the form
      let form = new FormData(formElement);
      let formData = {};

      for (let [key, value] of form.entries()) {
        formData[key] = value;
      }

      let { fullname, email, password } = formData;

      // Validation
      if (fullname) {
        if (fullname.length < 3) {
          return toast.error("Fullname must be at least 3 letters long");
        }
      }
      if (!email.length) {
        return toast.error("Email not provided");
      }
      if (!emailRegex.test(email)) {
        return toast.error("Invalid email format");
      }
      if (!passwordRegex.test(password)) {
        return toast.error(
          "Password should be 6 to 20 characters long with numeric, 1 lowercase, and 1 uppercase letter"
        );
      }
      if (type == "sign-up") {
        const response = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + "/check-duplicate-email",
          { email }
        );
        if (response.data.error) {
          return toast.error(response.data.error);
        }
      }

      userAuthThroughServer(serverRoute, formData);
    } catch (error) {
      console.log(error);
      console.log("error in form data ");
    }
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        // let serverRoute = "/google-auth";

        // let formData ={
        //     access_token:user.accessToken
        // }

        // userAuthThroughServer(serverRoute,formData);
        console.log(user);
      })
      .catch((err) => {
        toast.error("trouble in login through goggle");
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form
          id="formElement"
          className="w-[80%] max-w-[400px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "welcome back" : "join us today"}
          </h1>

          {type != "sign-in" ? (
            <Inputbox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <Inputbox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <Inputbox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rs-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            // onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="rellative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black"></hr>
            <p>or</p>
            <hr className="w-1/2 border-black"></hr>
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5 " />
            continue with goggle
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              {" "}
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us.
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              {" "}
              Aready a menber ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in hear.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;

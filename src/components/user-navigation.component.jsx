import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigetionPanel = () => {
  const {
    UserAuth,
    UserAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
    window.location.replace("/");
  };

  console.log("username", username);

  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white absolute right-0 border border-grey w-60  duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>write</p>
        </Link>

        <Link to={`/user/${username}`} className="link pl-8 py-4">
          profile
        </Link>

        <Link to={`/dashboard/blogs/${username}`} className="link pl-8 py-4">
          dashbaord
        </Link>

        <Link to="/settings/edit-profile" className="link pl-8 py-4">
          setting
        </Link>

        <span className="absolute border-t border-grey  w-[100%]"></span>

        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={signOutUser}
        >
          <h1 className="font-bold text-xl mg-1">Sign Out</h1>
          <p>@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigetionPanel;

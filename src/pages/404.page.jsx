import { Link } from "react-router-dom";
import pageNotFoundImg from "../imgs/404.png";
import fullLogo from "../imgs/full-logo.png";

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20  text-center">
      <img
        src={pageNotFoundImg}
        alt=""
        className="border-2 select-none border-grey w-72 aspect-square object-cover rounded"
      />

      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8 ">
        The page you are looking for does not exists.Head back to
        <Link to={"/"} className="text-black underline px-2">
          Home page
        </Link>
      </p>

      <div className="mt-auto">
        <img
          src={fullLogo}
          alt=""
          className="h-8 object-contain block mx-auto select-none "
        />
        <p>Read millions of stories around the world</p>
      </div>
    </section>
  );
};

export default PageNotFound;

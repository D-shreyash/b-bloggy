import { Link } from "react-router-dom";
import { GetFullDay } from "../common/date";

const AboutUser = ({ bio, social_link, joinedAt, classname }) => {
  return (
    <div className={"md:w-[90%] md:mt-7 " + classname}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Nothing to read hear"}
      </p>
      <div className="flex gap-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Object.keys(social_link).map((key) => {
          let link = social_link[key];

          return link ? (
            <Link to={link} key={key} target="_blank">
              <i
                className={
                  "fi " +
                  (key != "website" ? "fi-brands-" + key : "fi-rr-globe") +
                  " text-2xl hover:text-black"
                }
              ></i>
            </Link>
          ) : (
            ""
          );
        })}
      </div>

      <p className="text-xl leading-7 text-dark-grey">
        Joined On {GetFullDay(joinedAt)}
      </p>
    </div>
  );
};
export default AboutUser;

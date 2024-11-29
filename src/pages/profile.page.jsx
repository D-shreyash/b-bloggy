import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { FilterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import LoadMoreDataBtn from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import PageNotFound from "./404.page";

export const profiledDataStructure = {
  user: {
    personal_info: {
      fullname: "",
      username: "",
      profile_img: "",
      bio: "",
    },
    account_info: {
      total_post: "",
      total_blog: "",
    },
    social_links: {},
    joinedAt: "",
  },
};

const ProfilePage = () => {
  let { id: ProfileId } = useParams();
  let [profile, setProfile] = useState(profiledDataStructure);
  let [loading, setLoading] = useState(true);
  let [blog, setBlog] = useState(null);
  let [profileLoaded, setProfileLoaded] = useState("");

  let {
    user: {
      personal_info: { fullname, username: profile_username, profile_img, bio },
      account_info: { total_posts, total_reads },
      social_links,
      joinedAt,
    },
  } = profile;

  let {
    UserAuth,
    UserAuth: { username },
  } = useContext(UserContext);

  const FetchUserProfile = () => {
    console.log(ProfileId);
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: ProfileId,
      })
      .then(({ data: user }) => {
        console.log("user is ", user);
        if (user != null) {
          setProfile(user);
        }

        setProfileLoaded(ProfileId);
        GetBlog({ user_id: user.user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (ProfileId != profileLoaded) {
      setBlog(null);
    }
    if (blog == null) {
      resetState();
      FetchUserProfile();
    }
  }, [ProfileId, blog]);

  const resetState = () => {
    setProfile(profiledDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  const GetBlog = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blog.user_id : user_id;

    console.log("profile user_id", user_id);
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        console.log(data);
        let formatedData = await FilterPaginationData({
          state: blog,
          data: data.blog,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });

        formatedData.user_id = user_id;
        console.log("formatedData", formatedData);
        setBlog(formatedData);
      });
  };

  useEffect(() => {
    console.log("blog is ", blog);
  }, [setBlog]);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-1 border-grey md:sticky md:top-[100px] py-10">
            <img
              src={profile_img}
              alt=""
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />
            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} blogs -{" "}
              {total_reads.toLocaleString()} reads
            </p>

            <div className="flex gap-4 mt-2">
              {ProfileId == username ? (
                <Link
                  to={"/setting/edit-profile"}
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              ) : (
                ""
              )}
            </div>

            <AboutUser
              bio={bio}
              social_link={social_links}
              joinedAt={joinedAt}
              classname="max-md:hidden"
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
            >
              <>
                {blog == null ? (
                  <Loader />
                ) : blog.results.length ? (
                  blog.results.map((blg, i) => {
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <BlogPostCard content={blg} author={blg.author} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No Blogs published" />
                )}

                {}
                <LoadMoreDataBtn state={blog} FeatchDataFun={GetBlog} />
              </>

              <AboutUser
                bio={bio}
                social_link={social_links}
                joinedAt={joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;

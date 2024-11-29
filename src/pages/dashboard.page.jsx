import { useContext, useEffect } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";
import { FilterPaginationData } from "../common/filter-pagination-data";
import { useParams } from "react-router-dom";

export const formatedData_datastructure = {
  page: "",
  results: [],
  totalDocs: "",
  user_id: "",
};
const Dashboard = () => {
  let [blog, setBlog] = useState(formatedData_datastructure);
  let [loading, setLoading] = useState(true);
  let [deletebtn, setDeletebtn] = useState(true);

  let username = useParams();

  const FetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: username,
      })
      .then(({ data: user }) => {
        console.log("username", username);
        console.log("user is ", user);
        GetBlog({ user_id: user.user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const GetBlog = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blog.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        console.log("data", data);
        if (data.blog.length) {
          let formatedData = await FilterPaginationData({
            state: blog,
            data: data.blog,
            page,
            countRoute: "/search-blogs-count",
            data_to_send: { author: user_id },
          });

          setBlog(formatedData);
          setLoading(false);
          formatedData.user_id = user_id;
          console.log("formatedData", formatedData);
        }
      })
      .catch((err) => {
        console.log({ errror: err.message });
      });
  };

  const reRender = (id) => {
    console.log("bhava blog id ali ", id);
    setBlog((prevBlogs) =>
      prevBlogs.results.blog_id.filter((blog) => blog.id !== id)
    );
  };

  useEffect(() => {
    if (blog.results.length == 0) {
      // resetState();
      FetchUserProfile();
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="md:m-32 p-5 m-10 bg-[#d7d5d5] rounded-2xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-gelasio italic">
              Hello, {username.id}
            </h1>
            <h1 className="text-2xl font-bold">Blog status</h1>
          </div>
          <span className="flex items-center w-32">
            <span className="text-3xl font-bold p-2">{blog.totalDocs}</span>
            <h1 className="">Blogs Published</h1>
          </span>
        </div>
      )}
      <div className="md:w-[50%] w-full mx-auto m-10 p-9">
        {loading ? (
          <Loader />
        ) : blog.results.length ? (
          blog.results.map((blg, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                <BlogPostCard
                  content={blg}
                  author={blg.author}
                  Deletebtn={deletebtn}
                  myReRedrenfun={reRender}
                />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No Blogs published" />
        )}
        <LoadMoreDataBtn state={blog} FeatchDataFun={GetBlog} />
      </div>
    </>
  );
};

export default Dashboard;

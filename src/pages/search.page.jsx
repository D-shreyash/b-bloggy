import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import axios from "axios";
import { FilterPaginationData } from "../common/filter-pagination-data";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
  let { query } = useParams();

  let [blogs, setblog] = useState(null);

  let [users, setUser] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        console.log(data);

        let formated_data = await FilterPaginationData({
          state: blogs,
          data: data.blog,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });

        console.log(formated_data);
        setblog(formated_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUser = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then((data) => {
        setUser(data.data.users);
      });
  };

  useEffect(() => {
    searchBlogs({ page: 1 });
    fetchUser();
  }, [query]);

  const UserCardWrapper = () => {
    console.log(users);
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user Found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10 ">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results from "${query}"`, "Account Matched"]}
          defaultHidden={["Account Matched"]}
        >
          <>
            {blogs == null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <BlogPostCard content={blog} author={blog.author} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No Blogs published" />
            )}
            <LoadMoreDataBtn state={blogs} FeatchDataFun={searchBlogs} />
          </>

          <>
            <UserCardWrapper />
          </>
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User releted to search <i className="fi fi-rr-user"></i>
        </h1>

        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;

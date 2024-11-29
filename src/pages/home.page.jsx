import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { FilterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = () => {
  let [blogs, setblog] = useState(null);
  let [TrendingBLog, SetTrendingBLog] = useState(null);
  let categories = [
    "programing",
    "health",
    "travel",
    "life style",
    "finance",
    "Anime",
  ];
  let [pageSate, SetpageSate] = useState("home");

  const fetchLatestBlog = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blog", { page })
      .then(async ({ data }) => {
        // console.log(data.blogs);

        let formated_data = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });

        console.log(formated_data);
        setblog(formated_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setblog(null);

    if (pageSate == category) {
      SetpageSate("home");
      return;
    }

    SetpageSate(category);
  };

  const fetchBlogByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageSate,
        page,
      })
      .then(async ({ data }) => {
        console.log(data, "sdckjdcnslekinowlsn....");
        let formated_data = await FilterPaginationData({
          state: blogs,
          data: data.blog,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageSate },
        });

        console.log(formated_data);
        setblog(formated_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTreandingBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        // console.log(data.blog);
        SetTrendingBLog(data.blog);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageSate == "home") {
      fetchLatestBlog({ page: 1 });
    } else {
      fetchBlogByCategory({ page: 1 });
      // console.log("yete alay  bhai ");
    }
    if (!TrendingBLog) {
      fetchTreandingBlog();
    }
  }, [pageSate]);
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blog */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageSate, "trending blog"]}
            defaultHidden={["trending blog"]}
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

              {}
              <LoadMoreDataBtn
                state={blogs}
                FeatchDataFun={
                  pageSate == "home" ? fetchLatestBlog : fetchBlogByCategory
                }
              />
            </>

            <>
              {TrendingBLog == null ? (
                <Loader />
              ) : TrendingBLog.length ? (
                TrendingBLog.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No Trending Blogs" />
              )}
            </>
          </InPageNavigation>
        </div>

        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      className={`
                        tag ${
                          pageSate == category ? "bg-black text-white" : ""
                        }`}
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
                <>
                  {TrendingBLog == null ? (
                    <Loader />
                  ) : TrendingBLog.length ? (
                    TrendingBLog.map((blog, i) => {
                      return (
                        <AnimationWrapper
                          key={i}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        >
                          <MinimalBlogPost blog={blog} index={i} />
                        </AnimationWrapper>
                      );
                    })
                  ) : (
                    <NoDataMessage message="No Trending Blogs" />
                  )}
                </>
              </h1>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;

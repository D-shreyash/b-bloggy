import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "./loader.component";

export const BlogDatastructure = {
  0: {
    activity: {
      total_comments: "",
      total_likes: "",
      total_parent_comments: "",
      total_reads: "",
    },
    author: {
      personal_info: { fullname: "", profile_img: "", username: "" },
      _id: "",
    },
    banner: "",
    des: "",
    publishedAt: "",
    tags: [],
    content: {
      0: { blocks: [] },
    },
    title: "",
  },
};

const BLogContent = () => {
  let { blog_id } = useParams();
  let [blog, setBlog] = useState(BlogDatastructure);

  let {
    0: {
      activity: {
        total_comments,
        total_likes,
        total_parent_comments,
        total_reads,
      },
      author: {
        personal_info: { fullname, profile_img, username },
        _id: ProfileId,
      },
      banner,
      des,
      publishedAt,
      tags,
      content: {
        0: { blocks },
      },
      title,
    },
  } = blog;

  const FeatchBlogContent = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        blog_id: blog_id,
      })
      .then(({ data: blog }) => {
        console.log(blog.blog);
        setBlog(blog.blog);
      })
      .catch((err) => {
        console.log({ error: err });
      });
  };

  useEffect(() => {
    FeatchBlogContent();
  }, []);
  return (
    <AnimationWrapper>
      {title.length == 0 ? (
        <Loader />
      ) : (
        <div>
          <h1 className="text-center text-3xl font-bold underline p-10">
            {title}
          </h1>
          <div className="mx-auto md:w-[50%] w-full m-5 p-5">
            <img src={banner} alt="" />
            <div className="text-xl mx-auto ">
              <Link
                to={`/user/${username}`}
                className="flex gap-5 items-center mb-5 p-2"
              >
                <img
                  src={profile_img}
                  alt=""
                  className="w-14 h-14 rounded-full "
                />
                <div>
                  <h1 className="font-medium text-xl line-clamp-2 ">
                    {fullname}
                  </h1>
                  <p className="text-dark-grey">@{username}</p>
                </div>
              </Link>

              <div className="flex">
                <span className="ml-3 flex items-center gap-2 text-dark-grey">
                  <i className="fi fi-rr-heart text-xl"></i>
                  {total_likes}
                </span>
                <span className="ml-3 flex items-center gap-2 text-dark-grey">
                  <i className="fi fi-rr-comment-alt-dots"></i>
                  {total_comments}
                </span>
              </div>

              <div className="p-10 flex flex-wrap">
                {tags.map((tag, i) => {
                  return (
                    <span className="btn-dark py-1 px-4 m-2" key={i}>
                      {tag}
                    </span>
                  );
                })}
              </div>

              <div className="bg-[#f3f3f3] rounded-2xl italic font-gelasio text-xl">
                {blocks.map((pra, i) => {
                  if (pra.data.text) {
                    return (
                      <h1
                        key={i}
                        dangerouslySetInnerHTML={{ __html: pra.data.text }}
                        className="m-5"
                      />
                    );
                  } else if (pra.data.items) {
                    let items = pra.data.items;
                    return (
                      <ul className="list-inside list-disc" key={i}>
                        {items.map((item, j) => {
                          return (
                            <li
                              key={j}
                              className="text-xl"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          );
                        })}
                      </ul>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <div></div>
        </div>
      )}
    </AnimationWrapper>
  );
};

export default BLogContent;

import axios from "axios";
import getDate from "../common/date";
import { Link, redirect } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const BlogPostCard = (props) => {
  let { content, author, Deletebtn, myReRedrenfun } = props;
  let {
    title,
    blog_id,
    publishedAt,
    tags,
    des,
    banner,
    activity: { total_likes },
  } = content;

  let {
    personal_info: { fullname, profile_img, username },
  } = author;

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("delete blog", typeof blog_id);

    axios
      .delete(import.meta.env.VITE_SERVER_DOMAIN + `/delete-blog/${blog_id}`)
      .then((data) => {
        console.log(data);
        window.location.replace(`/dashboard/blogs/${username}`);
        console.log("username>>>>>>", username);
        return toast.success(data.success);
      })
      .catch((err) => {
        console.log(err);
        return toast.error("Problem in blog deletion");
      });
  };

  return (
    <Link
      to={`/blog/${blog_id}`}
      className="flex gap-8 items-center border-b border-grey pb-5 mb-4 "
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img
            src={profile_img}
            alt="Profile_img"
            className="w-6 h6 rounded-full"
          />
          <p className="line-clamp-1">
            {fullname}@{username}
          </p>
          <p className="min-w-fit">{getDate(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>

        <div className="flex gap-4 mt-7 ">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square flex items-center justify-center sm:flex-row flex-col">
        <img
          src={banner}
          alt="banner"
          className="w-full aspect-square object-cover"
        />
        {Deletebtn ? (
          <span
            className="flex gap-2 text-dark-grey"
            onClick={(e) => {
              handleDelete(e);
            }}
          >
            <i className="fi fi-rr-trash p-2 text-xl" />
            <h1>Delete Blog</h1>
          </span>
        ) : (
          ""
        )}
      </div>
    </Link>
  );
};

export default BlogPostCard;

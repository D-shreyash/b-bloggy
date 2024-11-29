import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import AnimationWrapper from "../common/page-animation";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
  let charcaterLimit = 200;
  let tagLimit = 10;
  let {
    blog,
    blog: { banner, title, tags, des, content },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);
  let navigate = useNavigate();

  let {
    UserAuth: { access_token },
  } = useContext(UserContext);

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDescriptionChange = (e) => {
    let input = e.target;
    console.log("description is >>", input);
    setBlog({ ...blog, des: input.value });
  };

  const handelTitleKeyDown = (e) => {
    // console.log(e);
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleKeyDownFunction = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`you can add max ${tagLimit} tags`);
      }

      e.target.value = "";
    }
  };

  const publishBlogFunction = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write blog title before publishing");
    }
    if (!des.length && des.length > charcaterLimit) {
      return toast.error(
        `Write blog description before publishing ${charcaterLimit} charters to publish`
      );
    }
    if (!tags.length) {
      return toast.error("Enter at least 1 tag to help us rank your blog ");
    }

    let loadingToast = toast.loading("publishing...");

    e.target.classList.add("disable");

    let blogObj = {
      title,
      banner,
      des,
      content,
      tags,
      draft: false,
    };

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
        headers: {
          Authorization: `Bearer ${access_token} `,
        },
      })
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("published 👍");

        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ reponse }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);

        return toast.error(reponse.data.error);
      });
  };
  return (
    <AnimationWrapper>
      <section>
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross-small"></i>
        </button>

        <div className="md:flex">
          <div className="max-w-[550px] center my-auto">
            <p className="text-dark-greay mb-1">Preview</p>

            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <img src={banner} />
            </div>

            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
              {title}
            </h1>

            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
              {des}
            </p>
          </div>

          <div className="border-grey lg:border-1 lg:pl-8 mx-4">
            <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
            <input
              type="text"
              placeholder="Blog Title"
              defaultValue={title}
              className="input-box pl-4"
              onChange={handleBlogTitleChange}
            />

            <p className="text-dark-grey mb-2 mt-9">
              Short description about your blog
            </p>

            <textarea
              maxLength={charcaterLimit}
              defaultValue={des}
              className="h-40 resize-none leading-7 input-box pl-4 "
              onChange={handleBlogDescriptionChange}
              onKeyDown={handelTitleKeyDown}
            ></textarea>

            <p className="mt-1 text-dark-grey text-sm text-right">
              {charcaterLimit - des.length}Characters Left
            </p>

            <p className="text-dark-grey mb-2 mt-9">
              Topics-(helps in searching and ranking your blog post)
            </p>

            <div className="realative input-box pl-2 py-2 pb-4">
              <input
                type="text"
                placeholder="Topic "
                className="stickey input-box bg-white top-0 left-0 pl-4 mb-5 focus:bg-white"
                onKeyDown={handleKeyDownFunction}
              />
              {tags.map((tag, i) => {
                return <Tag tag={tag} tagIndex={i} key={i} />;
              })}
            </div>
            <p className="mt-1 mb4 text-dark-grey text-right">
              {tagLimit - tags.length}tags left
            </p>

            <button className="btn-dark px-8" onClick={publishBlogFunction}>
              Publish
            </button>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;

import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defalutBanner from "../imgs/blog banner.png";
import UploadImageToCloudinary from "../common/Cloudinary";
import { useState, useEffect, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {
  let [BannerImg, SetBannerImg] = useState(defalutBanner);
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    SetTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let {
    UserAuth: { access_token },
  } = useContext(UserContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (!textEditor.isReady) {
      SetTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: content,
          tools: tools,
          placeholder: "Let's write an awesome story",
        })
      );
    }
  }, []);

  const handelBannerUpload = async (e) => {
    let loadingToast = toast.loading("Uploading...");
    let img = e.target.files[0];
    const imageUrl = await UploadImageToCloudinary(img)
      .then((res) => {
        SetBannerImg(res);
        // console.log("hear..........");
        setBlog({ ...blog, banner: res });
        toast.dismiss(loadingToast);
        toast.success("Uploaded 👍");
      })
      .catch((err) => {
        console.log("errro hai bhai>", err);
        toast.error("Error in uplaoding the Image");
      });

    console.log("image url in main>>>>", imageUrl);
  };

  useEffect(() => {
    console.log("banner image is >>", BannerImg);
  }, [BannerImg]);

  const handelTitleKeyDown = (e) => {
    // console.log(e);
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handelTitleChange = (e) => {
    // console.log(e);
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = () => {
    if (!banner.length) {
      return toast.error("upload a banner to publish your blog");
    }
    if (!title.length) {
      return toast.error("Write a Title to publish your blog");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("write something in the blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write blog title before saving it to draft");
    }

    let loadingToast = toast.loading("saving draft...");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          des,
          content,
          tags,
          draft: true,
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
      });
    }
  };
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo}></img>
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handelBannerUpload}
                  name="uploadBanner"
                  hidden
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handelTitleKeyDown}
              onChange={handelTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5 " />

            <div id="textEditor" className="font-galasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;

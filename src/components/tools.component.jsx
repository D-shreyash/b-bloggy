import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import UploadImageToCloudinary from "../common/Cloudinary";

const uploadImageByFile = (e) => {
  return UploadImageToCloudinary(e).then((url) => {
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  });
};

const uploadImageByUrl = async (e) => {
  let link = new Promise((reolve, reject) => {
    try {
      reolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevels: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};

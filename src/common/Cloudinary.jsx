import axios from "axios";

const UploadImageToCloudinary = async (img) => {
  let imgUrl = null;

  const formData = new FormData();
  formData.append("uploadImage", img);

  let response = await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log("Request send to backend");
      // console.log("image url is >>>:", res.imageUrl);
      return res;
    })
    .catch((e) => {
      console.log(e);
      console.log("Error in uplaoding imaage ");
    });

  imgUrl = response.data.imageUrl;
  console.log("image url in cloudinary>>>>", imgUrl);
  return imgUrl;
};
export default UploadImageToCloudinary;

import axios from "axios";

export const FilterPaginationData = async ({
  create_new_arr = false,
  arr,
  data,
  page,
  countRoute,
  data_to_send = {},
}) => {
  let obj;

  if (arr != null && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...date], page: page };
  } else {
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send)
      .then(({ data: { totalDocs } }) => {
        obj = { results: data, page: page, totalDocs };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return obj;
};

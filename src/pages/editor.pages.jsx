import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import defalutBanner from "../imgs/blog banner.png";

const blogstructure = {
  title: "",
  banner: defalutBanner,
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(blogstructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, SetTextEditor] = useState({ isReady: false });
  let {
    UserAuth: { access_token },
  } = useContext(UserContext);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        SetTextEditor,
      }}
    >
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;

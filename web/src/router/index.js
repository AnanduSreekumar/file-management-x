import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Auth from "../pages/Auth";
import Filemanager from "../pages/filemanager";
import Admin from "../pages/Admin";
import EditFile from "../pages/EditFile";
import DeleteFile from "../pages/DeleteFile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/filemanager",
    element: <Filemanager />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/delete/:fileId",
    element: <DeleteFile />,
  },
  {
    path: "/edit/:fileId",
    element: <EditFile />,
    // loader: async ({ request, params }) => {
    //   return fetch(`/fake/api/teams/${params.teamId}.json`, {
    //     signal: request.signal,
    //   });
    // },
  },
]);

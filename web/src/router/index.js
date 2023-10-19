import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Auth from "../pages/Auth";
import Filemanager from "../pages/filemanager";
import AdminPage from "../pages/AdminPage";
import EditFile from "../pages/EditFile";
import DeleteFile from "../pages/DeleteFile";
import AdminDeletePage from "../pages/AdminDeletePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // {
  //   path: "/deleteuser/:user_id",
  //   element: <UserDelete />,
  // },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/admindelete/:file_Id",
    element: <AdminDeletePage />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/filemanager",
    element: <Filemanager />,
  },
  // {
  //   path: "/admin/users",
  //   element: <AdminPage />,
  // },
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

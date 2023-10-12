import { createBrowserRouter } from "react-router-dom";

import App from '../App';
import Auth from '../components/auth/Auth';
import Filemanager from "../components/filemanager/filemanager";

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
]);
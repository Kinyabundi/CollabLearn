import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OverviewScreen from "./pages/OverviewScreen";
import OverviewLayout from "./layouts/OverviewLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <OverviewLayout />,
    children: [
      {
        path: "",
        element: <OverviewScreen />,
      },
    ],
  },
]);

export default router;

import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OverviewScreen from "./pages/OverviewScreen";
import OverviewLayout from "./layouts/OverviewLayout";
import NewProject from "./pages/NewProject";
import ViewProject from "./pages/ProjectContent";
import NotFound from "./pages/NotFound";
import EditProjectDocument from "./pages/EditProjectDocument";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "app",
		element: <OverviewLayout />,
		children: [
			{
				path: "",
				element: <OverviewScreen />,
			},
			{
				path: "create-new-project",
				element: <NewProject />,
			},
			{
				path: "view-project/:slug",
				element: <ViewProject />,
			},
			{
				path: "edit-project-document/:slug",
				element: <EditProjectDocument />,
			},
		],
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);

export default router;

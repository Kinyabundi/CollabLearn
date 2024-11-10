import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlbumIcon, BookOpen, StarIcon } from "lucide-react";

const OverviewScreen = () => {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">
          <BookOpen className="w-5 h-5" /> <span className="ml-2">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="repos">
          <AlbumIcon className="w-5 h-5" /> <span className="ml-2">Repositories</span>
        </TabsTrigger>
        <TabsTrigger value="stars">
        <StarIcon className="w-5 h-5" /> <span className="ml-2">Stars</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview</TabsContent>
      <TabsContent value="repos">Repositories</TabsContent>
      <TabsContent value="stars">Stars</TabsContent>
    </Tabs>
  );
};

export default OverviewScreen;

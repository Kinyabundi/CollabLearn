import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { ReactNode } from "react";
import Loading from "@/components/loading";

interface LiveblockProviderProps {
  children: ReactNode;
}

const LiveblockProvider = ({ children }: LiveblockProviderProps) => {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_uW9b5IM7gfdz0qyxrbAh5zLvQ4M58cADaiz7xzvA4Dcs1W5vMMmMeNXqYlxyWhcP">
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<Loading />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default LiveblockProvider;

"use client";

import { FC } from "react";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

interface Props {}

const SocketIndicator: FC<Props> = ({}) => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;

"use client";

import { iconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Channel, MemberRole, Server } from "@prisma/client";
import { Edit, Lock, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import ActionTooltip from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface Props {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const ServerChannel: FC<Props> = ({ channel, server, role }) => {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();

  const onClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`);
  };

  const onAction = (e: MouseEvent, action: ModalType) => {
    e.stopPropagation()

    onOpen(action, {channel, server})
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        {
          "bg-zinc-700/20 dark:bg-zinc-700": params?.channelId === channel.id,
        }
      )}
    >
      <span className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400">
        {iconMap[channel.type]}
      </span>
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          {
            "text-primary dark:text-zinc-200 dark:group-hover:text-white":
              params.channelId === channel.id,
          }
        )}
      >
        {channel.name}
      </p>

      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, "editChannel")}
            />
          </ActionTooltip>

          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, "deleteChannel")}
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name == "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;

import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Clock3,
  PlusIcon,
  Building2,
} from "lucide-react";
import { FaFolder } from "react-icons/fa6";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon | any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/my-workspace/recent",
          label: "Recent",
          active: pathname.includes("/recent"),
          icon: Clock3,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "MY FILES",
          active: pathname === "/my-files",
          icon: FaFolder,
          submenus: [
            {
              href: "/my-workspace/my-files/post-1",
              label: "Post 1",
              active: pathname.includes("/post-1"),
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "TEAMS",
          active: pathname === "/teams",
          icon: Building2,
          submenus: [
            {
              href: "/my-workspace/teams/team-1",
              label: "Team 1",
              active: pathname.includes("/team-1"),
            },
          ],
        },
      ],
    },
  ];
}

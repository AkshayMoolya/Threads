import {
  Home,
  Search,
  EditSquare,
  Heart2,
  User,
  Heart,
  Edit,
} from "react-iconly";

import { AiOutlineUser, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";
import { BiHomeAlt, BiEdit, BiSearch } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { LiaEdit } from "react-icons/lia";

export const sidebarLinks = [
  {
    icon: GoHome,
    route: "/",
    label: "Home",
  },
  {
    icon: BiSearch,
    route: "/search",
    label: "Search",
  },
  {
    icon: LiaEdit,
    route: "/create-thread",
    label: "Create Thread",
  },
  {
    icon: AiOutlineHeart,
    route: "/activity",
    label: "Activity",
  },

  {
    icon: AiOutlineUser,
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];

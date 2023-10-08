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
    icon: Home,
    route: "/",
    label: "Home",
  },
  {
    icon: Search,
    route: "/search",
    label: "Search",
  },
  {
    icon: Edit,
    route: "/create-thread",
    label: "Create",
  },
  {
    icon: Heart,
    route: "/notifications",
    label: "Notifications",
  },

  {
    icon: User,
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
];

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

export const desktopLinks = [
  {
    type: "link",
    icon: Home,
    route: "/",
    label: "Home",
  },
  {
    type: "link",
    icon: Search,
    route: "/search",
    label: "Search",
  },
  {
    type: "button",
    icon: Edit,
    route: "/create-thread",
    label: "Create",
  },
  {
    type: "link",
    icon: Heart,
    route: "/notifications",
    label: "Notifications",
  },

  {
    type: "link",
    icon: User,
    route: "/profile",
    label: "Profile",
  },
];
export const mobileLinks = [
  {
    type: "link",
    icon: Home,
    route: "/",
    label: "Home",
  },
  {
    type: "link",
    icon: Search,
    route: "/search",
    label: "Search",
  },
  {
    type: "link",
    icon: Edit,
    route: "/create-thread",
    label: "Create",
  },
  {
    type: "link",
    icon: Heart,
    route: "/notifications",
    label: "Notifications",
  },

  {
    type: "link",
    icon: User,
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
];

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface Props {
  routeType: string;
}

function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  const handleInputFocus = () => {
    setInputFocused(!isInputFocused);
  };

  return (
    <div className={`searchbar ${isInputFocused ? "shadow-lg" : ""} w-full`}>
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={16}
        height={16}
        className="object-contain "
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={handleInputFocus}
        placeholder={"Search"}
        className="no-focus searchbar_input"
      />
    </div>
  );
}

export default Searchbar;

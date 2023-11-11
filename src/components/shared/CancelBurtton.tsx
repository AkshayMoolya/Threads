"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const CancelBurtton = () => {
  const router = useRouter();

  return (
    <Button variant="link" onClick={() => router.back()} className="p-0 mr-1">
      <X className="h-7 w-7" />
    </Button>
  );
};

export default CancelBurtton;

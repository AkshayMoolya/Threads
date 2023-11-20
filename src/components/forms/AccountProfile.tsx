"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useTransition } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { createUser, updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@clerk/nextjs/server";
import { users } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { AlertCircle, Loader2, Pencil } from "lucide-react";
import { validateUsername } from "@/lib/username";
import { toast } from "../ui/use-toast";
import Filter from "bad-words";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
  allUsernames: string[];
}

const AccountProfile = ({ user, btnTitle, allUsernames }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(user.image || "");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const filter = new Filter();

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(file);
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    await createUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const file = e.target.files[0];
    const imgUrl = await startUpload([file]);
    if (imgUrl && imgUrl[0].url) {
      setImage(imgUrl[0].url);
    }
    setLoading(false);
  };

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  return (
    <div className=" sm:min-w-4xl p-4 ">
      <Card className="w-full border-none">
        <CardContent className="w-full p-0">
          <form>
            <div className="grid w-full items-center gap-4">
              <div className=" flex justify-center">
                <div className=" relative">
                  <Image
                    className=" aspect-square object-cover rounded-full"
                    alt={user.name}
                    src={image as string}
                    width={80}
                    height={80}
                  />
                  {loading ? (
                    <Loader2 className=" animate-spin absolute bottom-0 right-0  rounded-full" />
                  ) : (
                    <label htmlFor="profileInput">
                      <Pencil className=" absolute bottom-0 right-0  rounded-full " />
                    </label>
                  )}

                  <input
                    onChange={handleUpload}
                    type="file"
                    accept="image/*"
                    id="profileInput"
                    name="profileInput"
                    hidden
                  />
                </div>
              </div>

              <div className="flex  flex-col space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="username"
                  placeholder="Your unique username"
                />
                {allUsernames.includes(username) &&
                username !== user.username ? (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Username is taken.
                  </div>
                ) : null}
                {filter.isProfane(username) ? (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Choose an
                    appropriate username.
                  </div>
                ) : null}

                {!validateUsername(username) ? (
                  <div className="text-red-500 text-sm flex items-center leading-snug">
                    <AlertCircle className="min-w-[16px] min-h-[16px] mr-1" />{" "}
                    Only use lowercase letters, numbers, underscores, & dots
                    (cannot start/end with last 2). and 404 is reserved.
                  </div>
                ) : null}
                {username.length === 0 ? (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Username cannot be
                    empty.
                  </div>
                ) : username.length > 16 ? (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Username is too
                    long.
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  placeholder="Name displayed on your profile"
                />
                {name.length === 0 ? (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Your name cannot be
                    empty.
                  </div>
                ) : name.length > 16 ? (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Your name is too
                    long.
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  id="bio"
                  placeholder="+ Write bio"
                />
                {name.length > 100 ? (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Your bio is too
                    long.
                  </div>
                ) : null}
              </div>
            </div>
          </form>
          <Button
            onClick={() => {
              setIsSubmitting(true); // Temporarily disable the button

              startTransition(() => {
                createUser({
                  username: username,
                  name: name,
                  bio: bio,
                  image: image,
                  userId: user.id,
                  path: pathname,
                });
              });

              setIsSubmitting(false); // Re-enable the button after the transition completes

              toast({
                title: "User created successfully",
              });

              router.push("/");
            }}
            variant="secondary"
            className="w-full mt-6"
            disabled={
              isSubmitting || // Temporary disabled state
              name.length === 0 ||
              name.length > 16 ||
              username.length === 0 ||
              username.length > 16 ||
              bio.length > 100 ||
              (allUsernames.includes(username) && username !== user.username) ||
              !validateUsername(username) ||
              filter.isProfane(username) // Existing validation conditions
            }
          >
            {btnTitle}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountProfile;

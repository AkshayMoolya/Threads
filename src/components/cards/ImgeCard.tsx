"use client";

import { Image as AntImage } from "antd";

type imageCardProps = {
  content: {
    text?: string | undefined;
    images?: string[] | undefined;
  };
  imageGridClass: string;
};

const ImageCard = ({ content, imageGridClass }: imageCardProps) => {
  return (
    <div className={`my-2 grid ${imageGridClass} gap-3`}>
      <AntImage.PreviewGroup
        preview={{
          maskStyle: {
            backgroundColor: "black",
          },
        }}
      >
        {content?.images?.map((image: string, index: number) => (
          <div key={index}>
            <AntImage
              alt="image"
              className="shadow-xl border aspect-[4/3] object-cover rounded-md "
              src={image}
            />
          </div>
        ))}
      </AntImage.PreviewGroup>
    </div>
  );
};

export default ImageCard;

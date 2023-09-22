"use client";

import { Image as AntImage } from "antd";

const ImageCard = ({ content, imageGridClass }: any) => {
  return (
    <div className={`my-2 grid ${imageGridClass} gap-3`}>
      <AntImage.PreviewGroup>
        {content.images.map((image: any, index: any) => (
          <div key={index}>
            <AntImage
              alt="image"
              className="shadow-xl border aspect-[4/3] object-cover rounded-md"
              src={image}
            />
          </div>
        ))}
      </AntImage.PreviewGroup>
    </div>
  );
};

export default ImageCard;

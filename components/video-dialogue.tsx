"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";
const VideoDialog = () => {
  const [open, setopen] = React.useState(false);
  return (
    <>
      {" "}
      <div
        className="bg-center bg-cover flex justify-center items-center"
        style={{
          backgroundImage: "url('/overlay_yt_video.jpg')",
          height: "80dvh",
        }}
      >
        <Button
          onClick={() => setopen(true)}
          className="bg-transparent hover:bg-transparent text-white border rounded-full size-36"
        >
          <Play size={50} />
        </Button>
      </div>
      <Dialog onOpenChange={setopen} open={open}>
        <DialogTitle/>
        <DialogContent className="p-0 overflow-hidden min-w-[80vw] max-w-[80vw] max-h-[80dvh] aspect-video">
          <iframe
            src="https://www.youtube.com/embed/Xy7PdGfM6WY?feature=oembed&playsinline=1&wmode=opaque&muted=muted"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoDialog;

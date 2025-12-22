"use client";

import { useState, useEffect } from "react";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface SharePopoverProps {
  title: string;
}

export default function SharePopover({ title }: SharePopoverProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
        >
          <Share2 className="h-4 w-4" />
          Del
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex space-x-2">
          <FacebookShareButton url={url} title={title}>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Del på Facebook</span>
            </Button>
          </FacebookShareButton>
          <TwitterShareButton url={url} title={title}>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Del på Twitter</span>
            </Button>
          </TwitterShareButton>
          <LinkedinShareButton url={url} title={title}>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Del på LinkedIn</span>
            </Button>
          </LinkedinShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}

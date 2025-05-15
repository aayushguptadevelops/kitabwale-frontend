import { RWebShare } from "react-web-share";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface RWebShareProps {
  url: string;
  title: string;
  text: string;
}

export const ShareButton: React.FC<RWebShareProps> = ({ url, title, text }) => {
  return (
    <RWebShare
      data={{ text: text, url: url, title: title }}
      onClick={() => console.log("shared successfully clicked")}
    >
      <Button size="sm" variant="outline">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </RWebShare>
  );
};

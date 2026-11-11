import { isVideo } from "../lib/media";

interface PostMediaProps {
  src?: string | null;
  className?: string;
}

const PostMedia = ({ src, className = "w-full rounded-lg mb-2" }: PostMediaProps) => {
  if (!src) return null;
  return isVideo(src) ? (
    <video src={src} controls className={className} />
  ) : (
    <img src={src} alt="Post attachment" className={`${className} object-cover`} loading="lazy" />
  );
};

export default PostMedia;

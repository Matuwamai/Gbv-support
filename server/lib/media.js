const getBaseUrl = () =>
  (process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, "");

// Turn a stored relative path such as "/uploads/123.png" into an absolute URL.
export const toPublicUrl = (relativePath) => {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  const normalized = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${getBaseUrl()}${normalized}`;
};

export const withUserImage = (user) =>
  user ? { ...user, profileImage: toPublicUrl(user.profileImage) } : user;

export const withPostMedia = (post) =>
  post
    ? {
        ...post,
        mediaUrl: toPublicUrl(post.mediaUrl),
        ...(post.user ? { user: withUserImage(post.user) } : {}),
      }
    : post;

export const withRepostMedia = (repost) =>
  repost
    ? { ...repost, user: withUserImage(repost.user), post: withPostMedia(repost.post) }
    : repost;

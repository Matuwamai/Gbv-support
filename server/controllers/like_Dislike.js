import prisma from "../lib/prisma.js";

const REACTIONS = ["LIKE", "DISLIKE"];

const getReactionSummary = async (postId, userId) => {
  const [likes, dislikes, mine] = await Promise.all([
    prisma.likeDislike.count({ where: { postId, commentId: null, reaction: "LIKE" } }),
    prisma.likeDislike.count({ where: { postId, commentId: null, reaction: "DISLIKE" } }),
    prisma.likeDislike.findFirst({ where: { postId, userId, commentId: null } }),
  ]);
  return { likes, dislikes, userReaction: mine?.reaction ?? null };
};

// Reacting with the same reaction again removes it; a different one replaces it.
export const likeOrDislikePost = async (req, res) => {
  try {
    const postId = parseInt(req.body.postId, 10);
    const reaction = typeof req.body.reaction === "string" ? req.body.reaction.toUpperCase() : "";
    if (isNaN(postId) || !REACTIONS.includes(reaction)) {
      return res.status(400).json({ error: "A valid postId and reaction (LIKE or DISLIKE) are required" });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.user.id;
    const existingReaction = await prisma.likeDislike.findFirst({
      where: { userId, postId, commentId: null },
    });

    let message;
    if (!existingReaction) {
      await prisma.likeDislike.create({ data: { userId, postId, reaction } });
      message = "Reaction added";
    } else if (existingReaction.reaction === reaction) {
      await prisma.likeDislike.delete({ where: { id: existingReaction.id } });
      message = "Reaction removed";
    } else {
      await prisma.likeDislike.update({ where: { id: existingReaction.id }, data: { reaction } });
      message = "Reaction updated";
    }

    return res.status(200).json({ message, ...(await getReactionSummary(postId, userId)) });
  } catch (error) {
    console.error("Like/Dislike Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostReactions = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    return res.status(200).json(await getReactionSummary(postId, req.user.id));
  } catch (error) {
    console.error("Get Reactions Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

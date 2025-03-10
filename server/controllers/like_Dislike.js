import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const likeOrDislikePost = async (req, res) => {
    try {
      const { userId, postId, reaction } = req.body; // Use "reaction" instead of "type"
  
      if (!userId || !postId || !reaction) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const existingReaction = await prisma.likeDislike.findFirst({
        where: { userId, postId },
      });
  
      if (existingReaction) {
        await prisma.likeDislike.delete({ where: { id: existingReaction.id } });
        return res.status(200).json({ message: "Reaction removed" });
      }
  
      const newReaction = await prisma.likeDislike.create({
        data: { userId, postId, reaction }, // Use "reaction"
      });
  
      res.status(201).json(newReaction);
    } catch (error) {
      console.error("Like/Dislike Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const getPostReactions = async (req, res) => {
    try {
      const { postId } = req.params;
  
      if (!postId || isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
  
      const postIdInt = parseInt(postId);
  
      // Count likes and dislikes
      const likes = await prisma.likeDislike.count({
        where: { postId: postIdInt, reaction: "LIKE" },
      });
  
      const dislikes = await prisma.likeDislike.count({
        where: { postId: postIdInt, reaction: "DISLIKE" },
      });
  
      return res.status(200).json({ likes, dislikes });
    } catch (error) {
      console.error("Get Reactions Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  
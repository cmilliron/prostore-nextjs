"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "./auth-actions";
import { formatError } from "../utils";
import { insertReviewSchema } from "../validators";
import { prisma } from "@/db/prisma";

// Create & Udate Review
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error("Use is not authenticated");

    // Validate and store review data and userId
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user.id,
    });
    console.log(review);
    // Get the product being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });
    if (!product) throw new Error("product not found");

    // Check if user has already reviewd this product
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });
    console.log("2");

    // If review exists, update it, otherwise create a new one
    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        // Update Review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            description: review.description,
            title: review.title,
            rating: review.rating,
          },
        });
      } else {
        // Create a new review
        await tx.review.create({ data: review });
      }

      //   get the average rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      // Get the number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      // Update rating and number of reviews
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews: numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: {
      productId: productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { data };
}

// Get a review for a product written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await getCurrentSession();
  if (!session) throw new Error("User is not authenticated");

  return await prisma.review.findFirst({
    where: { productId, userId: session?.user.id },
  });
}

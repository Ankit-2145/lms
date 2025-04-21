import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Must use req.text() because Razorpay sends raw body
export async function POST(req: Request) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const rawBody = await req.text();
    const razorpaySignature = req.headers.get("x-razorpay-signature") ?? "";

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // We only care about successful payments
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const courseId = payment.notes?.courseId;
      const userId = payment.notes?.userId;

      if (!courseId || !userId) {
        return new NextResponse("Missing metadata", { status: 400 });
      }

      // Create purchase (if not already exists)
      const existing = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (!existing) {
        await db.purchase.create({
          data: {
            courseId,
            userId,
          },
        });
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

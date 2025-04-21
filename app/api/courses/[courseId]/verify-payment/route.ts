import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Save the purchase
    await db.purchase.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    return new NextResponse("Payment verified", { status: 200 });
  } catch (error) {
    console.error("[VERIFY_PAYMENT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

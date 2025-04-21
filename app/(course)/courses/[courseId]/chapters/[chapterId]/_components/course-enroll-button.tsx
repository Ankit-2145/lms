"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/courses/${courseId}/checkout`, {
        method: "POST",
      });

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: "My LMS Platform",
        description: data.course.title,
        order_id: data.orderId,
        prefill: {
          name: data.user.name,
          email: data.user.email,
        },
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch(
            `/api/courses/${courseId}/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                courseId,
              }),
            }
          );

          if (verifyRes.ok) {
            window.location.href = `/courses/${courseId}?success=1`;
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

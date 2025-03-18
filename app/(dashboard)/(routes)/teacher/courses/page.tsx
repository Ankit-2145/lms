import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { db } from "@/lib/db";

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;

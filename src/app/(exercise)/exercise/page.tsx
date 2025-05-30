import { Question } from "@/lib/types";
import { cookies } from "next/headers";

async function Page() {
  const cookieStore = await cookies();
  const exercise = cookieStore.get("recent_gen_exercise")?.value;
  const formattedExercise: Question[] = exercise
    ? JSON.parse(exercise).exercises
    : null;
  console.log(formattedExercise);

  return (
    <div className="px-40">
      <div>
        {formattedExercise.map((question: Question, idx) => (
          <div key={`${question}${idx}`}>
            <span>{question.question}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;

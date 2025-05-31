import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Question } from "@/lib/types";
import { LightbulbIcon } from "lucide-react";
import { cookies } from "next/headers";

async function Page() {
  const cookieStore = await cookies();
  const exercise = cookieStore.get("recent_gen_exercise")?.value;
  const formattedExercise: Question[] = exercise
    ? JSON.parse(exercise).exercises
    : null;
  //   console.log(formattedExercise);

  return (
    <div className="px-48">
      <div className="grid grid-cols-1 gap-10">
        {formattedExercise.map((question: Question, idx) => (
          <div key={`${question}${idx}`} className="flex">
            <span>{idx + 1})</span>
            <div className="w-full">
              <div className="flex justify-between">
                <p>{question.question}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="rounded-full bg-primary min-w-7 h-7 flex items-center justify-center">
                      <LightbulbIcon
                        fill="#fff"
                        color="#fff"
                        className="w-5 h-5"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{question.hint}</TooltipContent>
                </Tooltip>
              </div>
              {question.type === "multiple_choice" && (
                <RadioGroup>
                  {Object.keys(question.options).map((option) => (
                    <div
                      key={`${question.question}-${option}`}
                      className="flex gap-2"
                    >
                      <RadioGroupItem
                        value={option}
                        id={`${question.question}-${option}`}
                      />
                      <Label htmlFor={`${question.question}-${option}`}>
                        {question.options[option]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {question.type == "short_answer" && <Textarea />}

              {question.type == "coding" && (
                <div>
                    <span>Example output:</span>
                  <pre>{question.expected_output}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;

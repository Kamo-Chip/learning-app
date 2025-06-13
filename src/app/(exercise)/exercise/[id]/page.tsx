"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExerciseSet, Question } from "@/lib/types";
import { LightbulbIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
function Page() {
  const [exercises, setExercises] = useState<ExerciseSet[]>([]);
  const [exercise, setExercise] = useState<ExerciseSet>();
  const params = useParams();
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishedDialogOpen, setIsFinishedDialogOpen] = useState(false);

  function getUnanswered() {
    const unanswered: number[] = [];

    if (exercise?.exercises) {
      for (let i = 0; i < exercise.exercises.length; i++) {
        if (!answers[i]) {
          unanswered.push(i);
        }
      }
    }

    return unanswered;
  }

  function handleFinish() {
    const unanswered = getUnanswered();

    if (unanswered.length) {
      setIsFinishedDialogOpen(true);
    } else {
      const updatedExercises: ExerciseSet[] = [];
      exercises.forEach((item) => {
        if (item.id === exercise?.id) {
          const updatedExercise: ExerciseSet = { ...exercise };
          updatedExercise["isFinished"] = true;
          updatedExercise.exercises.forEach((ex, idx) => {
            updatedExercise.exercises[idx] = {
              ...ex,
              userAnswer: answers[idx],
            };
          });
          updatedExercises.push({ ...updatedExercise });
        } else {
          updatedExercises.push(item);
        }
      });
      localStorage.setItem("exercises", JSON.stringify(updatedExercises));
      setExercises(updatedExercises);
      document
        .getElementById("scroll-area")
        ?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleRetry() {
    const updatedExercises: ExerciseSet[] = [];
    exercises.forEach((item) => {
      if (item.id === exercise?.id) {
        const updatedExercise: ExerciseSet = { ...exercise };
        updatedExercise["isFinished"] = false;
        updatedExercise.exercises.forEach((ex, idx) => {
          updatedExercise.exercises[idx] = {
            ...ex,
            userAnswer: "",
          };
        });
        updatedExercises.push({ ...updatedExercise });
      } else {
        updatedExercises.push(item);
      }
    });
    localStorage.setItem("exercises", JSON.stringify(updatedExercises));
    setExercises(updatedExercises);
    setAnswers(Array(exercise?.exercises.length).fill(""));

    document
      .getElementById("scroll-area")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleChange(
    e:
      | React.FormEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    numQuestion: number
  ) {
    const copy = [...answers];
    copy[numQuestion] = e.currentTarget.value;
    setAnswers([...copy]);
  }

  useEffect(() => {
    if (exercises.length) {
      setExercise(exercises.find((item) => item.id === params.id));
    }
  }, [exercises, params.id]);

  useEffect(() => {
    if (exercise) {
      setIsFinished(!!exercise.isFinished);
      setAnswers(exercise.exercises.map((item) => item.userAnswer || ""));
    }
    setTimeout(() => {
        console.log(exercise);
      setIsLoading(false);
    }, 1000);
  }, [exercise]);

  useEffect(() => {
    setExercises(JSON.parse(localStorage.getItem("exercises") || "[]"));
  }, []);

  if (!exercise && isLoading)
    return (
      <div className="m-auto flex flex-col items-center">
        <img src="/assets/loading-spinner.svg" className="w-16 h-16" />
      </div>
    );

  if (!exercise && !isLoading) return <span className="m-auto">{"Could not find exercise 🤷🏾‍♂️"}</span>;

  return (
    <div className="py-8 px-96 md:px-52 sm:px-4">
      <div className="grid grid-cols-1">
        {exercise?.exercises.map((question: Question, idx) => (
          <div key={`${question}${idx}`}>
            <div className="flex gap-2">
              <span>{idx + 1})</span>
              <div className="grid grid-cols-1 w-full gap-4">
                <div className="flex justify-between gap-4">
                  <p>{question.question}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="h-fit w-fit rounded-full p-1 bg-amber-300/20 text-yellow-600">
                        <LightbulbIcon className="w-5 h-5 " />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{question.hint}</TooltipContent>
                  </Tooltip>
                </div>
                {question.type === "multiple_choice" && (
                  <RadioGroup value={answers[idx]}>
                    {Object.keys(question.options).map((option) => (
                      <div
                        key={`${question.question}-${option}`}
                        className="flex gap-2 items-center"
                      >
                        <RadioGroupItem
                          disabled={isFinished}
                          value={option}
                          id={`${question.question}-${option}`}
                          onClick={(e) => handleChange(e, idx)}
                        />
                        <Label
                          htmlFor={`${question.question}-${option}`}
                          className="leading-snug"
                        >
                          {question.options[option]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {question.type == "short_answer" && (
                  <Textarea
                    value={answers[idx]}
                    placeholder="Your answer.."
                    disabled={isFinished}
                    onChange={(e) => handleChange(e, idx)}
                  />
                )}

                {question.type == "coding" && (
                  <div className="grid grid-cols-1 gap-4">
                    <Textarea
                      value={answers[idx]}
                      placeholder="Your answer..."
                      disabled={isFinished}
                      onChange={(e) => handleChange(e, idx)}
                    />
                    <div>
                      <span className="text-sm">Example output:</span>
                      <div className="border p-4 rounded-md bg-primary text-secondary text-sm">
                        <pre className="whitespace-pre-wrap">
                          {question.expected_output}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
                {isFinished && (
                  <div className="border-pink-500 border rounded-md p-4 bg-pink-300/30 flex flex-col gap-2 relative">
                    <div>
                      <p className="text-sm">Answer</p>
                      {question.type == "multiple_choice" ? (
                        <p className="font-semibold">
                          {question.options[question.answer]}
                        </p>
                      ) : (
                        <p className="font-semibold">{question.answer}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm">Explanation</p>
                      <p>{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {idx < exercise.exercises.length - 1 && (
              <Separator className="my-8" />
            )}
          </div>
        ))}
        <AlertDialog
          open={isFinishedDialogOpen}
          onOpenChange={setIsFinishedDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {"There's unanswered questions 🥸"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {
                  "Answer all questions before you can reveal solutions. You don't have to get it right, but you must make an attempt"
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Alright man</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {!isFinished ? (
          <Button className="my-8 w-fit mx-auto" onClick={handleFinish}>
            Finish
          </Button>
        ) : (
          <Button className="my-8 w-fit mx-auto" onClick={handleRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

export default Page;

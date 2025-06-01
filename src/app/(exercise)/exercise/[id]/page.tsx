"use client";

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
import { useState, useEffect } from "react";
function Page({ params }: { params: { id: string } }) {
  const [exercises, setExercises] = useState<ExerciseSet[]>([]);
  const [exercise, setExercise] = useState<ExerciseSet>();

  useEffect(() => {
    setExercises(JSON.parse(localStorage.getItem("exercises") || "[]"));
  }, []);

  useEffect(() => {
    if (exercises.length) {
      setExercise(exercises.find((item) => item.id === params.id));
    }
  }, [exercises, params.id]);

  return (
    <div className="py-8 px-48">
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
                        <LightbulbIcon
                          //   fill="#F6BE00"
                          //   color="#F6BE00"
                          className="w-5 h-5 "
                        />
                      </button>
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
                {question.type == "short_answer" && (
                  <Textarea placeholder="Your answer.." />
                )}

                {question.type == "coding" && (
                  <div>
                    <span className="text-sm">Example output:</span>
                    <div className="border p-4 rounded-md bg-primary text-white text-sm">
                      <pre>{question.expected_output}</pre>
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
        <Button className="my-8 w-fit mx-auto">Finish</Button>
      </div>
    </div>
  );
}

export default Page;

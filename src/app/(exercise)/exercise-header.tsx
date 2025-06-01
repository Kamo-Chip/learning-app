"use client";

import { ExerciseSet } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ExerciseHeader() {
  const params = useParams();
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

  return <header className="text-xl">{exercise?.title}</header>;
}

export default ExerciseHeader;

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { PlusIcon, XIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { createNewExercise } from "@/lib/actions";
import { EMPTY_FORM_STATE } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ExerciseSet } from "@/lib/types";

const MAX_SOURCES = 3;

function NewExerciseDialog({ trigger }: { trigger: React.ReactElement }) {
  const [sources, setSources] = useState<File[]>([]);
  const [state, action, isPending] = useActionState(
    createNewExercise.bind(null, sources),
    EMPTY_FORM_STATE
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.data) {
      const newExercise: ExerciseSet = JSON.parse(state.data); // Parse it into an object
      const existing = localStorage.getItem("exercises");
      if (existing) {
        const exercises = JSON.parse(existing);
        exercises.push(newExercise);
        localStorage.setItem("exercises", JSON.stringify(exercises));
      } else {
        localStorage.setItem("exercises", JSON.stringify([newExercise]));
      }
      setOpen(false);

      window.dispatchEvent(new Event("exercises-updated"));
      router.push(`/exercise/${newExercise.id}`);
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">New Exercise</DialogTitle>
        </DialogHeader>
        <form className="grid grid-cols-1 gap-4" action={action}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input type="text" name="topic" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="skill_level">Skill level</Label>
            <Select name="skill_level" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="num_questions">Number of questions</Label>
            <Input
              type="number"
              name="num_questions"
              required
              className="w-20"
              min={1}
              max={10}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="additional_instructions">
              Additional Instructions
            </Label>
            <Textarea name="additional_instructions" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Sources</Label>
            <label
              htmlFor="document"
              className={clsx(
                "border-2 border-dashed rounded-3xl p-2 flex items-center justify-between gap-2 cursor-pointer text-gray-700 w-fit",
                {
                  "bg-secondary text-gray-700/50":
                    sources.length === MAX_SOURCES,
                }
              )}
            >
              <span className="text-sm text-center">
                {!sources.length
                  ? "Add source"
                  : sources.length < MAX_SOURCES
                  ? "Add more"
                  : "Max sources reached"}
              </span>
              <PlusIcon className="w-4 h-4" />
            </label>
            <input
              type="file"
              accept="application/pdf"
              id="document"
              multiple
              disabled={sources.length === MAX_SOURCES}
              className="hidden"
              onChange={(e) => {
                const { files } = e.target;
                const sourcesToAdd = [];
                if (files) {
                  for (let i = 0; i < files.length; i++) {
                    if (
                      !sources
                        .map((source) => source.name)
                        .find((name) => name === files[i].name)
                    ) {
                      sourcesToAdd.push(files[i]);
                    }
                  }
                  setSources([...sources, ...sourcesToAdd]);
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {sources.map((source, idx) => (
                <div
                  key={`${source.name}${idx}`}
                  className="bg-border rounded-3xl p-2 flex items-center gap-2 max-w-60 justify-between w-fit"
                >
                  <span className="truncate text-sm text-gray-700">
                    {source.name}
                  </span>
                  <XIcon
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => {
                      setSources(
                        sources.filter((item) => item.name !== source.name)
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button disabled={isPending} className="w-fit mx-auto">
            {isPending ? "Generating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default NewExerciseDialog;

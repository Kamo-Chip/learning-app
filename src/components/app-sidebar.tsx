"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ExerciseSet } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NewExerciseDialog from "./dialogs/new-exercise-dialog";
import { Input } from "./ui/input";
import { BlocksIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";

function AppSideBar() {
  const params = useParams();
  const [exercises, setExercises] = useState<ExerciseSet[]>([]);
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.currentTarget.value.toLowerCase());
  }

  useEffect(() => {
    if (query) {
      setExercises(
        exercises.filter(
          (exercise) =>
            exercise.title.toLowerCase().includes(query) ||
            exercise.exercises.filter((item) =>
              item.question.toLowerCase().includes(query)
            ).length
        )
      );
    } else {
      const stored = localStorage.getItem("exercises");
      setExercises(stored ? JSON.parse(stored) : []);
    }
  }, [query, exercises]);

  useEffect(() => {
    const stored = localStorage.getItem("exercises");
    setExercises(stored ? JSON.parse(stored) : []);

    const handler = () => {
      const stored = localStorage.getItem("exercises");
      setExercises(stored ? JSON.parse(stored) : []);
    };

    window.addEventListener("storage", handler);
    window.addEventListener("exercises-updated", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("exercises-updated", handler);
    };
  }, []);

  return (
    <Sidebar variant="floating" >
      <SidebarHeader className="text-center text-xl font-medium">
        🧠 EZ 100 
      </SidebarHeader>
      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NewExerciseDialog
                  trigger={
                    <Button className="w-full">
                      <BlocksIcon className="w-5 h-5" />
                      <span>New exercise</span>
                    </Button>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem className="mt-2">
                <div className="flex items-center border-b gap-2 px-2">
                  <span>
                    <SearchIcon className="text-primary w-5 h-5" />
                  </span>

                  <Input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search your exercises..."
                    className="border-none shadow-none p-0 focus-visible:border-none! focus-visible:ring-0!"
                  />
                  {query && (
                    <button className="p-0" onClick={() => setQuery("")}>
                      <XIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Exercises</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!exercises.length && (
                <span className="text-center">No results</span>
              )}
              {exercises.map((exercise) => (
                <SidebarMenuItem key={exercise.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={params.id === exercise.id}
                  >
                    <Link href={`/exercise/${exercise.id}`}>
                      <span>{exercise.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSideBar;

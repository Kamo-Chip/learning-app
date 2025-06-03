import NewExerciseDialog from "@/components/dialogs/new-exercise-dialog";
import { Button } from "@/components/ui/button";

async function Page() {
  return (
    <div className="px-48 flex flex-col items-center justify-center h-full">
      <div className="flex flex-col gap-8 items-center mb-44">
        <h1 className="text-5xl font-semibold">
          {"What are you learning today?"}
        </h1>
        <NewExerciseDialog trigger={<Button variant={"outline"}>Create an exercise 📚</Button>} />
      </div>
    </div>
  );
}

export default Page;

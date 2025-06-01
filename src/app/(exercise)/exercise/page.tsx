import NewExerciseDialog from "@/components/dialogs/new-exercise-dialog";
import { Button } from "@/components/ui/button";

async function Page() {
  return (
    <div className="px-48">
      <NewExerciseDialog trigger={<Button>Create Exercise</Button>} />
    </div>
  );
}

export default Page;

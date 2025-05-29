import UploadFile from "@/components/forms/upload-file";
import { getContext } from "@/lib/context";

export default function Home() {
  return (
    <div>
      <UploadFile />
      <form
        action={async () => {
          "use server";
        
          try {
            console.log("getting context");
            const context = await getContext(
              "How to run and compile MPI Programs",
              process.env.PINECONE_NAMESPACE!,
            );

            console.log(context);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <button>Get context</button>
      </form>
    </div>
  );
}

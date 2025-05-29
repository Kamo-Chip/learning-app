"use client";

import { processSources } from "@/lib/actions";
import { useActionState } from "react";

function UploadFile() {
  const [, action, isPending] = useActionState(processSources, "");
  return (
    <form action={action}>
      <input type="file" accept="application/pdf" name="file" id="file"/>
      <button type="submit" disabled={isPending}>
        {isPending ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}

export default UploadFile;

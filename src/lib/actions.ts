"use server";

import { v4 as uuidv4 } from "uuid";
import { loadDocumentIntoPinecone } from "./rag/pinecone";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./utils";
import { cookies } from "next/headers";

const client = new OpenAI();
export const processSources = async (formState: string, formData: FormData) => {
  const fields = Object.fromEntries(formData.entries());

  const { file } = fields;

  try {
    const source = uuidv4();

    await uploadToPinecone(file as File, source, source.replaceAll("-", ""));

    return "Success";
  } catch (error) {
    console.log("Something went wrong: ", error);
    return "Error";
  }
};

const uploadToPinecone = async (
  document: File,
  source: string,
  idPrefix: string
) => {
  try {
    const result = await loadDocumentIntoPinecone(document, source, idPrefix);

    let text = "";
    result.forEach((page) => {
      page.forEach((chunk) => {
        text += chunk.metadata.text + "\n";
      });
    });
    return text;
  } catch (error) {
    console.error("Failed to get podcast context: ", error);
    throw new Error("Failed to get podcast context");
  }
};

export async function createNewExercise(
  sources: File[],
  formState: string,
  formData: FormData
) {
  const fields = Object.fromEntries(formData.entries());
  console.log(sources);
  console.log(JSON.stringify(fields));

  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: SYSTEM_PROMPT,
    input: `${JSON.stringify(fields)}`,
  });

  console.log(response.output_text);

  const cookieStore = await cookies();
  cookieStore.set("recent_gen_exercise", response.output_text);
  return "";
}

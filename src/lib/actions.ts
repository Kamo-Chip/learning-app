"use server";

import { getContext } from "./context";
import { loadDocumentIntoPinecone } from "./pinecone";
import { v4 as uuidv4 } from "uuid";

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

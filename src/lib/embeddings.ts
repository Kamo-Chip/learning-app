import OpenAI from "openai";
import md5 from "md5";
import { Document } from "@pinecone-database/doc-splitter";
import { PineconeRecord } from "@pinecone-database/pinecone";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, " "),
    });
    const result = response;
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}

export async function embedDocument(
  doc: Document,
  source: string,
  idPrefix: string
) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);

    return {
      id: `${idPrefix}#${md5(doc.pageContent)}`,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
        source: source,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}

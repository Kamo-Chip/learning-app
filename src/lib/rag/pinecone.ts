import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { embedDocument } from "./embeddings";

export const getPineconeClient = () => {
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
};

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

const prepareDocument = async (page: Document) => {
  let { pageContent } = page;
  const { metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  const loc = metadata.loc as { pageNumber: number };

  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
};

// A helper function that breaks an array into chunks of size batchSize
const chunks = (array: PineconeRecord[], batchSize = 100) => {
  const chunks = [];

  for (let i = 0; i < array.length; i += batchSize) {
    chunks.push(array.slice(i, i + batchSize));
  }

  return chunks;
};

export const loadDocumentIntoPinecone = async (
  file: Blob,
  source: string,
  idPrefix: string
) => {
  try {
    console.log("Loading file into pinecone");
    if (!file || !source) {
      throw new Error(
        "Could not load file: [File name and/source was not provided]"
      );
    }

    // Obtain the pdf
    // const loader = new PDFLoader(`./documents/${fileName}.pdf`);
    const loader = new PDFLoader(file);
    const pages = await loader.load();

    // Split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    // Vectorise and embed individual documents
    const vectors = await Promise.all(
      documents.flat().map((doc) => embedDocument(doc, source, idPrefix))
    );

    // Upload to pinecone
    const client = getPineconeClient();
    const pineconeIndex = client.index(process.env.PINECONE_INDEX!);
    const namespace = pineconeIndex.namespace(process.env.PINECONE_NAMESPACE!);

    console.log("Inserting vectors into pinecone");

    const chunkedVectors = chunks(vectors);
    try {
      // Upsert data with 100 records per upsert request
      for (const chunk of chunkedVectors) {
        await namespace.upsert(chunk);
      }
    } catch (error) {
      console.log(error instanceof Error ? error.message : error);
    }
    console.log("Finished loading into pinecone");

    return documents;
  } catch (error) {
    console.log(
      "Could not load file into pinecone: ",
      error instanceof Error ? error.message : error
    );
    throw new Error("Something went wrong");
  }
};

export const deleteRecords = async (idPrefix: string) => {
  try {
    console.log("Fetching records");
    const client = getPineconeClient();
    const pineconeIndex = client.index(process.env.PINECONE_INDEX!);
    const namespace = pineconeIndex.namespace(process.env.PINECONE_NAMESPACE!);

    let pageList = await namespace.listPaginated({ prefix: `${idPrefix}#` });

    if (!pageList.vectors) return;

    const vectorIds = pageList.vectors.map((vector) => vector.id);

    vectorIds.push(...pageList.vectors.map((vector) => vector.id));

    while (pageList.pagination?.next) {
      pageList = await namespace.listPaginated({
        prefix: `${idPrefix}#`,
        paginationToken: pageList.pagination.next,
      });
      if (pageList.vectors) {
        vectorIds.push(...pageList.vectors.map((vector) => vector.id));
      }
    }

    await namespace.deleteMany(vectorIds);
    console.log("Successfully deleted records");
  } catch (error) {
    console.error("Failed to delete Pinecone records: ", error);
    throw new Error("Failed to delete Pinecone records");
  }
};

import { RecordValues } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";
import { getPineconeClient } from "./pinecone";

export const getMatchesFromEmbeddings = async (
  embeddings: RecordValues,
  namespaceToAccess: string,
  topK: number,
  source?: string
) => {
  try {
    const pinecone = getPineconeClient();

    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const namespace = index.namespace(namespaceToAccess);

    let queryResult;

    if (source) {
      queryResult = await namespace.query({
        topK: topK,
        vector: embeddings,
        includeMetadata: true,
        filter: { source: { $eq: source } },
      });
    } else {
      queryResult = await namespace.query({
        topK: topK,
        vector: embeddings,
        includeMetadata: true,
      });
    }

    return queryResult.matches || [];
  } catch (e) {
    console.log(
      "Error querying embeddings: ",
      e instanceof Error ? e.message : e
    );
    throw e;
  }
};

export const getContext = async (
  query: string,
  namespaceToAccess: string,
  source?: string
) => {
  try {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(
      queryEmbeddings,
      namespaceToAccess,
      10,
      source
    );

    const qualifyingDocs = matches.filter(
      (match) => match.score && match.score > 0.63
    );

    const docs = qualifyingDocs.map((match) => match?.metadata?.text);
    return docs.join("\n").substring(0, 50000);
  } catch (e) {
    console.log("Error getting context: ", e instanceof Error ? e.message : e);
    return "";
  }
};

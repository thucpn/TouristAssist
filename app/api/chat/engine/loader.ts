import {
  FILE_EXT_TO_READER,
  SimpleDirectoryReader,
} from "llamaindex/readers/SimpleDirectoryReader";

export const DATA_DIR = "./data";

export function getExtractors() {
  return FILE_EXT_TO_READER;
}

export async function getDocuments(datasource: string) {
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: DATA_DIR + "/" + datasource,
  });
  // Set private=false to mark the document as public (required for filtering)
  for (const document of documents) {
    document.metadata = {
      ...document.metadata,
      private: "false",
    };
  }
  return documents;
}

import { BaseToolWithCall, OpenAIAgent, QueryEngineTool } from "llamaindex";
import { getDataSource } from "./index";
import { createTools } from "./tools";

async function createQueryEngine() {
  const index = await getDataSource({ datasource: "territory-services" });
  if (!index) throw new Error("No data source territory-services found.");
  return new QueryEngineTool({
    queryEngine: index.asQueryEngine(),
    metadata: {
      name: "territory_services_query_engine",
      description: `A query engine to retrieve territory services (health, interpreting,...) in Northern Territory`,
    },
  });
}

export async function createChatEngine(documentIds?: string[], params?: any) {
  const tools: BaseToolWithCall[] = [];

  const territoryServices = await createQueryEngine();
  tools.push(territoryServices);

  tools.push(
    ...(await createTools({
      local: {
        nt_travel_plan: {},
        nt_travel_culture: {},
      },
      llamahub: {},
    })),
  );

  return new OpenAIAgent({
    tools,
    systemPrompt: process.env.SYSTEM_PROMPT,
  });
}

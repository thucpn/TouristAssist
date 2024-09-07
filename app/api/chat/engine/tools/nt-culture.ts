import type { JSONSchemaType } from "ajv";
import { BaseTool, ToolMetadata } from "llamaindex";

export type NTCultureParameter = {
  latitude: number;
  longitude: number;
  ntdl_type: string;
};

export type NTCultureToolParams = {
  metadata?: ToolMetadata<JSONSchemaType<NTCultureParameter>>;
};

const DEFAULT_META_DATA: ToolMetadata<JSONSchemaType<NTCultureParameter>> = {
  name: "nt_travel_culture",
  description: `
    Use this function to get culture places (images, books) in Northern Territory based on the user's location.
  `,
  parameters: {
    type: "object",
    properties: {
      latitude: {
        type: "number",
        description: "The current latitude of the user.",
      },
      longitude: {
        type: "number",
        description: "The current longitude of the user.",
      },
      ntdl_type: {
        type: "string",
        description: "The type of the place (book, image)",
      },
    },
    required: ["latitude", "longitude"],
  },
};

export class NTCultureTool implements BaseTool<NTCultureParameter> {
  metadata: ToolMetadata<JSONSchemaType<NTCultureParameter>>;

  private suggestPlaces = async (input: NTCultureParameter) => {
    console.log("Calling Story API with input: ", input);
    // const lat = input.latitude ?? -16.2329162;
    // const long = input.longitude ?? 136.9949153;
    const lat = -18.0753415;
    const long = 134.8415939;

    const apiUrl = `https://territorystories.nt.gov.au/api/search`; // POST request
    const body = {
      search: {
        ntdl_type: input.ntdl_type ? [input.ntdl_type] : undefined,
        query: `geo-code=(${lat},${long})`,
      },
      limit: true,
    };
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data.results.slice(0, 3);
  };

  constructor(params?: NTCultureToolParams) {
    this.metadata = params?.metadata || DEFAULT_META_DATA;
  }

  async call(input: NTCultureParameter) {
    return await this.suggestPlaces(input);
  }
}

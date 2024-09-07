import type { JSONSchemaType } from "ajv";
import { BaseTool, ToolMetadata } from "llamaindex";

type NTMapDetail = {
  MarkerID: string;
  productserviceId: string;
  updated: string;
  status: string;
  productName: string;
  productCategoryId: string;
  subtypes: string[];
  region: string;
  subregion: string[];
  path: string;
  thumbnail: string;
  location: {
    start: {
      address: string;
      latitude: string;
      longitude: string;
    };
    end: {
      address: string;
      latitude: string;
      longitude: string;
    };
    latitude: string;
    longitude: string;
  };
  dates: string;
  prices: string;
  starRating: string;
  phone: string;
  website: string;
  booking: string;
  email: string;
  tags: string[];
  intro: string;
};

export type NTGuideParameter = {
  MarkerID: string;
};

export type NTGuideToolParams = {
  metadata?: ToolMetadata<JSONSchemaType<NTGuideParameter>>;
};

const DEFAULT_META_DATA: ToolMetadata<JSONSchemaType<NTGuideParameter>> = {
  name: "nt_travel_guide",
  description: `
    Use this function to get detail information about the places in Northern Territory
  `,
  parameters: {
    type: "object",
    properties: {
      MarkerID: {
        type: "string",
        description: "The unique ID of the place.",
      },
    },
    required: ["MarkerID"],
  },
};

export class NTGuideTool implements BaseTool<NTGuideParameter> {
  metadata: ToolMetadata<JSONSchemaType<NTGuideParameter>>;

  private getDetailPlace = async (input: NTGuideParameter) => {
    console.log("Calling Northernterritory Map Detail API with input: ", input);
    const apiUrl = `https://api.northernterritory.com/v1/map?id=${input.MarkerID}`;
    const response = await fetch(apiUrl);
    const data = (await response.json()) as NTMapDetail;
    const webUrl = `https://northernterritory.com${data.path}`;
    return {
      ...data,
      webUrl,
    };
  };

  constructor(params?: NTGuideToolParams) {
    this.metadata = params?.metadata || DEFAULT_META_DATA;
  }

  async call(input: NTGuideParameter) {
    return await this.getDetailPlace(input);
  }
}

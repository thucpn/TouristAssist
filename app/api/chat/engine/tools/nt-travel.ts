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

type NTMapItem = {
  MarkerID: string;
  Category: string;
  SubCategory: string;
  Lat: string;
  Long: string;
  Name: string;
  detail?: NTMapDetail;
};

export type NTTravelParameter = {
  latitude: number;
  longitude: number;
  Category: string;
};

export type NTTravelToolParams = {
  metadata?: ToolMetadata<JSONSchemaType<NTTravelParameter>>;
};

const DEFAULT_META_DATA: ToolMetadata<JSONSchemaType<NTTravelParameter>> = {
  name: "nt_travel_plan",
  description: `
    Use this function to suggest travel places in Northern Territory based on the user's location.
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
      Category: {
        type: "string",
        description:
          "The category of the place (RESTAURANT, EVENT, TOUR, TOURSERVICE, ACCOMM, ATTRACTION, TRANSPORT)",
      },
    },
    required: ["latitude", "longitude"],
  },
};

export class NTTravelTool implements BaseTool<NTTravelParameter> {
  metadata: ToolMetadata<JSONSchemaType<NTTravelParameter>>;

  private getDetailPlace = async (input: { MarkerID: string }) => {
    console.log("Calling Northernterritory Map Detail API with input: ", input);
    const apiUrl = `https://api.northernterritory.com/v1/map?id=${input.MarkerID}`;
    const response = await fetch(apiUrl);
    const data = (await response.json()) as NTMapDetail;
    const webUrl = `https://northernterritory.com${data.path}`;
    const maxThumbnailLength = 100;
    if (data.thumbnail.length > maxThumbnailLength) {
      // only keep uri of the thumbnail (remove the query params)
      data.thumbnail = data.thumbnail.split("?")[0];
    }
    return {
      ...data,
      webUrl,
    };
  };

  private suggestPlaces = async (input: NTTravelParameter) => {
    console.log("Calling Northernterritory Map API with input: ", input);
    const lat = input.latitude ?? -16.2329162;
    const long = input.longitude ?? 136.9949153;
    const apiUrl = `https://api.northernterritory.com/v1/map`;
    const response = await fetch(apiUrl);
    const data = (await response.json()) as NTMapItem[];
    // filter 10 closest places
    const closestPlaces = data
      .filter((item) => item.Category === input.Category)
      .map((item) => ({
        ...item,
        distance: Math.sqrt(
          Math.pow(lat - parseFloat(item.Lat), 2) +
            Math.pow(long - parseFloat(item.Long), 2),
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, process.env.MAX_POST ? parseInt(process.env.MAX_POST) : 2);

    // get detail information of each place
    for (const place of closestPlaces) {
      place.detail = await this.getDetailPlace({ MarkerID: place.MarkerID });
    }

    return closestPlaces;
  };

  constructor(params?: NTTravelToolParams) {
    this.metadata = params?.metadata || DEFAULT_META_DATA;
  }

  async call(input: NTTravelParameter) {
    return await this.suggestPlaces(input);
  }
}

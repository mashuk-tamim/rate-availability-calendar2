import { RoomCalendarResponse } from "@/types/room-calendar";

interface Props {
  method: string;
  url: URL | RequestInfo;
  body?: Record<string, unknown>;
}

export interface IResult<T> {
  data: T;
  message: string;
  status: string;
}

const Fetch = async <TResponseData = RoomCalendarResponse>({
  method,
  url,
  body,
}: Props): Promise<TResponseData> => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON errors

      if (process.env.NODE_ENV === "development") {
        console.error("Fetch Error Response:", errorData);
      }

      throw { ...errorData, statusCode: response.status };
    }

    const data = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log("Response Data Only Dev:", data);
    }

    return data as TResponseData;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Fetch Error Only Dev", error);
    }

    throw error; // Always throw the error for consistent behavior
  }
};

export default Fetch;

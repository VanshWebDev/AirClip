import { toast } from "sonner";
import type { SerializedError } from "@reduxjs/toolkit";

// Define your API error response structure
interface ApiErrorResponse {
  message?: string;
  error?: string;
  // Add other fields your API might return
}

// RTK Query error type from your axiosBaseQuery
interface AxiosBaseQueryError {
  status?: number;
  data?: ApiErrorResponse | string;
}

export const ErrHandling = async (
  err: unknown,
  customMsg: string,
  silent?: boolean
) => {
  if (silent) return;

  const error = err as AxiosBaseQueryError | SerializedError;

  if (error && "status" in error) {
    // Handle axiosBaseQuery error
    const { data } = error;
    let errMsg = customMsg;

    if (typeof data === "string") {
      errMsg = data;
    } else if (data && typeof data === "object") {
      errMsg = data.message || data.error || customMsg;
    }

    toast.error(errMsg);
  } else {
    toast.error(customMsg);
  }
};
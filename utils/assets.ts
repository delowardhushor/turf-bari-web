import { API_URL } from "@/constants";

/** Uploaded files are stored by the API as paths like /uploads/...; this turns one into a loadable URL. */
export const assetUrl = (path: string) =>
  /^(https?:)?\/\//.test(path) ? path : new URL(API_URL).origin + path;

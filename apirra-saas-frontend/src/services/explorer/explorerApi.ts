import axios from "axios";

export const explorerApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const setExplorerBaseUrl = (baseUrl: string) => {
  explorerApi.defaults.baseURL = baseUrl.replace(/\/$/, "");
};

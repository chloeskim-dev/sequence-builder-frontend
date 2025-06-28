const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

type FetchOptions = RequestInit & {
  token?: string;
  retry?: boolean; // to prevent infinite retry loops
};

const getAccessToken = () => localStorage.getItem("accessToken") || "";
export const getRefreshToken = () => localStorage.getItem("refreshToken") || "";

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  // attempt to parse JSON only if content exists
  const contentType = res.headers.get("content-type") || "";

  if (res.status === 204 || !contentType.includes("application/json")) {
    return null;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) throw new Error("No refresh token available");
  const res = await fetch(`${REACT_APP_API_URL}/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();
  const newAccessToken = data.access_token;
  const newRefreshToken = data.refresh_token;

  setTokens(newAccessToken, newRefreshToken);
  return newAccessToken;
};

const request = async (
  path: string,
  options: FetchOptions = {}
): Promise<any> => {
  const { token, headers, retry = false, ...rest } = options;

  const accessToken = token || getAccessToken();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : Array.isArray(headers)
      ? Object.fromEntries(headers)
      : (headers as Record<string, string>) || {}),
  };

  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const url = `${REACT_APP_API_URL}${path}`;

  const res = await fetch(url, {
    headers: defaultHeaders,
    ...rest,
  });

  if (res.status === 401 && !retry) {
    // try refresh token flow once
    try {
      const newAccessToken = await refreshAccessToken();
      // retry original request with new token
      return request(path, { ...options, token: newAccessToken, retry: true });
    } catch (refreshError) {
      clearTokens();
      throw new Error("Session expired. Please login again.");
    }
  }

  return handleResponse(res);
};

export const api = {
  get: (path: string, options?: FetchOptions) =>
    request(path, { method: "GET", ...options }),
  post: (path: string, body: any, options?: FetchOptions) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),
  put: (path: string, body: any, options?: FetchOptions) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),
  delete: (path: string, options?: FetchOptions) =>
    request(path, { method: "DELETE", ...options }),
  setTokens,
  clearTokens,
};

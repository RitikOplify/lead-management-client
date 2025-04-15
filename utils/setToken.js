export const setAccessToken = (token) => {
  document.cookie = `accessToken=${encodeURIComponent(
    token
  )}; path=/; max-age=${15 * 60}; SameSite=Lax; ${
    location.protocol === "https:" ? "Secure;" : ""
  }`;
};

export const setRefreshToken = (token) => {
  document.cookie = `refreshToken=${encodeURIComponent(
    token
  )}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; ${
    location.protocol === "https:" ? "Secure;" : ""
  }`;
};

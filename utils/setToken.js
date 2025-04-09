export const setAccessToken = (token) => {
  document.cookie = `accessToken=${token}; path=/; max-age=900; SameSite=Lax; ${
    location.protocol === "https:" ? "Secure;" : ""
  }`;
};

export const setRefreshToken = (token) => {
  document.cookie = `refreshToken=${token}; path=/; max-age=${
    7 * 24 * 60 * 60
  }; SameSite=Lax; ${location.protocol === "https:" ? "Secure;" : ""}`;
};

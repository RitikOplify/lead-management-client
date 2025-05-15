export const setAccessToken = (token) => {
  console.log(token);
  document.cookie = `accessToken=${token}; path=/; max-age=${1 * 60}`;
};

export const setRefreshToken = (token) => {
  console.log(token);
  document.cookie = `refreshToken=${token}; path=/; max-age=${
    7 * 24 * 60 * 60
  }`;
};

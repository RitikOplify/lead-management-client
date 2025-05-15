export const getCookie = (name) => {
  const token = document.cookie.replace(
    `/(?:(?:^|.*;\s*)${name}\s*=\s*([^;]*).*$)|^.*$/,
    "$1"`
  );
  return token;
};
const PIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082"
    : "https://nft-service-i3w4qwywla-uc.a.run.app";
export const pinBlobs = (data: FormData) =>
  fetch(PIN_URL, {
    method: "POST",
    body: data,
  })
    .then((r) => r.json())
    .then((d) => d);

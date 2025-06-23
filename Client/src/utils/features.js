export const transformImage = (url, width = 400) =>
    url.replace("upload/", `upload/q_auto,f_auto,w_${width}/`);

export const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop().toLowerCase();

  const videoFormats = ["mp4", "webm", "ogg"];
  const audioFormats = ["mp3", "wav", "aac", "flac", "m4a"];
  const imageFormats = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff"];

  if (videoFormats.includes(fileExt)) return "video";
  if (audioFormats.includes(fileExt)) return "audio";
  if (imageFormats.includes(fileExt)) return "image";

  return "image"; // fallback
};

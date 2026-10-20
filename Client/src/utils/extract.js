export const extractTags = (text) => {
  const matches = text.match(/#\w+/g) || [];
  return matches.map(tag => tag.slice(1).toLowerCase());
};

export const extractMentions = (text) => {
  const matches = text.match(/@\w+/g) || [];
  return matches.map(username => username.slice(1));
};
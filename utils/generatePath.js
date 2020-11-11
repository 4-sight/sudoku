exports.generatePath = (date, title) => {
  return `${date}/${title
    .replace(/[!"&$+,\/:;=?"<>#%{}\|\\^~\[\]\`]+/g, "")
    .replace(/(\s+)/g, "-")
    .toLowerCase()}`
}

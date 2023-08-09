let nanoid;

// Use dynamic import() to load nanoid as an ES module
(async () => {
  const nanoidModule = await import('nanoid');
  nanoid = nanoidModule.customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 7);
})();

// Export a function that generates the custom ID using nanoid
exports.generateCustomID = () => {
  return nanoid();
};

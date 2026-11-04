const emblem = `${import.meta.env.BASE_URL}products/3d/signature-emblem-white.png`;

// These two caps share the structured Signature silhouette. Other constructions
// need their own models rather than reusing this one with different colours.
const signatureModels = {
  "ss-cap-red-white": {
    crownColor: "#eae2cf",
    brimColor: "#c72332",
    logoColor: "#b82030",
    logoTextureUrl: emblem,
  },
  "ss-cap-cream-black": {
    crownColor: "#e9e3d2",
    brimColor: "#111216",
    logoColor: "#121317",
    logoTextureUrl: emblem,
  },
};

export const cap3dSpec = (id) => signatureModels[id] || null;

import * as nsfwjs from "nsfwjs";

let _model: nsfwjs.NSFWJS | null = null;

export const loadNSFWModel = async () => {
  if (!_model) {
    const model = await nsfwjs.load();
    _model = model;
  }
};

export const checkNSFW = async (image: HTMLImageElement): Promise<boolean> => {
  if (!_model) await loadNSFWModel();
  if (!_model) return false;

  const predictions = await _model.classify(image);
  const nsfwLabels = ["Porn", "Hentai", "Sexy"];

  return predictions.some((p) => nsfwLabels.includes(p.className) && p.probability > 0.7);
};

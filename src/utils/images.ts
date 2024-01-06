const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('~/assets/images/**');
  } catch (e) {
    // continue regardless of error
  }
  return images;
};

let _images;

/** */
export const fetchLocalImages = async () => {
  _images = _images || load();
  return await _images;
};

/** */
export const findImage = async (imagePath?: string) => {
  if (typeof imagePath !== 'string') {
    return null;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  if (!imagePath.startsWith('~/assets')) {
    return null;
  } // For now only consume images using ~/assets alias (or absolute)

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return typeof images[key] === 'function' ? (await images[key]())['default'] : null;
};
export const getAltTxt = (path) => {
  // Extrae la parte después del último '/'
  const lastSlashIndex = path.lastIndexOf('/');
  const fileNameWithExtension = path.substring(lastSlashIndex + 1);

  // Elimina la extensión del archivo
  const extensionIndex = fileNameWithExtension.lastIndexOf('.');
  const AltTxt = 'Imagen que muestra' + fileNameWithExtension.substring(0, extensionIndex);

  return AltTxt;
};

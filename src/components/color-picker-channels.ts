const formatMap = {
  rgba: ['red', 'green', 'blue', 'alpha'],
  hsla: ['hue', 'saturation', 'lightness', 'alpha'],
  hsba: ['hue', 'saturation', 'brightness', 'alpha'],
  hexa: ['hex', 'alpha'],
} as const;

/** Return the editable channels shown for a supported color format. */
export function getColorChannels<Format extends keyof typeof formatMap>(
  format: Format,
): (typeof formatMap)[Format] {
  return formatMap[format];
}

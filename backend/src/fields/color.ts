import type { TextField } from 'payload'

type ColorFieldOverrides = Omit<TextField, 'type' | 'hasMany' | 'maxRows' | 'minRows'>

export const AccentColor = (overrides?: Partial<ColorFieldOverrides>): TextField => {
  const { name = 'color', label = 'Color', admin, ...rest } = overrides ?? {}

  return {
    type: 'text',
    name,
    label,
    hasMany: false,
    admin: {
      ...admin,
      components: {
        Field: '/components/ColorPicker#ColorPicker',
      },
    },
    ...rest,
  } as TextField
}

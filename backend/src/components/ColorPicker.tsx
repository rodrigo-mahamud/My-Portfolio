'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import './ColorPicker.css'

export const ColorPicker: TextFieldClientComponent = ({ field, path }) => {
  const { label, required } = field
  const { value, setValue } = useField<string>({ path })

  return (
    <div className="color-picker-field">
      <label className="field-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="color-picker-row">
        <input
          type="color"
          className="color-input"
          value={value || '#000000'}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="text"
          className="text-input"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
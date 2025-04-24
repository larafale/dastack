'use client'
import { Controller } from 'react-hook-form'
import { useEffect, useMemo } from 'react'

import { FieldController } from '@/types/form'
import { find } from '@/actions/crud'
import RelationPicker from '@/components/relation-picker'
import useDataset from '@/hooks/use-dataset'

export const RelationField = ({ field, control, formState }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => {
      const { props = {} } = field
      const { model, itemRender, triggerRender, searchOptions } = props

      // If defaultValue is an object with an id property, use it as defaultItem
      const defaultValue = formState?.defaultValues?.[field.name]
      let defaultItem = field.props?.defaultItem || null

      if (formState?.defaultValues?.[model]) {
        defaultItem = formState.defaultValues[model]
      } else if (typeof defaultValue === 'string') {
        // If defaultValue is a string ID, we'll rely on findItemById later
      } else if (defaultValue && typeof defaultValue === 'object' && 'id' in defaultValue) {
        defaultItem = defaultValue
      }

      const dataset = useDataset({
        key: model,
        defaultItem,
        fetchFn: async (options = {}) => {
          if (!model) return { data: [] }
          try {
            return await find(model, { ...options, ...searchOptions })
          } catch (error) {
            console.error('Error fetching relation items:', error)
            return { data: [] }
          }
        },
      });

      return <RelationPicker
        value={formField.value}
        onChange={(value) => {
          formField.onChange(value)
          // Mark field as touched to ensure isDirty is updated
          formField.onBlur()
        }}
        defaultItem={defaultItem}
        dataset={dataset}
        itemRender={itemRender}
        triggerRender={triggerRender}
        disabled={field.disabled}
      />
    }}
  />
)



'use client'
import { Controller } from 'react-hook-form'
import { CopyButton } from '@/components/ui/copy-button'

import { FieldController } from '@/types/form'

import { JsonEditor } from 'json-edit-react'

export const JsonField = ({ field, control }: FieldController) => {
    return (
        <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => {
                return (
                    <div className='text-xs relative'>
                        <div className="absolute top-2 right-2 z-10">
                            <CopyButton text={JSON.stringify(formField.value, null, 2)} />
                        </div>
                        <JsonEditor
                            data={formField.value}
                            setData={formField.onChange}
                            enableClipboard={false}
                            showArrayIndices={false}
                            showStringQuotes={false}
                            showCollectionCount={false}
                            restrictAdd={field.disabled}
                            restrictDelete={field.disabled}
                            restrictEdit={field.disabled}
                            rootName={""}
                        />
                    </div>
                )
            }}
        />
    )
}

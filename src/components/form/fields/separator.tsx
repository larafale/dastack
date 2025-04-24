'use client'
import { FieldController } from '@/types/form'

export const SeparatorField = ({ field }: FieldController) => (
    <div className="mx-auto py-2 w-full">
        {field.label && (
            <p className="text-xs text-muted-foreground text-center p-2">{field.label}</p>
        )}
        <hr className={`border-t ${field.props?.className || 'border-dashed border-muted-foreground/50'}`} />
    </div>
) 
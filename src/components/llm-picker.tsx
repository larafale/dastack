'use client';

import * as React from 'react';
import { Cpu, Check } from 'lucide-react';
import { MODEL_CONFIGS, type LLMString } from '@/lib/llms';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LLMPickerProps {
  defaultLLM?: LLMString;
  showLabel?: boolean;
  onChange?: (llm: LLMString) => void;
}

export function LLMPicker({
  defaultLLM,
  showLabel = false,
  onChange,
}: LLMPickerProps = {}) {
  const [llm, setLLM] = React.useState(defaultLLM);
  const [open, setOpen] = React.useState(false);

  // Safe parsing of provider and model
  const parts = llm?.split(':') || [];
  const provider = parts[0] as keyof typeof MODEL_CONFIGS;
  const modelId = parts[1];
  const currentModel = MODEL_CONFIGS[provider]?.models[modelId];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 hover:bg-muted">
          <Cpu className="h-4 w-4" />
          {showLabel && (
            <span className="text-sm font-medium">
              {currentModel?.name || 'Select Model'}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="p-2 w-[350px]">
        <div className="flex">
          {Object.entries(MODEL_CONFIGS).map(([providerId, provider]) => (
            <div key={providerId} className="flex flex-col items-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {provider.name}
              </div>
              <div className="space-y-1">
                {Object.entries(provider.models).map(([modelId, model]) => (
                  <Button
                    key={modelId}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'w-full justify-start',
                      llm === `${providerId}:${modelId}` && 'bg-accent'
                    )}
                    onClick={() => {
                      setLLM(`${providerId}:${modelId}` as LLMString);
                      setOpen(false);
                      onChange?.(`${providerId}:${modelId}` as LLMString);
                    }}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        llm === `${providerId}:${modelId}`
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <span>{model.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

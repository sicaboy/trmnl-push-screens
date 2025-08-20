'use client';

import React from 'react';

export interface BasePluginProps {
  className?: string;
}

export interface PluginConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export const defaultEInkConfig: PluginConfig = {
  width: 800,
  height: 480,
  backgroundColor: 'white',
  textColor: 'black',
  fontFamily: 'monospace',
};

export function withEInkOptimization<T extends BasePluginProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  return function EInkOptimizedComponent(props: T) {
    return (
      <div className="w-full h-full bg-white text-black font-mono">
        <WrappedComponent {...props} />
      </div>
    );
  };
}
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MathErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // Graceful fallback — show raw content instead of crashing
      return (
        this.props.fallback ?? (
          <span className="text-muted-foreground italic text-sm">
            [Math rendering failed]
          </span>
        )
      );
    }
    return this.props.children;
  }
}
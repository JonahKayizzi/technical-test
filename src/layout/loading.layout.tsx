import React from 'react';

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'progress' | 'dots';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullPage?: boolean;
  inline?: boolean;
  progress?: number;
  color?: 'primary' | 'secondary' | 'white';
}

const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  className = '',
  fullPage = false,
  inline = false,
  progress,
  color = 'primary',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-indigo-600',
    secondary: 'border-gray-600',
    white: 'border-white',
  };

  // Spinner component
  const Spinner = () => (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 ${colorClasses[color]} border-t-transparent ${sizeClasses[size]}`}
    />
  );

  // Dots component
  const Dots = () => (
    <div className="flex space-x-1">
      <div
        className={`w-2 h-2 bg-current rounded-full animate-bounce ${sizeClasses[size]}`}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={`w-2 h-2 bg-current rounded-full animate-bounce ${sizeClasses[size]}`}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={`w-2 h-2 bg-current rounded-full animate-bounce ${sizeClasses[size]}`}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );

  // Progress bar component
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress || 0}%` }}
      />
    </div>
  );

  // Skeleton component
  const Skeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded h-4 mb-2" />
      <div className="bg-gray-200 rounded h-4 mb-2 w-3/4" />
      <div className="bg-gray-200 rounded h-4 w-1/2" />
    </div>
  );

  // Render loading component based on type
  const renderLoading = () => {
    switch (type) {
      case 'dots':
        return <Dots />;
      case 'progress':
        return <ProgressBar />;
      case 'skeleton':
        return <Skeleton />;
      default:
        return <Spinner />;
    }
  };

  // Inline loading
  if (inline) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        {renderLoading()}
        {text && <span className="text-sm text-gray-600">{text}</span>}
      </div>
    );
  }

  // Full page loading
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
        <div className="text-center">
          {renderLoading()}
          {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
        </div>
      </div>
    );
  }

  // Default loading
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      {renderLoading()}
      {text && <p className="text-sm text-gray-600 text-center">{text}</p>}
    </div>
  );
};

// Specialized loading components for common use cases
export const Spinner: React.FC<Omit<LoadingProps, 'type'>> = props => (
  <Loading type="spinner" {...props} />
);

export const Dots: React.FC<Omit<LoadingProps, 'type'>> = props => (
  <Loading type="dots" {...props} />
);

export const Progress: React.FC<
  Omit<LoadingProps, 'type'> & { progress: number }
> = props => <Loading type="progress" {...props} />;

export const Skeleton: React.FC<Omit<LoadingProps, 'type'>> = props => (
  <Loading type="skeleton" {...props} />
);

export const FullPageLoading: React.FC<
  Omit<LoadingProps, 'fullPage'> & { text?: string }
> = ({ text, ...props }) => <Loading fullPage text={text} {...props} />;

export const InlineLoading: React.FC<
  Omit<LoadingProps, 'inline'> & { text?: string }
> = ({ text, ...props }) => <Loading inline text={text} {...props} />;

export default Loading;

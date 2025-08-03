import React from 'react'

interface CardProps {
  id: string
  title: string
  subtitle?: string
  description?: string
  amount?: number
  children?: React.ReactNode
  className?: string
  loading?: boolean
  error?: string
  onEdit?: () => void
  onDelete?: () => void
  onReorder?: (direction: 'up' | 'down') => void
  isEditing?: boolean
  isDragging?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canReorder?: boolean
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  subtitle,
  description,
  amount,
  children,
  className = '',
  loading = false,
  error,
  onEdit,
  onDelete,
  onReorder,
  isEditing = false,
  isDragging = false,
  canEdit = true,
  canDelete = true,
  canReorder = true,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200'
  const draggingClasses = isDragging ? 'opacity-50 scale-95' : ''
  const editingClasses = isEditing ? 'ring-2 ring-indigo-500' : ''
  const errorClasses = error ? 'border-red-300 bg-red-50' : ''
  
  const classes = `${baseClasses} ${draggingClasses} ${editingClasses} ${errorClasses} ${className}`

  return (
    <div
      id={id}
      className={classes}
      role="article"
      aria-label={`Product: ${title}`}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {canReorder && onReorder && (
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => onReorder('up')}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Move up"
                  disabled={loading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => onReorder('down')}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Move down"
                  disabled={loading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
            
            {canEdit && onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                aria-label="Edit"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            {canDelete && onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Delete"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {description && (
          <p className="text-gray-700 mb-3">
            {description}
          </p>
        )}
        
        {amount !== undefined && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Amount:</span>
            <span className="text-lg font-semibold text-gray-900">
              {amount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Drag Handle */}
      {canReorder && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 text-gray-400 cursor-grab active:cursor-grabbing">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default Card
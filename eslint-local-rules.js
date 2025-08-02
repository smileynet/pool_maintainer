/**
 * Custom ESLint plugin for Pool Maintenance application maintainability patterns
 */

module.exports = {
  rules: {
  'prefer-custom-hooks': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Prefer custom hooks for common data fetching patterns',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        useCustomHook: 'Consider using {{hookName}} instead of manual state management for {{pattern}}',
      },
      schema: [],
    },
    create(context) {
      return {
        // Detect manual data fetching patterns
        VariableDeclarator(node) {
          if (
            node.id.type === 'ArrayPattern' &&
            node.init &&
            node.init.callee &&
            node.init.callee.name === 'useState'
          ) {
            const destructured = node.id.elements.map(el => el?.name).filter(Boolean)
            
            // Check for data fetching pattern
            if (destructured.some(name => /^(data|items|list)$/.test(name)) &&
                destructured.some(name => /^(loading|isLoading)$/.test(name))) {
              context.report({
                node,
                messageId: 'useCustomHook',
                data: {
                  hookName: 'useFetchData',
                  pattern: 'data with loading state'
                }
              })
            }
            
            // Check for pagination pattern
            if (destructured.some(name => /^(page|currentPage)$/.test(name))) {
              context.report({
                node,
                messageId: 'useCustomHook',
                data: {
                  hookName: 'usePaginatedData',
                  pattern: 'pagination'
                }
              })
            }
          }
        }
      }
    }
  },

  'enforce-error-boundaries': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce error boundaries around lazy-loaded components',
        category: 'Possible Errors',
        recommended: true,
      },
      messages: {
        needsErrorBoundary: 'Lazy-loaded component should be wrapped with an error boundary',
        useLazyWrapper: 'Use createLazyComponent or createLazyRoute for proper error handling',
      },
      schema: [],
    },
    create(context) {
      return {
        // Check Suspense components for error boundaries
        JSXElement(node) {
          if (node.openingElement.name.name === 'Suspense') {
            // Check if parent has ErrorBoundary
            let parent = node.parent
            let hasErrorBoundary = false
            
            while (parent && parent.type === 'JSXElement') {
              if (parent.openingElement.name.name === 'ErrorBoundary') {
                hasErrorBoundary = true
                break
              }
              parent = parent.parent
            }
            
            if (!hasErrorBoundary) {
              context.report({
                node,
                messageId: 'needsErrorBoundary'
              })
            }
          }
        },

        // Check lazy imports
        CallExpression(node) {
          if (node.callee.name === 'lazy') {
            context.report({
              node,
              messageId: 'useLazyWrapper'
            })
          }
        }
      }
    }
  },

  'consistent-component-naming': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce consistent component naming patterns',
        category: 'Style',
        recommended: true,
      },
      messages: {
        pascalCase: 'Component names should use PascalCase',
        descriptive: 'Component names should be descriptive (avoid generic names like Component, Item, etc.)',
        fileMatch: 'Component name should match filename',
      },
      schema: [],
    },
    create(context) {
      const filename = context.getFilename()
      const baseName = filename.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
      
      return {
        FunctionDeclaration(node) {
          if (node.id && /^[A-Z]/.test(node.id.name)) {
            // Check PascalCase
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(node.id.name)) {
              context.report({
                node: node.id,
                messageId: 'pascalCase'
              })
            }
            
            // Check for generic names
            if (/^(Component|Item|Element|Wrapper|Container)$/.test(node.id.name)) {
              context.report({
                node: node.id,
                messageId: 'descriptive'
              })
            }
            
            // Check filename match (for default exports)
            if (baseName && node.id.name !== baseName && !baseName.includes(node.id.name)) {
              context.report({
                node: node.id,
                messageId: 'fileMatch'
              })
            }
          }
        }
      }
    }
  },

  'prefer-common-props': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Prefer extending common props interfaces',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        extendCommonProps: 'Interface {{name}} should extend from common props interfaces for consistency',
        useExistingProps: 'Consider using {{suggested}} from @/types/common-props instead of redefining',
      },
      schema: [],
    },
    create(context) {
      const commonProps = [
        'children', 'className', 'disabled', 'loading', 'error', 'variant', 'size'
      ]
      
      return {
        TSInterfaceDeclaration(node) {
          if (node.id.name.endsWith('Props')) {
            // Check if it extends anything
            const hasExtends = node.extends && node.extends.length > 0
            
            if (!hasExtends) {
              // Check if it defines common props
              const definedProps = node.body.body
                .filter(member => member.type === 'TSPropertySignature')
                .map(member => member.key.name)
              
              const hasCommonProps = definedProps.some(prop => commonProps.includes(prop))
              
              if (hasCommonProps) {
                const suggested = definedProps.includes('children') && definedProps.includes('className') 
                  ? 'BaseComponentProps'
                  : definedProps.includes('loading') 
                  ? 'LoadableComponentProps'
                  : definedProps.includes('variant')
                  ? 'VariantComponentProps'
                  : 'BaseComponentProps'
                
                context.report({
                  node: node.id,
                  messageId: 'useExistingProps',
                  data: {
                    suggested
                  }
                })
              }
            }
          }
        }
      }
    }
  },

  'performance-hints': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Suggest performance optimizations',
        category: 'Performance',
        recommended: false,
      },
      messages: {
        memoizeExpensiveCalculation: 'Consider memoizing this expensive calculation with useMemo',
        memoizeCallback: 'Consider memoizing this callback with useCallback',
        avoidInlineStyles: 'Avoid inline styles for better performance and maintainability',
      },
      schema: [],
    },
    create(context) {
      return {
        // Detect expensive calculations
        CallExpression(node) {
          const expensiveFunctions = ['map', 'filter', 'reduce', 'sort', 'find']
          
          if (node.callee.type === 'MemberExpression' &&
              expensiveFunctions.includes(node.callee.property.name) &&
              node.parent.type !== 'CallExpression' || 
              (node.parent.callee && node.parent.callee.name !== 'useMemo')) {
            
            // Check if it's inside a component
            let parent = node.parent
            while (parent) {
              if (parent.type === 'FunctionDeclaration' && 
                  parent.id && /^[A-Z]/.test(parent.id.name)) {
                context.report({
                  node,
                  messageId: 'memoizeExpensiveCalculation'
                })
                break
              }
              parent = parent.parent
            }
          }
        },

        // Detect inline styles
        JSXExpressionContainer(node) {
          if (node.expression.type === 'ObjectExpression' &&
              node.parent.type === 'JSXAttribute' &&
              node.parent.name.name === 'style') {
            context.report({
              node,
              messageId: 'avoidInlineStyles'
            })
          }
        }
      }
    }
  }
}
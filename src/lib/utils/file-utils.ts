/**
 * File handling utility functions
 */

/**
 * File type definitions
 */
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'data' | 'unknown'

/**
 * File size units
 */
export type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  return lastDot === -1 ? '' : filename.substring(lastDot + 1).toLowerCase()
}

/**
 * Gets filename without extension
 */
export function getFilenameWithoutExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  return lastDot === -1 ? filename : filename.substring(0, lastDot)
}

/**
 * Determines file type based on extension
 */
export function getFileType(filename: string): FileType {
  const extension = getFileExtension(filename)
  
  const typeMap: Record<string, FileType> = {
    // Images
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', 
    bmp: 'image', svg: 'image', webp: 'image', ico: 'image',
    
    // Videos
    mp4: 'video', avi: 'video', mov: 'video', wmv: 'video',
    flv: 'video', webm: 'video', mkv: 'video', m4v: 'video',
    
    // Audio
    mp3: 'audio', wav: 'audio', ogg: 'audio', aac: 'audio',
    flac: 'audio', wma: 'audio', m4a: 'audio',
    
    // Documents
    pdf: 'document', doc: 'document', docx: 'document', 
    xls: 'document', xlsx: 'document', ppt: 'document', 
    pptx: 'document', txt: 'document', rtf: 'document',
    
    // Archives
    zip: 'archive', rar: 'archive', '7z': 'archive', 
    tar: 'archive', gz: 'archive', bz2: 'archive',
    
    // Data
    json: 'data', xml: 'data', csv: 'data', sql: 'data',
    yaml: 'data', yml: 'data', toml: 'data'
  }
  
  return typeMap[extension] || 'unknown'
}

/**
 * Formats file size to human readable format
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes: FileSizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Converts file size string to bytes
 */
export function parseFileSize(sizeString: string): number {
  const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i)
  if (!match) return 0
  
  const [, value, unit] = match
  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4
  }
  
  return parseFloat(value) * (multipliers[unit.toUpperCase()] || 1)
}

/**
 * Validates file against constraints
 */
export function validateFile(
  file: File,
  constraints: {
    maxSize?: number | string
    allowedTypes?: FileType[]
    allowedExtensions?: string[]
    minSize?: number | string
  } = {}
): FileValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  const maxSize = typeof constraints.maxSize === 'string' 
    ? parseFileSize(constraints.maxSize) 
    : constraints.maxSize
  
  const minSize = typeof constraints.minSize === 'string'
    ? parseFileSize(constraints.minSize)
    : constraints.minSize
  
  // Size validation
  if (maxSize && file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed (${formatFileSize(maxSize)})`)
  }
  
  if (minSize && file.size < minSize) {
    errors.push(`File size (${formatFileSize(file.size)}) is below minimum required (${formatFileSize(minSize)})`)
  }
  
  // Type validation
  const fileType = getFileType(file.name)
  if (constraints.allowedTypes && !constraints.allowedTypes.includes(fileType)) {
    errors.push(`File type '${fileType}' is not allowed. Allowed types: ${constraints.allowedTypes.join(', ')}`)
  }
  
  // Extension validation
  const extension = getFileExtension(file.name)
  if (constraints.allowedExtensions && !constraints.allowedExtensions.includes(extension)) {
    errors.push(`File extension '.${extension}' is not allowed. Allowed extensions: ${constraints.allowedExtensions.map(ext => `.${ext}`).join(', ')}`)
  }
  
  // Warnings for large files
  if (file.size > 10 * 1024 * 1024) { // 10MB
    warnings.push(`Large file detected (${formatFileSize(file.size)}). Upload may take longer.`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Reads file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as text'))
      }
    }
    
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Reads file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as data URL'))
      }
    }
    
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Reads file as array buffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as array buffer'))
      }
    }
    
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Downloads data as file
 */
export function downloadFile(
  data: string | Blob | ArrayBuffer,
  filename: string,
  mimeType?: string
): void {
  let blob: Blob
  
  if (data instanceof Blob) {
    blob = data
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: mimeType || 'application/octet-stream' })
  } else {
    blob = new Blob([data], { type: mimeType || 'text/plain' })
  }
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Compresses image file
 */
export function compressImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    format?: 'jpeg' | 'png' | 'webp'
  } = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        `image/${format}`,
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generates file hash (simplified)
 */
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await readFileAsArrayBuffer(file)
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Chunks file for upload
 */
export function chunkFile(file: File, chunkSize: number = 1024 * 1024): Blob[] {
  const chunks: Blob[] = []
  let start = 0
  
  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    chunks.push(file.slice(start, end))
    start = end
  }
  
  return chunks
}

/**
 * Creates file from URL
 */
export async function createFileFromUrl(
  url: string,
  filename?: string
): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  
  const name = filename || url.split('/').pop() || 'download'
  return new File([blob], name, { type: blob.type })
}

/**
 * Converts file to different format (for images)
 */
export function convertImageFormat(
  file: File,
  format: 'jpeg' | 'png' | 'webp',
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const extension = format === 'jpeg' ? 'jpg' : format
            const baseName = getFilenameWithoutExtension(file.name)
            const newName = `${baseName}.${extension}`
            
            const convertedFile = new File([blob], newName, {
              type: `image/${format}`,
              lastModified: Date.now()
            })
            resolve(convertedFile)
          } else {
            reject(new Error('Failed to convert image'))
          }
        },
        `image/${format}`,
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}
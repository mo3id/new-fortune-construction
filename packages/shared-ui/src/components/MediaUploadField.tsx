import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Link as LinkIcon, 
  X, 
  Loader2, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Search,
  Type,
  Smile,
  ShieldCheck,
  HardHat,
  Leaf,
  Award,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  Globe,
  Settings,
  Users,
  Briefcase,
  Building2,
  Construction,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { cn } from '../lib/utils'

const PRESET_ICONS = {
  'Communication': { Phone, Mail, Share2, Globe, ExternalLink },
  'Company': { Building2, Construction, Users, Briefcase, Settings, Clock },
  'Status': { CheckCircle2, AlertCircle, Info, ShieldCheck, HardHat, Leaf, Award, Download },
  'Navigation': { MapPin, ChevronRight, Search, Type, Smile }
}

interface MediaUploadFieldProps {
  value?: string
  onChange: (value: string) => void
  accept?: 'image' | 'video' | 'icon' | 'any'
  label?: string
  helperText?: string
  onUpload?: (file: File) => Promise<string>
  disabled?: boolean
}

function isLucideIcon(name: string): boolean {
  return Object.values(PRESET_ICONS).some(group => name in group)
}

function renderLucideIcon(name: string, className?: string) {
  for (const group of Object.values(PRESET_ICONS)) {
    const IconComp = (group as any)[name]
    if (IconComp) return <IconComp className={className} />
  }
  return null
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\//.test(url)
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|avi)$/i.test(url) || isYouTubeUrl(url)
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('data:image')
}

export function MediaUploadField({
  value = '',
  onChange,
  accept = 'any',
  label,
  helperText,
  onUpload,
  disabled = false,
}: MediaUploadFieldProps) {
  const [mode, setMode] = useState<'file' | 'url' | 'icon'>(
    value && isLucideIcon(value) ? 'icon' : 'file'
  )
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredIcons = useMemo(() => {
    const allIcons: Record<string, any> = {}
    Object.values(PRESET_ICONS).forEach(group => {
      Object.assign(allIcons, group)
    })
    
    if (!searchQuery) return allIcons
    
    return Object.keys(allIcons)
      .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
      .reduce((acc, name) => {
        acc[name] = allIcons[name]
        return acc
      }, {} as Record<string, any>)
  }, [searchQuery])

  const handleFileSelect = async (file: File) => {
    if (!onUpload) return
    setUploading(true)
    try {
      const url = await onUpload(file)
      onChange(url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (disabled || !e.dataTransfer.files[0]) return
    handleFileSelect(e.dataTransfer.files[0])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const getAcceptString = () => {
    if (accept === 'image') return 'image/*'
    if (accept === 'video') return 'video/*'
    return 'image/*,video/*'
  }

  const renderPreview = () => {
    if (!value) return null

    const isYT = isYouTubeUrl(value)
    const isVid = isVideoUrl(value)
    const isImg = isImageUrl(value)
    const isIcon = isLucideIcon(value)

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group mt-4 overflow-hidden rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800"
      >
        {isIcon ? (
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center text-teal-500 border border-slate-100 dark:border-slate-700">
              {renderLucideIcon(value, "w-10 h-10")}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{value}</p>
          </div>
        ) : isYT ? (
          <div className="aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
            <iframe
              src={getYouTubeEmbedUrl(value)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : isVid ? (
          <video
            src={value}
            className="w-full max-h-[300px] bg-slate-900 rounded-2xl object-contain"
            controls
          />
        ) : isImg ? (
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm text-slate-600 dark:text-slate-400 font-medium truncate flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Upload className="w-5 h-5 text-teal-500" />
            </div>
            {value}
          </div>
        )}
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-rose-500 p-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
          disabled={disabled}
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 ml-1">
          {label}
        </label>
      )}

      {/* Mode Toggle */}
      <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setMode('file')}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
            mode === 'file' 
              ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg shadow-slate-200/50 dark:shadow-black/20" 
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <Upload className="w-3.5 h-3.5" />
          Native Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
            mode === 'url' 
              ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg shadow-slate-200/50 dark:shadow-black/20" 
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          External URL
        </button>
        {(accept === 'any' || accept === 'icon') && (
          <button
            type="button"
            onClick={() => setMode('icon')}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              mode === 'icon' 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg shadow-slate-200/50 dark:shadow-black/20" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            <Smile className="w-3.5 h-3.5" />
            Preset Icon
          </button>
        )}
      </div>

      {/* Icon Picker Mode */}
      {mode === 'icon' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search preset icons..."
              className="pl-11 h-12 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[240px] overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            {Object.entries(filteredIcons).map(([name, IconComp]) => (
              <button
                key={name}
                type="button"
                onClick={() => onChange(name)}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all duration-200 group",
                  value === name
                    ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-teal-500/50 hover:text-teal-500"
                )}
                title={name}
              >
                <IconComp className={cn("w-5 h-5 transition-transform group-hover:scale-110", value === name ? "text-white" : "")} />
                <span className={cn("text-[8px] font-bold truncate w-full text-center", value === name ? "text-teal-50" : "text-slate-400")}>
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Mode */}
      {mode === 'file' && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-500 group overflow-hidden',
            dragActive 
              ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-900/10' 
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-teal-500/30 hover:bg-teal-50/10 dark:hover:bg-teal-900/5',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Processing Upload...</p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                {accept === 'video' ? (
                  <VideoIcon className="w-8 h-8" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </div>
              <p className="font-bold text-slate-900 dark:text-white mb-2 tracking-tight text-lg">
                Drag and drop your asset
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[240px] mx-auto">
                Or <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  disabled={disabled}
                >
                  browse your filesystem
                </button> to select a file.
              </p>
              
              <div className="flex gap-4">
                <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {accept === 'image' && 'Image (10MB)'}
                  {accept === 'video' && 'Video (100MB)'}
                  {accept === 'any' && 'Any Asset'}
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptString()}
                onChange={handleFileInput}
                className="hidden"
                disabled={disabled}
              />
            </div>
          )}
        </div>
      )}

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://content.corporate.com/asset.jpg"
            disabled={disabled}
            className="h-14 px-6 rounded-2xl"
          />
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">
            Supported: Direct Image/Video links & YouTube
          </p>
        </div>
      )}

      {/* Preview */}
      {value && renderPreview()}

      {helperText && (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-2 ml-1">{helperText}</p>
      )}
    </div>
  )
}

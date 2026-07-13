import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, uploadImage } from '../lib/api'
import { Plus, Pencil, Trash2, Loader2, MapPin, DollarSign, Clock, ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { 
  useFormSchema, 
  projectSchema, 
  ProjectFormData, 
  FormInput, 
  Form, 
  Button,
  GlobalModal,
  Card
} from '@fortune/shared-ui'

interface Project extends ProjectFormData {
  _id: string;
}

const EMPTY_FORM: ProjectFormData = {
  title: '', category: 'Infrastructure', location: '', budget: '',
  coverImage: '', challenge: '', solution: '', result: '', galleryImages: [],
}

export default function Projects() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [uploadingGallery, setUploadingGallery] = useState(false)

  const form = useFormSchema({
    schema: projectSchema,
    defaultValues: EMPTY_FORM
  })

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })

  const save = useMutation({
    mutationFn: (data: ProjectFormData) =>
      editingId ? api.put(`/projects/${editingId}`, data) : api.post('/projects', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project saved successfully!')
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to save project'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted successfully')
    },
  })

  const openAdd = () => {
    setEditingId(null)
    form.reset(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditingId(p._id)
    form.reset(p)
    setModalOpen(true)
  }

  const handleImageUpload = async (file: File | null) => {
    if (!file) return
    setUploadingGallery(false)
    setUploading(true)
    try {
      const url = await uploadImage(file)
      form.setValue('coverImage', url)
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploadingGallery(true)
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file))
      const urls = await Promise.all(uploadPromises)
      const current = form.getValues('galleryImages') || []
      form.setValue('galleryImages', [...current, ...urls])
    } catch {
      toast.error('Gallery upload failed')
    } finally {
      setUploadingGallery(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    const current = form.getValues('galleryImages') || []
    form.setValue('galleryImages', current.filter((_, i) => i !== index))
  }

  const onSubmit = (data: ProjectFormData) => {
    save.mutate(data)
  }

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">{projects.length} projects total</p>
        </div>
        <Button onClick={openAdd} className="shadow-lg shadow-teal-500/20">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(p => (
          <Card key={p._id} className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              {p.coverImage
                ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                : <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700"><ImagePlus className="w-10 h-10" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider bg-teal-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                {p.category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 line-clamp-1 group-hover:text-teal-600 transition-colors">{p.title}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400"><MapPin className="w-4 h-4 text-teal-500" />{p.location}</div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400"><DollarSign className="w-4 h-4 text-teal-500" />${p.budget}</div>
                {(p.startDate || p.endDate) && (
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-teal-500" />
                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A'} - {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'Present'}
                  </div>
                )}
              </div>
            <div className="flex gap-3 pt-5 border-t border-slate-50 dark:border-slate-800">
                <Button variant="outline" onClick={() => openEdit(p)} className="flex-1 h-9 text-xs font-bold uppercase tracking-wider">
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => setDeleteId(p._id)} className="h-9 px-4">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <GlobalModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        type="destructive"
        actionText="Delete"
        onAction={() => {
          if (deleteId) remove.mutate(deleteId)
          setDeleteId(null)
        }}
      />

      <GlobalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingId ? 'Edit Project' : 'Add Project'}
        type="custom"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <FormInput name="title" label="Project Title *" placeholder="e.g. Lilongwe Grand Bridge" />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                name="category" 
                label="Category" 
                type="select" 
                options={[
                  { label: 'Infrastructure', value: 'Infrastructure' },
                  { label: 'Commercial', value: 'Commercial' },
                  { label: 'Residential', value: 'Residential' },
                  { label: 'Industrial', value: 'Industrial' }
                ]} 
              />
              <FormInput name="location" label="Location *" placeholder="Lilongwe, Malawi" />
              <FormInput name="startDate" label="Start Date" type="date" />
              <FormInput name="endDate" label="End Date" type="date" />
              <FormInput name="budget" label="Budget" type="number" min="0" placeholder="15000000" />
              <FormInput name="coverImage" label="Cover Image URL or Upload" placeholder="https://..." />
            </div>

            <div className="flex items-end mb-4">
              <Button type="button" variant="outline" className="w-full relative overflow-hidden" disabled={uploading}>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e.target.files?.[0] || null)} />
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
                {uploading ? 'Uploading...' : 'Upload Cover Image'}
              </Button>
            </div>
            
            {form.watch('coverImage') && (
              <div className="mt-2 mb-6">
                <img src={form.watch('coverImage')} className="h-40 w-full object-cover rounded-lg border border-slate-200" alt="preview" />
              </div>
            )}

            {/* Gallery Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-sm font-medium text-gray-900">Project Gallery</label>
              <div className="grid grid-cols-3 gap-3">
                {(form.watch('galleryImages') || []).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden group border border-slate-200">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-md hover:border-sky-500 transition-colors flex flex-col items-center justify-center text-slate-400">
                  {uploadingGallery ? (
                    <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                  ) : (
                    <>
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-xs">Add Photos</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleGalleryUpload(e.target.files)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <FormInput name="challenge" label="The Challenge" type="textarea" placeholder="Describe the main challenge..." rows={3} />
            <FormInput name="solution" label="The Solution" type="textarea" placeholder="Describe the solution approach..." rows={3} />
            <FormInput name="result" label="The Result" type="textarea" placeholder="Describe the outcome..." rows={3} />

            <div className="flex gap-3 pt-4 pb-2 sticky bottom-0 bg-white">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={save.isPending}>
                {save.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {save.isPending ? 'Saving...' : 'Save Project'}
              </Button>
            </div>
          </form>
        </Form>
      </GlobalModal>
    </div>
  )
}

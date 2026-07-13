import { Image, Button } from '@fortune/shared-ui';
import { X, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { ProjectModalProps } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export function ProjectModal({ project, onClose }: ProjectModalProps) {
    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            >
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-4xl w-full overflow-hidden shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="grid md:grid-cols-2">
                        {/* Image Section */}
                        <div className="relative h-80 md:h-full min-h-[400px]">
                            <Image src={project.image} alt={project.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-8 left-8">
                                <span className="text-teal-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2 block">
                                    Featured {project.category}
                                </span>
                                <h3 className="font-display text-3xl font-bold text-white tracking-tight leading-tight">{project.title}</h3>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 md:p-12 flex flex-col">
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all border border-slate-100 dark:border-slate-800 group"
                                >
                                    <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                                </button>
                            </div>

                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-teal-500" />
                                        {project.location}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-teal-500" />
                                        {project.startDate && new Date(project.startDate).getFullYear()}
                                    </span>
                                </div>

                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light mb-10">
                                        {project.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                                <Link to="/contact" onClick={onClose} className="block w-full">
                                    <Button
                                        size="lg"
                                        className="w-full h-16 bg-teal-600 hover:bg-teal-500 text-white font-bold uppercase tracking-widest text-sm shadow-xl shadow-teal-500/20 transition-all"
                                    >
                                        Inquire About Project
                                    </Button>
                                </Link>
                                <Link to={`/projects/${project.id}`} onClick={onClose} className="block w-full">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full h-14 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        View Full Case Study <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

import { Router, Request, Response } from 'express';
import Project from '../models/Project';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404).json({ message: 'Project not found' }); return; }
  res.json(project);
});

router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

router.put('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) { res.status(404).json({ message: 'Project not found' }); return; }
  res.json(project);
});

router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Project deleted' });
});

export default router;

import { Router, Request, Response } from 'express';
import SuccessStory from '../models/SuccessStory';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const stories = await SuccessStory.find().sort({ order: 1 });
  res.json(stories);
});

router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  const story = await SuccessStory.create(req.body);
  res.status(201).json(story);
});

router.put('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  const story = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!story) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(story);
});

router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  await SuccessStory.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

import { Router, Request, Response } from 'express';
import TeamMember from '../models/TeamMember';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const members = await TeamMember.find().sort({ order: 1 });
  res.json(members);
});

router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  const member = await TeamMember.create(req.body);
  res.status(201).json(member);
});

router.put('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!member) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(member);
});

router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

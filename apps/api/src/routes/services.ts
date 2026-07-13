import { Router, Request, Response } from 'express';
import Service from '../models/Service';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const services = await Service.find().sort({ order: 1 });
  res.json(services);
});

router.post('/', protect, async (req: Request, res: Response): Promise<void> => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

router.put('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(service);
});

router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

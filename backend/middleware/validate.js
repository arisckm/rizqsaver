const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['donor', 'receiver']),
  organizationName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().max(500).optional(),
  foodType: z.enum(['veg', 'non-veg', 'vegan', 'mixed']),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  quantityUnit: z.enum(['kg', 'servings', 'portions', 'packs', 'litres']).default('servings'),
  expiresAt: z.coerce.date().refine((d) => d > new Date(), { message: 'Expiry must be in the future' }),
  handlingInstructions: z.string().optional(),
  'location.address': z.string().min(1, 'Address is required'),
  'location.city': z.string().min(1, 'City is required'),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return res.status(400).json({ success: false, errors });
  }
};

module.exports = { registerSchema, loginSchema, listingSchema, validate };

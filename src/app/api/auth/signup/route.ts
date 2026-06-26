import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

async function validateSignupPayload(payload: any) {
  if (!payload) return 'Missing signup data.';
  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : typeof payload.name === 'string' ? payload.name.trim() : '';
  const companyName = typeof payload.companyName === 'string' ? payload.companyName.trim() : typeof payload.company === 'string' ? payload.company.trim() : '';
  if (!fullName || fullName.length < 2) return 'Please enter your full name.';
  if (!companyName || companyName.length < 2) return 'Please enter your company name.';
  if (typeof payload.email !== 'string' || !payload.email.includes('@')) return 'Please enter a valid email address.';
  if (typeof payload.password !== 'string' || payload.password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const validationError = await validateSignupPayload(payload);
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : typeof payload.name === 'string' ? payload.name.trim() : '';
  const companyName = typeof payload.companyName === 'string' ? payload.companyName.trim() : typeof payload.company === 'string' ? payload.company.trim() : '';

  const existingUser = await prisma.client.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ error: 'An account with this email already exists.' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.client.create({
    data: {
      fullName,
      companyName,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  return new Response(JSON.stringify({ id: user.id, email: user.email }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

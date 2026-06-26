import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);

    if (!payload || typeof payload.email !== 'string' || typeof payload.password !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing login data.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const email = payload.email.trim().toLowerCase();

    if (!email || !payload.password) {
      return new Response(JSON.stringify({ error: 'Please provide email and password.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await prisma.client.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.password);

    if (!passwordMatches) {
      return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch {
    return new Response(JSON.stringify({ error: 'Login temporarily unavailable.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
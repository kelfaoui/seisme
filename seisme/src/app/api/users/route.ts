// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // MySQL pool/connection

// GET: fetch paginated users
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;
    const offset = (page - 1) * limit;

    const [users] = await db.query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
    const [result] = await db.query('SELECT COUNT(*) as total FROM users');
    const total = (result as any)[0].total;

    return NextResponse.json({ data: users, total });
  } catch (err: any) {
    console.error('GET /api/users error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST: Créer un utilisateur
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Accepte JSON (inscription) et multipart/form-data (page admin avec upload)
    const { email, first_name, last_name, username, password } =
      contentType.includes('multipart/form-data')
        ? await parseMultipart(req)
        : await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO users (email, first_name, last_name, username, password) VALUES (?, ?, ?, ?, ?)',
      [email, first_name, last_name, username, password]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Simplify multipart parsing to extract text fields we need
async function parseMultipart(req: Request) {
  const form = await req.formData();
  return {
    email: form.get('email'),
    first_name: form.get('first_name'),
    last_name: form.get('last_name'),
    username: form.get('username'),
    password: form.get('password'),
    // profile_pic: form.get('profile_pic') // à gérer plus tard si nécessaire
  } as Record<string, any>;
}

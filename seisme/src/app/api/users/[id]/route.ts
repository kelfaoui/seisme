import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Récupérer un utilisateur par id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = (rows as any[])[0];
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Mettre à jour un utilisateur
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    const data =
      contentType.includes('multipart/form-data')
        ? await parseMultipart(req)
        : await req.json();

    const { email, first_name, last_name, username, password } = data;

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    await db.query(
      `UPDATE users
       SET email = ?, first_name = ?, last_name = ?, username = ?, password = ?
       WHERE id = ?`,
      [email, first_name || null, last_name || null, username || null, password || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Supprimer un utilisateur
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

async function parseMultipart(req: NextRequest) {
  const form = await req.formData();
  return {
    email: form.get('email') as string | null,
    first_name: form.get('first_name') as string | null,
    last_name: form.get('last_name') as string | null,
    username: form.get('username') as string | null,
    password: form.get('password') as string | null,
    // profile_pic: form.get('profile_pic') // à gérer si besoin
  };
}


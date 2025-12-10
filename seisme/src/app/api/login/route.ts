// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; //

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password]
      );
      
      if (rows.length === 0) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }
      
      const user = rows[0];
      
      if (user.password) {
        delete user.password;
      }
      
      // Générer un pseudo token
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      // Retourner l'utilisateur + le token
      return NextResponse.json({ token, user }, { status: 200 });
  } catch (err) {
    console.error('Erreur login:', err);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private prisma: PrismaService) {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;

    if (!user) {
      throw new Error('User not returned from Supabase');
    }

    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
      },
    });

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return data;
  }

  async signOut(accessToken: string) {
    const supabaseWithUser = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    );

    const { error } = await supabaseWithUser.auth.signOut();

    if (error) throw new Error(error.message);

    return { message: 'Logged out' };
  }
}

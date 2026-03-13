import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthError, createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly supabase: ReturnType<typeof createClient>;
  private readonly supabaseUrl: string;
  private readonly supabaseAnonKey: string;

  constructor(private readonly prisma: PrismaService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseKey;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      this.handleAuthError(error);
    }

    const user = data.user;

    if (!user) {
      throw new InternalServerErrorException('User not returned from Supabase');
    }

    try {
      await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email ?? email,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'User created in auth provider but failed in local database',
      );
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.handleAuthError(error);
    }

    return data;
  }

  async signOut(accessToken: string) {
    if (!accessToken?.trim()) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const supabaseWithUser = createClient(
        this.supabaseUrl,
        this.supabaseAnonKey,
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        },
      );

      const { error } = await supabaseWithUser.auth.signOut();

      if (error) {
        throw new UnauthorizedException(`Sign out failed: ${error.message}`);
      }

      return { message: 'Logged out successfully' };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to sign out user');
    }
  }

  private handleAuthError(error: AuthError): never {
    const message = error.message.toLowerCase();

    if (
      message.includes('invalid login credentials') ||
      message.includes('email not confirmed')
    ) {
      throw new UnauthorizedException(error.message);
    }

    if (
      message.includes('already registered') ||
      message.includes('already exists') ||
      message.includes('user already registered')
    ) {
      throw new ConflictException(error.message);
    }

    if (
      message.includes('password') ||
      message.includes('invalid') ||
      message.includes('email')
    ) {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException(error.message);
  }
}

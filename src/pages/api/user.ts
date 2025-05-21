import type { APIRoute } from 'astro';

interface DiscordUserResponse {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner?: string;
  accent_color?: number | null;
  global_name?: string;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
    expires_at: string | null;
  };
  collectibles?: {
    nameplate?: {
      sku_id: string;
      asset: string;
      label: string;
      palette: string;
    }
  };
  banner_color?: string | null;
  clan?: {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
  };
  primary_guild?: {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
  };
}

interface NormalizedUserData {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number | null;
  global_name: string;
  avatar_decoration_asset: string | null;
  nameplate_asset: string | null;
  guild_id: string | null;
  clan_badge: string | null;
  clan_tag: string | null;
}

interface CacheEntry {
  data: NormalizedUserData;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry>();
const API_CACHE_TTL = 10 * 60 * 1000;

function normalizeUserData(data: DiscordUserResponse): NormalizedUserData {
  return {
    id: data.id,
    username: data.username,
    avatar: data.avatar || null,
    discriminator: data.discriminator,
    public_flags: data.public_flags,
    flags: data.flags,
    banner: data.banner || null,
    accent_color: data.accent_color || null,
    global_name: data.global_name || data.username,
    avatar_decoration_asset: data.avatar_decoration_data?.asset || null,
    nameplate_asset: data.collectibles?.nameplate?.asset || null,
    guild_id: data.clan?.identity_guild_id || data.primary_guild?.identity_guild_id || null,
    clan_badge: data.clan?.badge || data.primary_guild?.badge || null,
    clan_tag: data.clan?.tag || data.primary_guild?.tag || null
  };
}

function isValidDiscordUserId(id: string): boolean {
  return /^\d{17,20}$/.test(id);
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');

  if (!userId || !isValidDiscordUserId(userId)) {
    return new Response(JSON.stringify({
      error: 'Invalid Discord user ID. Discord IDs are 17-20 digit numbers.'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const cachedEntry = apiCache.get(userId);
  const now = Date.now();

  if (cachedEntry && (now - cachedEntry.timestamp) < API_CACHE_TTL) {
    return new Response(JSON.stringify(cachedEntry.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600',
        'X-Cache': 'HIT'
      }
    });
  }

  try {
    const token = import.meta.env.DISCORD_BOT_TOKEN;
    if (!token) {
      throw new Error('Discord bot token is not configured in environment variables');
    }

    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 404) {
      return new Response(JSON.stringify({
        error: 'User not found. This Discord user does not exist or is not accessible.'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    if (response.status === 401 || response.status === 403) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. The bot token lacks permissions to fetch user data.'
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Discord API error: ${response.status} ${errorData.message || 'Unknown error'}`);
    }

    const userData: DiscordUserResponse = await response.json();
    const normalizedData = normalizeUserData(userData);

    apiCache.set(userId, {
      data: normalizedData,
      timestamp: now
    });

    return new Response(JSON.stringify(normalizedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching Discord user data:', error);

    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
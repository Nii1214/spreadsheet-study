'use client';

import { createClient } from './client';
import { useEffect, useState } from 'react';

export interface Profile {
    id: string; // user_idと同じ値
    role: string;
    created_at: string;
    updated_at: string;
}

/**
 * 現在のユーザーのプロフィールを取得（クライアント側）
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !data) {
        return null;
    }

    return data as Profile;
}

/**
 * 現在のユーザーが管理者かどうかをチェック（クライアント側）
 */
export async function isAdmin(): Promise<boolean> {
    const profile = await getCurrentUserProfile();
    return profile?.role === 'admin';
}

/**
 * プロフィール情報を取得するフック
 */
export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            // まずユーザーがログインしているか確認
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            // プロフィールを取得
            const profileData = await getCurrentUserProfile();
            setProfile(profileData);
            setLoading(false);
        };

        fetchProfile();

        // 認証状態の変更を監視
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            fetchProfile();
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    return { profile, loading };
}

/**
 * 管理者権限をチェックするフック
 */
export function useIsAdmin() {
    const { profile, loading } = useProfile();
    const isAdminValue = profile?.role === 'admin';

    return { isAdmin: isAdminValue, loading, profile };
}


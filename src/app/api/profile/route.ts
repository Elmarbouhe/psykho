import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { ProfileService } from '@/services/profile-service';

/**
 * Reusable helper to verify the Firebase ID token in the Authorization header.
 */
async function getUserIdFromRequest(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error('API Auth Error:', error);
        return null;
    }
}

export async function GET(request: Request) {
    try {
        const uid = await getUserIdFromRequest(request);
        if (!uid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await ProfileService.getProfile(uid);
        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error('GET Profile Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const uid = await getUserIdFromRequest(request);
        if (!uid) {
            console.error('[API Profile] Unauthorized: No UID found in request');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        console.log(`[API Profile] Received metadata update for UID: ${uid}`, body);

        const updatedProfile = await ProfileService.updateProfile(uid, body);

        return NextResponse.json({ success: true, profile: updatedProfile });
    } catch (error: any) {
        console.error('[API Profile] POST Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}

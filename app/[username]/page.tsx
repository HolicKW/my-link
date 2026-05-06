import { notFound } from "next/navigation";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Link } from "@/data/link";
import ProfilePageClient from "./ProfilePageClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

interface Profile {
  displayName: string;
  bio: string | null;
  photoURL: string | null;
}

// displayName으로 userId 조회
async function fetchUserIdByDisplayName(displayName: string): Promise<string | null> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("slug", "==", displayName), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

// users/{userId}/profile 문서에서 프로필 조회 (없으면 users/{userId} 폴백)
async function fetchProfile(uid: string): Promise<Profile | null> {
  // 1. users/{userId}/profile/main 시도
  const profileRef = doc(db, "users", uid, "profile", "main");
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    const d = profileSnap.data();
    return {
      displayName: d.displayName || "이름 없음",
      bio: d.bio || null,
      photoURL: d.photoURL || null,
    };
  }

  // 2. 없으면 users/{userId} 문서 사용
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;

  const d = userSnap.data();
  return {
    displayName: d.displayName || d.slug || "이름 없음",
    bio: d.bio || null,
    photoURL: d.photoURL || null,
  };
}

// users/{userId}/links 서브컬렉션에서 링크 목록 조회
async function fetchLinks(uid: string): Promise<Link[]> {
  const q = query(
    collection(db, "users", uid, "links"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Link[];
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username: displayName } = await params;

  // displayName으로 userId 조회
  const uid = await fetchUserIdByDisplayName(decodeURIComponent(displayName));
  if (!uid) notFound();

  // 프로필 + 링크 병렬 조회
  const [profile, links] = await Promise.all([
    fetchProfile(uid),
    fetchLinks(uid),
  ]);

  return (
    <ProfilePageClient
      displayName={decodeURIComponent(displayName)}
      profile={profile}
      links={links}
      uid={uid}
    />
  );
}

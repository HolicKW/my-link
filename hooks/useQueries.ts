import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, where, limit, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Link } from "@/data/link";
import { getDoc } from "firebase/firestore";

export const useLinksQuery = (uid?: string) => {
  return useQuery({
    queryKey: ["links", uid],
    queryFn: async () => {
      if (!uid) return [];
      const q = query(
        collection(db, `users/${uid}/links`),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Link[];
    },
    enabled: !!uid, // uid가 있을 때만 쿼리 실행
  });
};

export const useStatsLinksQuery = (uid?: string) => {
  return useQuery({
    queryKey: ["stats-links", uid],
    queryFn: async () => {
      if (!uid) return [];
      const q = query(
        collection(db, `users/${uid}/links`),
        orderBy("clicks", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Link[];
    },
    enabled: !!uid,
  });
};

export const useAddLinkMutation = (uid?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newLinkData: { title: string; url: string; createdAt: string }) => {
      if (!uid) throw new Error("User ID is missing");
      const docRef = await addDoc(collection(db, `users/${uid}/links`), newLinkData);
      return { id: docRef.id, ...newLinkData } as Link;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] });
    },
  });
};

export const useIncrementClickMutation = (uid?: string) => {
  return useMutation({
    mutationFn: async (linkId: string) => {
      if (!uid) throw new Error("User ID is missing");
      const linkRef = doc(db, `users/${uid}/links`, linkId);
      await updateDoc(linkRef, { clicks: increment(1) });
    }
  });
};

export const useUpdateNameMutation = (uid?: string) => {
  return useMutation({
    mutationFn: async (trimmedName: string) => {
      if (!uid) throw new Error("User ID is missing");
      
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", trimmedName), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error("ALREADY_EXISTS");
      }
      
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { displayName: trimmedName });
      return trimmedName;
    }
  });
};

export const useUpdateBioMutation = (uid?: string) => {
  return useMutation({
    mutationFn: async (trimmedBio: string) => {
      if (!uid) throw new Error("User ID is missing");
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { bio: trimmedBio });
      return trimmedBio;
    }
  });
};

export const useUserBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["user-by-slug", slug],
    queryFn: async () => {
      if (!slug) return null;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("slug", "==", slug), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      return querySnapshot.docs[0].id; // userId (uid) 반환
    },
    enabled: !!slug,
  });
};

export const useProfileQuery = (uid?: string) => {
  return useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => {
      if (!uid) return null;
      
      // 1. users/{uid}/profile 문서 확인
      const profileRef = doc(db, `users/${uid}/profile/main`);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        return profileSnap.data();
      }
      
      // 2. 없으면 users/{uid} 문서 기본 정보 사용
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          displayName: data.displayName || data.slug || "이름 없음",
          bio: data.bio || "한 줄 소개가 없습니다.",
          photoURL: data.photoURL || null,
        };
      }
      
      return null;
    },
    enabled: !!uid,
  });
};

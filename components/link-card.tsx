"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type Link } from "@/data/link";
import { Globe, Pencil, Trash2, Loader2, MousePointerClick } from "lucide-react";
import { useIncrementClickMutation } from "@/hooks/useQueries";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LinkCardProps {
  link: Link;
  uid?: string;
  onUpdate?: (link: Link) => void;
  onDelete?: (id: string) => void;
  isReadOnly?: boolean;
}

export function LinkCard({ link, uid, onUpdate, onDelete, isReadOnly = false }: LinkCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [editError, setEditError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const incrementClickMutation = useIncrementClickMutation(uid);

  const handleEditSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setEditError("");
    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    if (!trimmedTitle) {
      setEditError("제목을 입력해주세요.");
      return;
    }
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setEditError("올바른 주소 형식을 입력해주세요 (http:// 또는 https:// 포함).");
      return;
    }

    setIsSubmitting(true);
    try {
      const newUpdatedAt = new Date().toISOString();
      const linkRef = doc(db, `users/${uid}/links`, link.id!);
      await updateDoc(linkRef, {
        title: trimmedTitle,
        url: trimmedUrl,
        updatedAt: newUpdatedAt,
      });
      onUpdate?.({ ...link, title: trimmedTitle, url: trimmedUrl, updatedAt: newUpdatedAt });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setEditError("수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const linkRef = doc(db, `users/${uid}/links`, link.id!);
      await deleteDoc(linkRef);
      onDelete?.(link.id!);
      setDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-3 py-4 px-5">
          {editError && <div className="text-red-400 text-sm font-medium">{editError}</div>}
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="bg-white/10 text-white border-white/20 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/50"
            placeholder="제목"
          />
          <Input
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="bg-white/10 text-white border-white/20 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/50"
            placeholder="URL"
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/20 transition-all"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditTitle(link.title);
                setEditUrl(link.url);
                setEditError("");
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              size="sm"
              className="bg-[#5B5FC7] hover:bg-[#4a4ea0] text-white"
              disabled={isSubmitting}
              onClick={handleEditSubmit}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="group relative block w-full">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          onClick={() => {
            // isReadOnly가 true인 경우(퍼블릭 방문자)에만 조회수 증가
            if (isReadOnly && uid && link.id) {
              incrementClickMutation.mutate(link.id);
            }
          }}
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-black/20">
            <CardContent className="flex items-center gap-4 py-4 pl-5 pr-20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                {!imgError ? (
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                    alt={link.title}
                    width={24}
                    height={24}
                    unoptimized
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <Globe className="w-5 h-5 text-white/60" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-white truncate">
                  {link.title}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {!isReadOnly && (
                    <div className="flex items-center gap-1 text-[11px] text-white/40 font-medium">
                      <MousePointerClick className="w-3 h-3" />
                      {link.clicks || 0}
                    </div>
                  )}
                  {link.updatedAt && (
                    <div className="text-[11px] text-white/40 truncate font-medium">
                      수정됨: {new Date(link.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        {!isReadOnly && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setDeleteModalOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">정말 삭제하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-slate-300">링크: <span className="font-semibold text-white">{link.title}</span></p>
            <p className="text-sm font-medium text-red-500">이 작업은 되돌릴 수 없습니다.</p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="text-white border-slate-700 bg-transparent hover:bg-slate-700 hover:text-white transition-all"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  삭제 중...
                </>
              ) : "삭제하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

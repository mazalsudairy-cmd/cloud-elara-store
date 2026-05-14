import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyDraft = () => ({
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'customer',
  status: 'active',
  email_verified: false,
  newPassword: '',
});

export default function AdminUsers() {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.auth.listUsers(),
  });

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] });

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch, newPassword }) => {
      await api.auth.adminUpdateUser(id, patch);
      if (newPassword?.length >= 8) await api.auth.adminSetPassword(id, newPassword);
    },
    onSuccess: () => {
      toast.success(isRTL ? 'تم الحفظ' : 'Saved');
      invalidate();
      setEditOpen(false);
      setDraft(emptyDraft());
    },
    onError: (err) => {
      const m = err?.message;
      toast.error(m === 'forbidden' ? (isRTL ? 'غير مسموح' : 'Forbidden') : (isRTL ? 'فشل الحفظ' : 'Save failed'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.auth.adminDeleteUser(id),
    onSuccess: () => {
      toast.success(isRTL ? 'تم الحذف' : 'Deleted');
      invalidate();
    },
    onError: (err) => {
      const m = err?.message;
      const msg =
        m === 'cant_delete_self'
          ? (isRTL ? 'لا يمكن حذف نفسك' : 'Cannot delete yourself')
          : m === 'cant_delete_last_admin'
            ? (isRTL ? 'آخر مسؤول' : 'Cannot remove last admin')
            : isRTL ? 'فشل الحذف' : 'Delete failed';
      toast.error(msg);
    },
  });

  const openEdit = (u) => {
    setDraft({
      id: u.id,
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'customer',
      status: u.status || 'active',
      email_verified: !!u.email_verified,
      newPassword: '',
    });
    setEditOpen(true);
  };

  const submitEdit = (e) => {
    e.preventDefault();
    const newPassword = draft.newPassword?.trim();
    if (draft.newPassword && newPassword.length < 8) {
      toast.error(isRTL ? 'كلمة المرور 8+' : 'Password min 8 chars');
      return;
    }
    updateMutation.mutate({
      id: draft.id,
      patch: {
        name: draft.name.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        role: draft.role,
        status: draft.status,
        email_verified: !!draft.email_verified,
      },
      newPassword: newPassword?.length >= 8 ? newPassword : '',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('manageUsers')}</h1>
        <p className="font-display mt-1 text-xs tracking-widest text-gold/40">USERS</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gold/10 bg-navy-mid">
        <Table>
          <TableHeader>
            <TableRow className="border-gold/10 hover:bg-transparent">
              <TableHead className={`text-foreground/60 ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('emailField')} / Name</TableHead>
              <TableHead className="font-english text-foreground/60">Role</TableHead>
              <TableHead className="font-english text-foreground/60">{t('status')}</TableHead>
              <TableHead className={`w-28 text-end ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>…</TableCell></TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="border-gold/8">
                  <TableCell className={`max-w-[200px] ${isRTL ? 'font-arabic' : ''}`}>
                    <div dir="ltr" className="truncate font-english text-xs text-gold/80">{u.email}</div>
                    <div className={`truncate text-[11px] text-foreground/40 ${isRTL ? 'font-arabic' : ''}`}>{u.name || '—'}</div>
                  </TableCell>
                  <TableCell className="font-english text-xs uppercase text-foreground/60">{u.role}</TableCell>
                  <TableCell className="font-english text-xs">{u.status}</TableCell>
                  <TableCell className="text-end">
                    <div className={`flex justify-end gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(u)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400/70 hover:text-red-400"
                        onClick={() => {
                          // eslint-disable-next-line no-alert
                          if (!window.confirm(t('confirmDelete'))) return;
                          deleteMutation.mutate(u.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={(o) => { if (!o) setDraft(emptyDraft()); setEditOpen(o); }}>
        <DialogContent className={isRTL ? 'font-arabic' : 'font-english'} dir={isRTL ? 'rtl' : 'ltr'}>
          <form onSubmit={submitEdit}>
            <DialogHeader>
              <DialogTitle>{isRTL ? 'تعديل مستخدم' : 'Edit user'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div>
                <Label>{isRTL ? 'الاسم' : 'Name'}</Label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="font-english">Email</Label>
                <Input dir="ltr" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="mt-1 font-english" />
              </div>
              <div>
                <Label>{isRTL ? 'الجوال' : 'Phone'}</Label>
                <Input dir="ltr" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="mt-1 font-english" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{isRTL ? 'الدور' : 'Role'}</Label>
                  <Select value={draft.role} onValueChange={(v) => setDraft({ ...draft, role: v })}>
                    <SelectTrigger className="mt-1 font-english"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">customer</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('status')}</Label>
                  <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                    <SelectTrigger className="mt-1 font-english"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('active')}</SelectItem>
                      <SelectItem value="blocked">{isRTL ? 'محظور' : 'blocked'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={draft.email_verified} onCheckedChange={(v) => setDraft({ ...draft, email_verified: v })} />
                <Label className="text-xs">{isRTL ? 'البريد مُتحقَّق منه' : 'Email verified'}</Label>
              </div>
              <div>
                <Label className="font-english">{isRTL ? 'كلمة مرور جديدة (اختياري)' : 'New password (optional)'}</Label>
                <Input
                  type="password"
                  dir="ltr"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={draft.newPassword}
                  onChange={(e) => setDraft({ ...draft, newPassword: e.target.value })}
                  className="mt-1 font-english"
                  minLength={0}
                />
              </div>
            </div>
            <DialogFooter className={`gap-2 ${isRTL ? 'flex-row-reverse sm:flex-row-reverse' : ''}`}>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>{t('cancel')}</Button>
              <Button type="submit" disabled={updateMutation.isPending} className="bg-gold text-navy">{t('save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

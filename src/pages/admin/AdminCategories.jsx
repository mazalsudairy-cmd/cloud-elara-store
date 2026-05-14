import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategories() {
  const { t, isRTL, localized } = useLanguage();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.entities.Category.list('sort_order'),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editing?.id) return api.entities.Category.update(editing.id, data);
      return api.entities.Category.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setDialogOpen(false);
      setEditing(null);
      toast.success(t('save'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.Category.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const openNew = () => {
    setEditing({ name_ar: '', name_en: '', description_ar: '', description_en: '', image: '', sort_order: 0, status: 'active' });
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setEditing({ ...cat });
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm(t('confirmDelete'))) deleteMutation.mutate(id);
  };

  const handleSave = () => {
    const data = { ...editing };
    if (data.sort_order) data.sort_order = Number(data.sort_order);
    delete data.id;
    delete data.created_date;
    delete data.updated_date;
    delete data.created_by;
    saveMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl md:text-3xl font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {t('manageCategories')}
        </h1>
        <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          {t('addCategory')}
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow">
            {cat.image ? (
              <img src={cat.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <FolderOpen className="w-6 h-6 text-muted-foreground/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {localized(cat, 'name')}
              </p>
              <p className="text-sm text-muted-foreground truncate">{localized(cat, 'description')}</p>
            </div>
            <span className={`hidden sm:block text-xs px-2 py-1 rounded-full ${
              cat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {cat.status === 'active' ? t('active') : t('draft')}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className={isRTL ? 'font-arabic' : 'font-english'}>{t('noProducts')}</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'font-arabic' : 'font-english'}>
              {editing?.id ? t('editCategory') : t('addCategory')}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-arabic">{t('categoryName')} (عربي)</Label>
                  <Input value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} className="font-arabic mt-1" dir="rtl" />
                </div>
                <div>
                  <Label className="font-english">{t('categoryName')} (English)</Label>
                  <Input value={editing.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} className="font-english mt-1" dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-arabic">{t('description')} (عربي)</Label>
                  <Textarea value={editing.description_ar || ''} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} className="font-arabic mt-1" dir="rtl" />
                </div>
                <div>
                  <Label className="font-english">{t('description')} (English)</Label>
                  <Textarea value={editing.description_en || ''} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} className="font-english mt-1" dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('status')}</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('active')}</SelectItem>
                      <SelectItem value="hidden">{t('draft')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('sortOrder')}</Label>
                  <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">{t('image')}</Label>
                <ImageUploader images={editing.image ? [editing.image] : []} onChange={(imgs) => setEditing({ ...editing, image: imgs[0] || '' })} />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">{t('cancel')}</Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">{t('save')}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
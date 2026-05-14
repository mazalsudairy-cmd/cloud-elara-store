import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const { t, isRTL, localized } = useLanguage();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.entities.Product.list('-created_date'),
    initialData: [],
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.entities.Category.list(),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editing?.id) return api.entities.Product.update(editing.id, data);
      return api.entities.Product.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDialogOpen(false);
      setEditing(null);
      toast.success(t('save'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.Product.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const openNew = () => {
    setEditing({
      name_ar: '', name_en: '', description_ar: '', description_en: '',
      price: '', compare_price: '', category_id: '', status: 'active',
      featured: false, stock: 0, images: [], sort_order: 0,
    });
    setDialogOpen(true);
  };

  const openEdit = (product) => {
    setEditing({ ...product });
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm(t('confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    const data = { ...editing };
    if (data.price) data.price = Number(data.price);
    if (data.compare_price) data.compare_price = Number(data.compare_price);
    if (data.stock) data.stock = Number(data.stock);
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
          {t('manageProducts')}
        </h1>
        <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          {t('addProduct')}
        </Button>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-muted-foreground/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {localized(p, 'name')}
              </p>
              <p className="text-sm text-accent font-bold">{p.price} {t('sar')}</p>
            </div>
            <span className={`hidden sm:block text-xs px-2 py-1 rounded-full ${
              p.status === 'active' ? 'bg-green-100 text-green-700' :
              p.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {t(p.status)}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className={isRTL ? 'font-arabic' : 'font-english'}>{t('noProducts')}</p>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'font-arabic' : 'font-english'}>
              {editing?.id ? t('editProduct') : t('addProduct')}
            </DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-6">
              {/* Bilingual Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-arabic">{t('productName')} (عربي)</Label>
                  <Input
                    value={editing.name_ar}
                    onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })}
                    className="font-arabic mt-1"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label className="font-english">{t('productName')} (English)</Label>
                  <Input
                    value={editing.name_en}
                    onChange={(e) => setEditing({ ...editing, name_en: e.target.value })}
                    className="font-english mt-1"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Bilingual Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-arabic">{t('description')} (عربي)</Label>
                  <Textarea
                    value={editing.description_ar}
                    onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })}
                    className="font-arabic mt-1 min-h-[100px]"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label className="font-english">{t('description')} (English)</Label>
                  <Textarea
                    value={editing.description_en}
                    onChange={(e) => setEditing({ ...editing, description_en: e.target.value })}
                    className="font-english mt-1 min-h-[100px]"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>{t('price')}</Label>
                  <Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>{t('comparePrice')}</Label>
                  <Input type="number" value={editing.compare_price || ''} onChange={(e) => setEditing({ ...editing, compare_price: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>{t('stock')}</Label>
                  <Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>{t('sortOrder')}</Label>
                  <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} className="mt-1" />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('category')}</Label>
                  <Select value={editing.category_id || ''} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={t('category')} /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{localized(c, 'name')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('status')}</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('active')}</SelectItem>
                      <SelectItem value="draft">{t('draft')}</SelectItem>
                      <SelectItem value="archived">{t('archived')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />
                <Label>{t('isFeatured')}</Label>
              </div>

              {/* Images */}
              <div>
                <Label className="mb-2 block">{t('images')}</Label>
                <ImageUploader images={editing.images || []} onChange={(imgs) => setEditing({ ...editing, images: imgs })} multiple />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                  {t('cancel')}
                </Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
                  {t('save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
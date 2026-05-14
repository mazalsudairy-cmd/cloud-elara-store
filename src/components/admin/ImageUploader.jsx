import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { api } from '@/api/client';
import { Upload, X, Loader2 } from 'lucide-react';

export default function ImageUploader({ images = [], onChange, multiple = false }) {
  const { t, isRTL } = useLanguage();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    
    if (multiple) {
      onChange([...images, ...urls]);
    } else {
      onChange(urls);
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-accent cursor-pointer flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-accent transition-colors">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="text-xs">{t('uploadImage')}</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
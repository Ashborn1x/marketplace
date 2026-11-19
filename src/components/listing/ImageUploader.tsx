import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { CloudUpload, ImagePlus, Star, X } from 'lucide-react';
import { SafeImage } from '../SafeImage';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({
  images,
  onChange,
  error,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);

    const remainingSlots = MAX_FILES - images.length;
    if (remainingSlots <= 0) {
      setUploadError(`You can upload up to ${MAX_FILES} photos.`);
      return;
    }

    const filesToProcess = Array.from(fileList).slice(0, remainingSlots);
    const nextImages: string[] = [];
    let processed = 0;

    filesToProcess.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError('Please upload JPEG, PNG, or WebP images only.');
        processed += 1;
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError('Each image must be 5MB or smaller.');
        processed += 1;
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          nextImages.push(ev.target.result);
        }
        processed += 1;
        if (processed === filesToProcess.length && nextImages.length > 0) {
          onChange([...images, ...nextImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, idx) => idx !== index));
    setUploadError(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#191c1e]">
          Product Photo <span className="text-[#ba1a1a]">*</span>
        </span>
        <span className="text-[12px] font-medium text-[#727687] tabular-nums">
          {images.length} / {MAX_FILES} photos
        </span>
      </div>

      {/* Uploaded Previews */}
      {images.length > 0 && (
        <div className="space-y-2.5">
          <div className="relative rounded-xl overflow-hidden bg-[#eceef1] border border-[#e6e8eb] aspect-[16/10]">
            <SafeImage
              src={images[0]}
              alt="Primary product preview"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#191c1e]/80 text-white text-xs font-semibold flex items-center gap-1 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Cover photo</span>
            </span>
            <button
              type="button"
              onClick={() => handleRemove(0)}
              aria-label="Remove cover photo"
              title="Remove image"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#ba1a1a] hover:bg-[#93000a] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {images.slice(1).map((src, idx) => (
                <div
                  key={`${src.slice(0, 24)}-${idx}`}
                  className="relative aspect-square rounded-lg overflow-hidden bg-[#eceef1] border border-[#e6e8eb]"
                >
                  <SafeImage
                    src={src}
                    alt={`Product preview ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(idx + 1)}
                    aria-label={`Remove photo ${idx + 2}`}
                    title="Remove image"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#ba1a1a] hover:bg-[#93000a] text-white flex items-center justify-center shadow cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          'rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2',
          isDragging
            ? 'border-[#0866ff] bg-[#dbe1ff]/35'
            : error || uploadError
            ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
            : 'border-[#c2c6d8] bg-[#f7f9fc] hover:bg-[#eceef1]'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="sr-only"
        />

        <div className="w-12 h-12 rounded-full bg-[#e6e8eb] text-[#0050cd] flex items-center justify-center">
          <CloudUpload className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <p className="text-[15px] font-semibold text-[#191c1e]">
            Drag and drop product photos here
          </p>
          <p className="text-[13px] text-[#727687]">
            Supports JPEG, PNG, or WebP (max 5MB per file)
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="mt-1"
        >
          <ImagePlus className="w-4 h-4" />
          <span>Upload Image</span>
        </Button>
      </div>

      {(uploadError || error) && (
        <p className="text-[13px] font-medium text-[#ba1a1a]">
          {uploadError || error}
        </p>
      )}
    </div>
  );
}

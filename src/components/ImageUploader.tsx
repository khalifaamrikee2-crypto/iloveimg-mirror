import React, { useState, useRef } from "react";
import { Upload, FileImage, Download, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedDataUrl: string;
  compressedSize: number;
  compressionRatio: number;
}

const ImageUploader = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = (file: File, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px width/height)
        let { width, height } = img;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL(file.type, quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFiles = async (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملفات صور صالحة",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    const newCompressedImages: CompressedImage[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgress(((i + 1) / imageFiles.length) * 100);

      try {
        const compressedDataUrl = await compressImage(file);
        
        // Calculate compressed size (approximate)
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
        const compressionRatio = Math.round((1 - compressedSize / file.size) * 100);

        newCompressedImages.push({
          id: Date.now() + i + "",
          originalFile: file,
          originalSize: file.size,
          compressedDataUrl,
          compressedSize,
          compressionRatio: Math.max(0, compressionRatio),
        });
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }

    setCompressedImages(newCompressedImages);
    setIsProcessing(false);
    setUploadProgress(0);

    toast({
      title: "تم بنجاح",
      description: `تم ضغط ${newCompressedImages.length} صورة بنجاح`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement("a");
    link.download = `compressed_${image.originalFile.name}`;
    link.href = image.compressedDataUrl;
    link.click();
  };

  const downloadAll = () => {
    compressedImages.forEach(image => {
      setTimeout(() => downloadImage(image), 100);
    });
  };

  const removeImage = (id: string) => {
    setCompressedImages(prev => prev.filter(img => img.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragOver
            ? "border-primary bg-iloveimg-light-blue/50"
            : "border-border bg-white hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="p-8 text-center">
          <div className="mb-4">
            <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
            <FileImage className="w-8 h-8 text-muted-foreground mx-auto" />
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-iloveimg-blue hover:bg-iloveimg-blue/90 text-white px-8 py-3 text-lg font-medium rounded-lg mb-4 shadow-none border-0"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              "اختار صور"
            )}
          </Button>

          <p className="text-muted-foreground text-sm">
            أو اسحب الصور هنا
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </Card>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mt-6">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            جاري ضغط الصور... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {/* Results */}
      {compressedImages.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">الصور المضغوطة</h3>
            <Button onClick={downloadAll} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              تحميل الكل
            </Button>
          </div>

          <div className="space-y-4">
            {compressedImages.map((image) => (
              <Card key={image.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={image.compressedDataUrl}
                      alt="Compressed"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{image.originalFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(image.originalSize)} → {formatFileSize(image.compressedSize)}
                        <span className="text-green-600 mr-2">
                          ({image.compressionRatio}% أصغر)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => downloadImage(image)}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => removeImage(image.id)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
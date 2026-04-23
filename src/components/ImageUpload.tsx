import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, Video, Image as ImageIcon } from "lucide-react";

interface MediaUploadProps {
  onImagesUrls: (urls: string[]) => void;
  onVideoUrl: (url: string) => void;
  productId?: string;
  currentImages?: string[];
  currentVideo?: string;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const ImageUpload = ({ 
  onImagesUrls, 
  onVideoUrl, 
  productId, 
  currentImages = [],
  currentVideo = ""
}: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "video" | null>(null);
  const [images, setImages] = useState<string[]>(currentImages);
  const [video, setVideo] = useState<string>(currentVideo);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File, type: "image" | "video") => {
    const isImage = type === "image";
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    const maxSizeMB = isImage ? 5 : 50;

    // Validar tipo
    if (isImage && !file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Selecione uma imagem válida (PNG, JPG, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (!isImage && !file.type.startsWith("video/mp4")) {
      toast({
        title: "Arquivo inválido",
        description: "Selecione um vídeo MP4",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: `Máximo ${maxSizeMB}MB por ${isImage ? "imagem" : "vídeo"}`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadType(type);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const folder = isImage ? "images" : "videos";
      const filePath = productId 
        ? `products/${productId}/${folder}/${fileName}` 
        : `products/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Gerar URL pública
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        if (isImage) {
          const newImages = [...images, data.publicUrl];
          setImages(newImages);
          onImagesUrls(newImages);
          toast({ title: "Imagem adicionada com sucesso!" });
        } else {
          setVideo(data.publicUrl);
          onVideoUrl(data.publicUrl);
          toast({ title: "Vídeo adicionado com sucesso!" });
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: `Erro ao enviar ${type === "image" ? "imagem" : "vídeo"}`,
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadType(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesUrls(newImages);
  };

  const removeVideo = () => {
    setVideo("");
    onVideoUrl("");
  };

  return (
    <div className="space-y-4">
      {/* Imagens */}
      <div>
        <label className="text-sm font-medium mb-2 block">Imagens do Produto ({images.length}/{MAX_IMAGES})</label>
        
        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "image")}
          accept="image/*"
          className="hidden"
          disabled={isUploading || images.length >= MAX_IMAGES}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploading || images.length >= MAX_IMAGES}
          className="w-full"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          {isUploading && uploadType === "image" ? "Enviando..." : images.length >= MAX_IMAGES ? "Máximo atingido" : "Adicionar imagem"}
        </Button>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden border">
                <img src={url} alt={`Preview ${i + 1}`} className="w-full h-24 object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-destructive rounded-full text-destructive-foreground hover:opacity-80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          Máximo 5 imagens • 5MB cada • PNG, JPG ou WebP
        </p>
      </div>

      {/* Vídeo */}
      <div>
        <label className="text-sm font-medium mb-2 block">Vídeo do Produto (Opcional)</label>
        
        <input
          type="file"
          ref={videoInputRef}
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "video")}
          accept="video/mp4"
          className="hidden"
          disabled={isUploading}
        />

        {!video ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => videoInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Video className="mr-2 h-4 w-4" />
            {isUploading && uploadType === "video" ? "Enviando..." : "Adicionar vídeo"}
          </Button>
        ) : (
          <div className="relative rounded-lg overflow-hidden border bg-black">
            <video src={video} controls className="w-full h-40" />
            <button
              onClick={removeVideo}
              className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:opacity-80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          Máximo 1 vídeo • 50MB • Formato MP4
        </p>
      </div>
    </div>
  );
};

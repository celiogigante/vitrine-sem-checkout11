import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onImageUrl: (url: string) => void;
  productId?: string;
}

export const ImageUpload = ({ onImageUrl, productId }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Selecione uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Máximo 5MB por imagem",
        variant: "destructive",
      });
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload para Supabase
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = productId ? `products/${productId}/${fileName}` : `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Gerar URL pública
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onImageUrl(data.publicUrl);
        toast({ title: "Imagem enviada com sucesso!" });
        setPreview(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Erro ao enviar imagem",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-accent">
          <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:opacity-80"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            {isUploading && (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            )}
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Enviando..." : "Selecionar imagem"}
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        Máximo 5MB • PNG, JPG ou WebP
      </p>
    </div>
  );
};

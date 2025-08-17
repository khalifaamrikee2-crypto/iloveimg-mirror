import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";

const Index = () => {
  return (
    <div className="min-h-screen bg-iloveimg-gray">
      <Header />
      
      <main className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-iloveimg-text mb-4">
            ضغط الصورة
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            ضغط صور{" "}
            <span className="text-primary font-semibold">JPG</span> أو{" "}
            <span className="text-primary font-semibold">PNG</span> أو{" "}
            <span className="text-primary font-semibold">SVG</span> أو{" "}
            <span className="text-primary font-semibold">GIF</span>{" "}
            بأفضل جودة ونسبة ضغط. صغّر حجم صورك دفعة واحدة.
          </p>
        </div>

        {/* Upload Component */}
        <ImageUploader />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © iLoveIMG 2025 - أدوات تحرير الصور المجانية
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
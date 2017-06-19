#include <iostream>
#include <vector>
#include <stdexcept>
#include <fstream>
#include <memory>
#include <cstring>
#include <windows.h>
#include <tesseract/baseapi.h>
#include <leptonica/allheaders.h>


namespace OCR {

class Image {
    private:
        std::vector<std::uint8_t> Pixels;
        std::uint32_t width, height;
        std::uint16_t BitsPerPixel;

        void Flip(void* In, void* Out, int width, int height, unsigned int Bpp);

    public:
        explicit Image(HDC DC, int X, int Y, int Width, int Height);

        inline std::uint16_t GetBitsPerPixel() {return this->BitsPerPixel;}
        inline std::uint16_t GetBytesPerPixel() {return this->BitsPerPixel / 8;}
        inline std::uint16_t GetBytesPerScanLine() {return (this->BitsPerPixel / 8) * this->width;}
        inline int GetWidth() const {return this->width;}
        inline int GetHeight() const {return this->height;}
        inline const std::uint8_t* GetPixels() {return this->Pixels.data();}
};

void Image::Flip(void* In, void* Out, int width, int height, unsigned int Bpp) {
   unsigned long Chunk = (Bpp > 24 ? width * 4 : width * 3 + width % 4);
   unsigned char* Destination = static_cast<unsigned char*>(Out);
   unsigned char* Source = static_cast<unsigned char*>(In) + Chunk * (height - 1);

   while(Source != In)
   {
      std::memcpy(Destination, Source, Chunk);
      Destination += Chunk;
      Source -= Chunk;
   }
}

Image::Image(HDC DC, int X, int Y, int Width, int Height) : Pixels(), width(Width), height(Height), BitsPerPixel(32) {
    BITMAP Bmp = {0};
    HBITMAP hBmp = reinterpret_cast<HBITMAP>(GetCurrentObject(DC, OBJ_BITMAP));

    if (GetObject(hBmp, sizeof(BITMAP), &Bmp) == 0)
        throw std::runtime_error("BITMAP DC NOT FOUND.");

    RECT area = {X, Y, X + Width, Y + Height};
    HWND Window = WindowFromDC(DC);
    GetClientRect(Window, &area);

    HDC MemDC = GetDC(nullptr);
    HDC SDC = CreateCompatibleDC(MemDC);
    HBITMAP hSBmp = CreateCompatibleBitmap(MemDC, width, height);
    DeleteObject(SelectObject(SDC, hSBmp));

    BitBlt(SDC, 0, 0, width, height, DC, X, Y, SRCCOPY);
    unsigned int data_size = ((width * BitsPerPixel + 31) / 32) * 4 * height;
    std::vector<std::uint8_t> Data(data_size);
    this->Pixels.resize(data_size);

    BITMAPINFO Info = {sizeof(BITMAPINFOHEADER), static_cast<long>(width), static_cast<long>(height), 1, BitsPerPixel, BI_RGB, data_size, 0, 0, 0, 0};
    GetDIBits(SDC, hSBmp, 0, height, &Data[0], &Info, DIB_RGB_COLORS);
    this->Flip(&Data[0], &Pixels[0], width, height, BitsPerPixel);

    DeleteDC(SDC);
    DeleteObject(hSBmp);
    ReleaseDC(nullptr, MemDC);
}


/**
 * Take screenshot, analyze, return text
 */
int scan() {

    // Screen Dimensions
    int width = GetSystemMetrics(SM_CXSCREEN);
    int height = GetSystemMetrics(SM_CYSCREEN);

    // Window handle
    HWND SomeWindowHandle = GetDesktopWindow();
    HDC DC = GetDC(SomeWindowHandle);

    // Take Screenshot from handle & dimensions
    Image Img = Image(DC, 0, 0, width, height);
    ReleaseDC(SomeWindowHandle, DC);

    std::unique_ptr<tesseract::TessBaseAPI> tesseract_ptr(new tesseract::TessBaseAPI());

    tesseract_ptr->Init("../../tessdata", "eng");
    tesseract_ptr->SetImage(Img.GetPixels(), Img.GetWidth(), Img.GetHeight(), Img.GetBytesPerPixel(), Img.GetBytesPerScanLine());

    std::unique_ptr<char[]> utf8_text_ptr(tesseract_ptr->GetUTF8Text());
    std::cout<<utf8_text_ptr.get()<<"\n";

    return 0;
}
} // Namespace OCR

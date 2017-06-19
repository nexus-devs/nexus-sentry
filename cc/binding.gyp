#temporarily stored here, should be in root level for compilation
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "cc/src/addon.cc",
        "cc/src/NexusSentry.cc",
        "cc/src/OCR.cc"
      ],
      "include_dirs": [
        "cc/include/"
      ],
      "link_settings": {
          "libraries": [
              "-l <(module_root_dir)/cc/lib/liblept168",
              "-l <(module_root_dir)/cc/lib/libtesseract302",
          ],
      },
      "cflags": [
        "-std=c++11"
      ],
      "cflags_cc!": [
        "-fno-rtti",
        "-fno-exceptions"
      ]
    }
  ]
}

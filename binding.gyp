{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "./src/addon.cc",
        "./src/NexusSentry.cc",
        "./src/OCR.cc"
      ],
      "include_dirs": [
        "./include/"
      ],
      "link_settings": {
          "libraries": [
              "-l <(module_root_dir)/lib/liblept168",
              "-l <(module_root_dir)/lib/libtesseract302",
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

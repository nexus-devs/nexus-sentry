# Nexus-Sentry

[![Supported by Warframe Community Developers](https://github.com/Warframe-Community-Developers/banner/blob/master/banner.png)](https://github.com/Warframe-Community-Developers)

## Requirements
**This script depends on TesseractOCR 3.02 or higher**
You can compile it yourself from the [official TesseractOCR repo](https://github.com/tesseract-ocr/tesseract)<br />
If you're on Windows, you can grab pre-compiled binaries from the [UB Mannheim repo](https://github.com/UB-Mannheim/tesseract/wiki)


## Setup
1. Make sure to run a borderless-windowed instance of Warframe in 1920x1080
2. Maximize the trade chat and align it in the very top left corner
3. Run the script

**Note:** The detection works best on medium text-size, with emojis turned off, and brightness & contrast on 0 in video options


## Output
By default, requests are sent to **localhost:1337** with the following payload:

```
{
    'username': Username,
    'to': Request[0],
    'item': Request[1],
    'comp': Request[2],
    'type': Request[3],
    'price': Request[4],
    'user_key': 'user key for auth',
    'user_secret': 'password from ./sources/pwd.txt'
}
```

You can change these settings towards the end of NexusSentry.py
[![Nexus-Sentry](/banner.png)](https://github.com/nexus-devs)

- - - -
<br>

## Requirements
**This script depends on TesseractOCR 3.02 or higher**<br>
You can compile it yourself from the [official TesseractOCR repo](https://github.com/tesseract-ocr/tesseract)<br>
If you're on Windows, you can grab pre-compiled binaries from the [UB Mannheim repo](https://github.com/UB-Mannheim/tesseract/wiki)

<br>

## Setup
1. Make sure to run a borderless-windowed instance of Warframe in 1920x1080
2. Maximize the trade chat and align it in the very top left corner
3. Run the script

**Note:** The detection works best on medium text-size, with emojis turned off, and brightness & contrast on 0 in video options

<br>

## Output
By default, requests are sent to **localhost:3010/warframe/v1/requests/new** with the following payload:

```
{
    'user': Username,
    'offer': Request[0],
    'item': Request[1].title(),
    'component': Request[2].title(),
    'type': Request[3].title(),
    'price': int(Request[4]) if Requests[4] != 'null' else 'null'
}
```

<br>

## License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

<br>
<br>

- - - -

[![Supported by Warframe Community Developers](https://github.com/Warframe-Community-Developers/banner/blob/master/banner.png)](https://github.com/Warframe-Community-Developers)

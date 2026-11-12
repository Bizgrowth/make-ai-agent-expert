# Embeds IBM Plex Sans (from npm @fontsource/ibm-plex-sans) into template.html -> video.html
import base64, os
d = os.path.dirname(os.path.abspath(__file__))
css = ''
for w in (500, 600, 700):
    p = f'{d}/node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-{w}-normal.woff2'
    b = base64.b64encode(open(p, 'rb').read()).decode()
    css += f'@font-face{{font-family:"IBM Plex Sans";font-weight:{w};src:url(data:font/woff2;base64,{b}) format("woff2")}}\n'
open(f'{d}/video.html', 'w').write(open(f'{d}/template.html').read().replace('/*FONTS*/', css))

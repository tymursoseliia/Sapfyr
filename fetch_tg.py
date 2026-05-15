import urllib.request
with urllib.request.urlopen("https://t.me/s/Euro_avto_tut") as response:
    html = response.read().decode()
with open("tg_sample.html", "w", encoding="utf-8") as f:
    f.write(html)

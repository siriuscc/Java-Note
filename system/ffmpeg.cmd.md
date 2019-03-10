[TOC]


```bash
# 转为MP3
ffmpeg -i "input.webm" -f mp3  -vn "output.mp3"
 
# 查看信息
ffmpeg -i apple.mp4

# 增加音量，增加音量10dB
ffmpeg -i input.mp3 -vcodec copy -af  "volume=10dB" output.mp3

```
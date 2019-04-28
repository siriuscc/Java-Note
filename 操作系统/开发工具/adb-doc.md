

# adb整理

- 获取控件信息
```
adb shell uiautomator dump /sdcard/filename.xml
adb pull /sdcard/filename.xml filename.xml
adb shell uiautomator dump 
```

- 截图直接保存到电脑
```shell
adb shell screencap -p --compressed /sdcard/screen.png
adb pull /sdcard/screen.png 


--compressed

```

- 录制视频
```
adb shell screenrecord /sdcard/demo.mp4
# ctrl + C结束录制
adb shell screenrecord --bit-rate 5000000 /sdcard/demo.mp4
adb shell screenrecord --time-limit <TIME>

adb shell screenrecord --verbose /sdcard/demo.mp4 # 可以控制台输出日志
adb pull /sdcard/demo.mp4
```

- 获取屏幕控件xml
```
adb shell uiautomator dump /sdcard/filename.xml
adb pull /sdcard/filename.xml filename3.xml
```

- 输入
```
input text <string>
    input keyevent <key code number or name>
    input tap <x> <y>
    input swipe <x1> <y1> <x2> <y2>

adb shell input tap 800 50
adb shell input keyevent 3

```
>home键的keycode=3，back键的keycode=4.

- 滑动
```
adb shell input swipe 250 250 300 300
```

- 打电话(双卡失败，没试过)
```
adb shell am start -a android.intent.action.CALL -d tel:1008611
adb shell service call phone 2 s16 1008611
```

- 打开网站
```
adb shell am start -a android.intent.action.VIEW -d  http://gityuan.com
```

- 得到当前卡的序号
```
adb shell settings get global multi_sim_voice_call
```

- 发信息。双卡不成功
```	
adb shell am start -a android.intent.action.SENDTO -d sms:10086 --es sms_body "hello" --ez exit_on_sent true
```

- 查看包名
```
adb shell dumpsys package>package.txt
```

- 启动应用
```
adb shell am start -n 包名 /. 类名
adb shell am start -n com.android.camera/.Camera
adb shell am start -n com.taobao.taobao/com.taobao.search.mmd.SearchResultActivity -es sirius
```



- 输出一下所有包
```
adb shell pm list packages
adb shell pm list packages -f See their associated file.
adb shell pm list packages -d Filter to only show disabled packages.
adb shell pm list packages -e Filter to only show enabled packages.
adb shell pm list packages -s Filter to only show system packages.
adb shell pm list packages -3 Filter to only show third party packages.
adb shell pm list packages -i See the installer for the packages.
adb shell pm list packages -u Also include uninstalled packages.
adb shell pm list packages --user <USER_ID> The user space to query.
```

- 输出app路径
```
adb shell pm path com.android.phone
```

- 清除app缓存
```
adb shell pm clear com.test.abc
```




- 清除电池收集的数据
```
adb shell dumpsys batterystats --reset erases old collection data
```

- 测量耗电情况
```
adb shell dumpsys gfxinfo com.android.phone
```


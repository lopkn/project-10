pactl load-module module-null-sink sink_name=COMPUT
pactl load-module module-loopback source=alsa_input.usb-Logitech_Inc._Logi_USB_Headset_H340-00.analog-stereo sink=COMPUT latency_msec=1
pactl load-module module-loopback source=alsa_output.usb-Logitech_Inc._Logi_USB_Headset_H340-00.iec958-stereo.monitor sink=COMPUT latency_msec=1
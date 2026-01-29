#!/usr/bin/wish

entry .login
entry .password -show "*"

pack .login    -fill x -expand yes -padx 3 -pady 3
pack .password -fill x -expand yes -padx 3 -pady {0 3}

#grab .login
focus .login
#grab .password


bind .login <Return> {
	focus .password
	grab .password
}
bind .password <Return> {
	grab release .password
	focus .login
}

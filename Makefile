translations-download:
	crowdin download

translations-upload:
	crowdin upload

term:
	zellij --layout term.kdl attach qon-web-companion -c

term-kill:
	zellij delete-session qon-web-companion -f

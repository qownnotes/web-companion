TRANSFER_DIR := $(shell if [ -d "$(HOME)/NextcloudPrivate/Transfer" ]; then echo "$(HOME)/NextcloudPrivate/Transfer"; else echo "$(HOME)/Nextcloud/Transfer"; fi)

translations-download:
	crowdin download

translations-upload:
	crowdin upload

term:
	zellij --layout term.kdl attach qon-web-companion -c

term-kill:
	zellij delete-session qon-web-companion -f

git-create-patch:
	@echo "TRANSFER_DIR: ${TRANSFER_DIR}"; \
	git diff --no-ext-diff --staged --binary > ${TRANSFER_DIR}/web-companion.patch; \
	ls -l1t ${TRANSFER_DIR} | head -2

git-apply-patch:
	git apply ${TRANSFER_DIR}/web-companion.patch

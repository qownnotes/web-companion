# Use `just <recipe>` to run a recipe
# https://just.systems/man/en/

# By default, run the `--list` command
default:
    @just --list

# Variables

transferDir := `if [ -d "$HOME/NextcloudPrivate/Transfer" ]; then echo "$HOME/NextcloudPrivate/Transfer"; else echo "$HOME/Nextcloud/Transfer"; fi`

# Kill and run a terminal with the qon-web-companion session
[group('dev')]
term: term-kill term-run

# Open a terminal with the qon-web-companion session
[group('dev')]
term-run:
    zellij --layout term.kdl attach qon-web-companion -c

# Kill the qon-web-companion session
[group('dev')]
term-kill:
    zellij --layout term.kdl attach qon-web-companion -c

# Apply the patch to the qon-web-companion repository
[group('patch')]
git-apply-patch:
    git apply {{ transferDir }}/qon-web-companion.patch

# Create a patch from the staged changes in the qon-web-companion repository
[group('patch')]
@git-create-patch:
    echo "transferDir: {{ transferDir }}"
    git diff --no-ext-diff --staged --binary > {{ transferDir }}/qon-web-companion.patch
    ls -l1t {{ transferDir }}/ | head -2

# Download the translations from Crowdin
[group('translations')]
translations-download:
    crowdin download

# Upload the translations to Crowdin
[group('translations')]
translations-upload:
    crowdin upload

# Format all justfiles
[group('linter')]
just-format:
    #!/usr/bin/env bash
    # Find all files named "justfile" recursively and run just --fmt --unstable on them
    find . -type f -name "justfile" -print0 | while IFS= read -r -d '' file; do
        echo "Formatting $file"
        just --fmt --unstable -f "$file"
    done

# Use `just <recipe>` to run a recipe
# https://just.systems/man/en/

# By default, run the `--list` command
default:
    @just --list

# Variables

zellijSession := "qon-web-companion"
projectName := "qon-web-companion"
transferDir := `if [ -d "$HOME/NextcloudPrivate/Transfer" ]; then echo "$HOME/NextcloudPrivate/Transfer"; else echo "$HOME/Nextcloud/Transfer"; fi`

# Aliases

alias dev := run
alias fmt := format

# Open a terminal with the project session
[group('dev')]
term-run:
    zellij --layout term.kdl attach {{ zellijSession }} -c

# Kill the project session
[group('dev')]
term-kill:
    -zellij delete-session {{ zellijSession }} -f

# Kill and run a terminal with the project session
[group('dev')]
term: term-kill term-run

# Apply the patch to the project repository
[group('patch')]
git-apply-patch:
    git apply {{ transferDir }}/{{ projectName }}.patch

# Create a patch from the staged changes in the project repository
[group('patch')]
@git-create-patch:
    echo "transferDir: {{ transferDir }}"
    git diff --no-ext-diff --staged --binary > {{ transferDir }}/{{ projectName }}.patch
    ls -l1t {{ transferDir }}/ | head -2

# Download the translations from Crowdin
[group('translations')]
translations-download:
    crowdin download

# Upload the translations to Crowdin
[group('translations')]
translations-upload:
    crowdin upload

# Interactive npm run dev script selector
[group('dev')]
run:
    #!/usr/bin/env bash
    set -euo pipefail

    # Define the watch scripts with descriptions
    watch_scripts=(
        "dev-chrome: Google Chrome"
        "dev-firefox: Mozilla Firefox"
    )

    # Use fzf to select a script
    selected_script=$(printf '%s\n' "${watch_scripts[@]}" | fzf \
        --height 40% \
        --layout=reverse \
        --border \
        --prompt='Select NPM run script > ' \
        --preview='echo "Will run: npm run $(echo {} | cut -d: -f1)"' \
        --preview-window=up:1 \
        | cut -d: -f1)

    # Check if a script was selected
    if [[ -n "$selected_script" ]]; then
        # Get the full line for the selected script
        full_text=$(printf '%s\n' "${watch_scripts[@]}" | grep "^$selected_script:")

        # Set Zellij pane name
        if command -v zellij &> /dev/null; then
            zellij action rename-pane "$full_text"
        fi

        echo "Running: npm run $selected_script"
        npm run "$selected_script"
    else
        echo "No script selected. Exiting."
        exit 1
    fi

# Format all files
[group('linter')]
format args='':
    treefmt {{ args }}

# Format all files using pre-commit
[group('linter')]
format-all args='':
    composer install
    pre-commit run --all-files {{ args }}

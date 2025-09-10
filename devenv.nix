{
  pkgs,
  ...
}:

{
  # https://devenv.sh/supported-languages/javascript/
  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;

  # https://devenv.sh/packages/
  packages = with pkgs; [
    just # task runner
    crowdin-cli
    fzf # fuzzy finder
    zellij # smart terminal workspace
    imagemagick # screenshot resizing
  ];

  enterShell = ''
    echo "🛠️ QOwnNotes Web Companion dev shell"
    echo "📦 Node version: $(node --version | head -n 1)"
  '';

  # https://devenv.sh/git-hooks/
  git-hooks.hooks = {
    # https://devenv.sh/reference/options/#git-hookshookstreefmt
    # https://github.com/numtide/treefmt
    # https://github.com/numtide/treefmt-nix
    treefmt = {
      enable = true;
      settings.formatters = with pkgs; [
        nodePackages.prettier
        shfmt
        nixfmt-rfc-style
        statix
        taplo
      ];
    };

    # https://devenv.sh/reference/options/#git-hookshooksdeadnix
    # https://github.com/astro/deadnix
    deadnix = {
      enable = true;
      settings = {
        edit = true; # Allow to edit the file if it is not formatted
      };
    };
  };

  # See full reference at https://devenv.sh/reference/options/
}

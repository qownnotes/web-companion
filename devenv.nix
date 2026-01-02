{
  pkgs,
  ...
}:

{
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
  '';

  # See full reference at https://devenv.sh/reference/options/
}

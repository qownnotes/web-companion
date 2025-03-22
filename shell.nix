{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    nodejs_20
    just # task runner
    crowdin-cli
    fzf # fuzzy finder
    zellij # smart terminal workspace
    imagemagick # screenshot resizing
  ];

  shellHook = ''
    # Symlink the pre-commit hook into the .git/hooks directory
    ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit
  '';
}

{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      nodejs_20
      just # task runner
      crowdin-cli
      fzf # fuzzy finder
      zellij # smart terminal workspace
      imagemagick # screenshot resizing
    ];
}

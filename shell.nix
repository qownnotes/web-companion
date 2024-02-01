{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      nodejs_20
      gnumake
      crowdin-cli
      zellij # smart terminal workspace
    ];
}


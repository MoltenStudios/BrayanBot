{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/57b0ac48c781e14c939651571ec741125fa10463.tar.gz") {} }:

pkgs.mkShell {
  packages = [    
    pkgs.nodejs-18_x
    pkgs.nodePackages_latest.pnpm
    pkgs.nodePackages_latest.prettier
  ];
}
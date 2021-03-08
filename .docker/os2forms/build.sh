#!/bin/bash

if [ $# -eq 0 ]; then
  echo "WARNING: There was no tag-name provided!"
  echo "Script usage is: './build.sh tag-name'"
  echo "Example: './build.sh 1.0.3'"
  exit 0
fi

echo "Updating base image"
docker image pull drupal:8-apache-buster

echo "Building OS2Forms image with tag $1"
docker build ./ --build-arg OS2FORMS8_TAG=$1 -t os2forms/os2forms8:$1

if [ "$2" = "--push" ]; then
  echo "Authorization to https://hub.docker.com. :"
  echo "Login:"
  read -s DOCKERHUB_LOGIN
  echo "Password:"
  read -s DOCKERHUB_PASS
  echo "Authorization..."
  echo $DOCKERHUB_PASS | docker login --username $DOCKERHUB_LOGIN --password-stdin

  if [ $? -eq 0 ]; then
    echo "Pushing image to docker hub ..."
    docker push os2forms/os2forms8:$1
    echo "Check your image here https://hub.docker.com/repository/docker/os2forms/os2forms8"
  else
    echo "Image is not pushed to docker hub :("
  fi;
fi;

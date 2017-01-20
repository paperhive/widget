#!/bin/bash

set -eu
set -o pipefail

DIR=$(dirname $0)

# is this a pull request build? then don't deploy!
# NOTE: the decrypted secrets won't be available anyway if the PR comes from
#       another repository
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
  echo "This is a pull request. Don't push or deploy."
  exit 0
fi

# sanitize branch name
export PAPERHIVE_BRANCH="${TRAVIS_BRANCH//[^a-zA-Z0-9\-_]/-}"
export PAPERHIVE_COMMIT="${TRAVIS_COMMIT:0:8}"
export PAPERHIVE_DOCKER_IMAGE="${DOCKER_IMAGE}"

# upload docker image
gcloud config set project paperhive-c0ff33
openssl aes-256-cbc -K $encrypted_852bd548ac03_key -iv $encrypted_852bd548ac03_iv -in gcloud-secret.json.enc -out gcloud-secret.json -d
gcloud auth activate-service-account --key-file gcloud-secret.json
gcloud docker -- push ${PAPERHIVE_DOCKER_IMAGE}

#/bin/bash
git checkout fineract-origin
git remote add remoter-repo https://github.com/openMF/web-app.git
git fetch remoter-repo
git merge remoter-repo/master  --allow-unrelated-histories
git remote rm remoter-repo

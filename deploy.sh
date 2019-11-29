git fetch
LOCAL=$(git rev-parse HEAD);
REMOTE=$(git rev-parse @{u});
if [ $LOCAL != $REMOTE ]; then
    echo "Found changes, pulling from git"
    git pull
    wait
    echo "Deploying new code"
    yes | gcloud app deploy aerobic-forge-249209 --version prod
else
    echo "No changes"
fi
